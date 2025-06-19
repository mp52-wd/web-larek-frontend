import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { ProductModel } from './components/model/ProductModel';
import { BasketModel } from './components/model/BasketModel';
import { OrderModel } from './components/model/OrderModel';
import { ProductListView } from './components/view/ProductListView';
import { ProductCardView } from './components/view/ProductCardView';
import { BasketView } from './components/view/BasketView';
import { ModalView } from './components/view/ModalView';
import { OrderFormView } from './components/view/OrderFormView';
import { SuccessView } from './components/view/SuccessView';
import type { IProductApi } from './types';

const api = new Api(API_URL);
const events = new EventEmitter();

// DOM
const gallery = document.querySelector('.gallery') as HTMLElement;
const cardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const previewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const basketItemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
const modalEl = document.getElementById('modal-container') as HTMLElement;
const basketButton = document.querySelector('.header__basket') as HTMLElement;
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
const successTemplate = document.getElementById('success') as HTMLTemplateElement;

// Models
const productModel = new ProductModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

// Views
const productListView = new ProductListView(gallery, cardTemplate, events);
const productCardView = new ProductCardView(previewTemplate, events);
const basketView = new BasketView(basketTemplate, basketItemTemplate, events);
const modalView = new ModalView(modalEl);
const orderFormView = new OrderFormView(orderTemplate, contactsTemplate, events);
const successView = new SuccessView(successTemplate, events);

function updateBasketCounter() {
  basketCounter.textContent = basketModel.getCount().toString();
}

// API load
api.get('/product')
  .then((data: any) => {
    productModel.setProducts(Array.isArray(data.items) ? data.items : []);
  })
  .catch((err) => {
    gallery.innerHTML = `<div style=\"color:red\">Ошибка загрузки товаров: ${err}</div>`;
  });

// Каталог товаров
// Рендерим каталог при изменении товаров
events.on('products:changed', (products: IProductApi[]) => {
  productListView.render(products, (id) => basketModel.isInBasket(id));
});
// Клик по карточке
events.on('card:select', ({ id }: { id: string }) => {
  productModel.selectProduct(id);
});
// Открытие модалки товара
events.on('product:selected', (product: IProductApi | null) => {
  if (product) {
    productCardView.render(product, basketModel.isInBasket(product.id));
  }
});
// Добавление товара в корзину
events.on('basket:add', ({ id }: { id: string }) => {
  const product = productModel.getProducts().find(p => p.id === id);
  if (product && !basketModel.isInBasket(id) && product.price !== null) {
    basketModel.addItem({ id: product.id, title: product.title, price: product.price });
    updateBasketCounter();
    events.emit('modal:close');
  }
});
// Удаление товара из корзины
events.on('basket:remove', ({ id }: { id: string }) => {
  basketModel.removeItem(id);
  updateBasketCounter();
});
// Открытие корзины
basketButton.addEventListener('click', () => {
  basketView.render(basketModel.getBasket());
});
// Ререндер корзины при изменении
events.on('basket:changed', () => {
  updateBasketCounter();
  // Проверяем, открыта ли корзина (по наличию .basket в .modal__content внутри активной модалки)
  const modalContent = document.querySelector('.modal_active .modal__content');
  if (modalContent && modalContent.querySelector('.basket')) {
    basketView.render(basketModel.getBasket());
  }
});
// Оформление заказа (шаг 1)
events.on('basket:order', () => {
  orderModel.setStep1({ payment: 'online', address: '' });
  orderFormView.renderStep1(orderModel.getStep1());
});
// Обработка выбора оплаты
events.on('order:payment', ({ payment }: { payment: string }) => {
  const { address } = orderModel.getOrder();
  orderModel.setStep1({ payment: payment as import('./types').PaymentType, address });
  orderFormView.renderStep1(orderModel.getStep1());
});
// Обработка адреса
events.on('order:address', ({ address }: { address: string }) => {
  const { payment } = orderModel.getOrder();
  orderModel.setStep1({ payment, address });
});
// Переход к шагу 2
events.on('order:step1:submit', () => {
  orderFormView.renderStep2(orderModel.getStep2());
});
// Обработка email
events.on('order:email', ({ email }: { email: string }) => {
  const { phone } = orderModel.getOrder();
  orderModel.setStep2({ email, phone });
});
// Обработка телефона
events.on('order:phone', ({ phone }: { phone: string }) => {
  const { email } = orderModel.getOrder();
  orderModel.setStep2({ email, phone });
});
// Отправка заказа
events.on('order:step2:submit', () => {
  const order = orderModel.getOrder();
  if (!order.payment || !order.address.trim() || !order.email.trim() || !order.phone.trim()) {
    orderFormView.showError('Заполните все поля');
    return;
  }
  const basket = basketModel.getBasket();
  const items = basket.items.filter(i => i.price !== null).map(i => i.id);
  const total = basket.total;
  if (items.length === 0) {
    orderFormView.showError('В корзине нет товаров для заказа');
    return;
  }
  orderModel.setItems(items);
  // Добавляем total в объект заказа
  const orderToSend = { ...orderModel.getOrder(), total };
  api.sendOrder(orderToSend)
    .then((result: any) => {
      // Если сервер вернул id и total — показываем успех
      if (result && result.id && typeof result.total === 'number') {
        successView.render(result.total);
        basketModel.clear();
        orderModel.clear();
      } else if (result && typeof result.total === 'number') {
        // Если только total — тоже успех
        successView.render(result.total);
        basketModel.clear();
        orderModel.clear();
      } else {
        // Если пришёл только error — показываем alert
        orderFormView.showError(result?.error || 'Ошибка оформления заказа');
      }
    })
    .catch(() => orderFormView.showError('Ошибка оформления заказа'));
});
// Модалки
// Открытие
events.on('modal:open', (content: HTMLElement) => {
  modalView.open(content);
});
// Закрытие
events.on('modal:close', () => {
  modalView.close();
});

// TODO: Реализовать оформление заказа, шаги формы, валидацию, успешное оформление, очистку корзины и заказа, блокировку кнопок, отображение ошибок и успеха, согласно brief.md и архитектуре.
