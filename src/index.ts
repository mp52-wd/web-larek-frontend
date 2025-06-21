import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { ProductModel } from './components/model/ProductModel';
import { BasketModel } from './components/model/BasketModel';
import { OrderModel } from './components/model/OrderModel';
import { ModalView } from './components/view/ModalView';
import { SuccessView } from './components/view/SuccessView';
import type { IOrder, IOrderForm, IProductApi } from './types';
import { PageView } from './components/view/PageView';
import { CatalogCardView } from './components/view/CatalogCardView';
import { PreviewCardView } from './components/view/PreviewCardView';
import { BasketCardView } from './components/view/BasketCardView';
import { BasketView } from './components/view/BasketView';
import { OrderStep1View } from './components/view/OrderStep1View';
import { OrderStep2View } from './components/view/OrderStep2View';

// --- Инициализация ---
const api = new Api(API_URL);
const events = new EventEmitter();

// --- Шаблоны ---
const successTemplate = document.getElementById('success') as HTMLTemplateElement;
const catalogCardTemplate = document.getElementById(
	'card-catalog'
) as HTMLTemplateElement;
const previewCardTemplate = document.getElementById(
	'card-preview'
) as HTMLTemplateElement;
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const basketCardTemplate = document.getElementById(
	'card-basket'
) as HTMLTemplateElement;
const orderStep1Template = document.getElementById('order') as HTMLTemplateElement;
const orderStep2Template = document.getElementById(
	'contacts'
) as HTMLTemplateElement;
const modalEl = document.getElementById('modal-container') as HTMLElement;

// --- Модели ---
const productModel = new ProductModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

// --- Представления ---
const pageView = new PageView(document.body, events);
const modalView = new ModalView(modalEl, events);
const basketView = new BasketView(basketTemplate, events);
const successView = new SuccessView(successTemplate, events);
const orderStep1View = new OrderStep1View(orderStep1Template, events);
const orderStep2View = new OrderStep2View(orderStep2Template, events);

// --- Обработчики событий ---

// Загрузка продуктов
api
	.get('/product')
	.then((data: { items: IProductApi[] }) => {
		productModel.setProducts(data.items);
	})
	.catch((err) => {
		console.error(err);
		pageView.showError('Не удалось загрузить товары');
	});

// Рендер каталога
events.on('products:changed', (products: IProductApi[]) => {
	const catalogCards = products.map((product) => {
		const card = new CatalogCardView(catalogCardTemplate, events);
		return card.render({
			id: product.id,
			title: product.title,
			category: product.category,
			description: product.description,
			imageUrl: `${CDN_URL}/${product.image}`,
			price: product.price,
			inBasket: basketModel.isInBasket(product.id),
		});
	});
	pageView.renderGallery(catalogCards);
});

// Открытие превью карточки
events.on('card:select', ({ id }: { id: string }) => {
	productModel.selectProduct(id);
});

events.on('product:selected', (product: IProductApi) => {
	if (!product) return;
	const card = new PreviewCardView(previewCardTemplate, events);
	modalView.open(
		card.render({
			id: product.id,
			title: product.title,
			category: product.category,
			description: product.description,
			imageUrl: `${CDN_URL}/${product.image}`,
			price: product.price,
			inBasket: basketModel.isInBasket(product.id),
		})
	);
});

// Работа с корзиной
events.on('basket:open', () => {
	const basket = basketModel.getBasket();
	const basketItems = basket.items.map((item, index) => {
		const card = new BasketCardView(basketCardTemplate, events);
		return card.render(item, index);
	});
	basketView.setItems(basketItems);
	modalView.open(basketView.render(basket.total));
});

events.on('basket:add', ({ id }: { id: string }) => {
	const product = productModel.getProductById(id);
	if (product) {
		basketModel.addItem({
			id: product.id,
			title: product.title,
			price: product.price,
		});
		modalView.close();
	}
});

events.on('basket:remove', ({ id }: { id: string }) => {
	basketModel.removeItem(id);
});

events.on('basket:changed', (basket: { items: { id: string }[] }) => {
	pageView.setCounter(basket.items.length);
	// Если модалка с корзиной открыта, обновляем ее
	if (modalView.isOpen() && modalView.content.querySelector('.basket')) {
		events.emit('basket:open');
	}
});

// Оформление заказа
events.on('basket:order', () => {
	modalView.close();
	modalView.open(orderStep1View.render({ payment: '', address: '' }));
	orderStep1View.setValid(false);
	orderStep1View.setErrors('');
});

events.on(
	'order:changed',
	(data: { field: keyof IOrderForm; value: string }) => {
		orderModel.setOrderField(data.field, data.value);
	}
);

events.on(
	'order:errors',
	(errors: Partial<Record<keyof IOrderForm, string>>) => {
		const hasErrors = Object.keys(errors).length > 0;
		orderStep1View.setValid(!hasErrors);
		orderStep1View.setErrors(Object.values(errors).join('; '));
	}
);

events.on('order:submit', () => {
	if (orderModel.validateOrder()) {
		modalView.close();
		modalView.open(orderStep2View.render({ email: '', phone: '' }));
		orderStep2View.setValid(false);
		orderStep2View.setErrors('');
	}
});

events.on(
	'contacts:changed',
	(data: { field: keyof IOrderForm; value: string }) => {
		orderModel.setOrderField(data.field, data.value);
	}
);

events.on('contacts:validated', (data: { valid: boolean }) => {
	orderStep2View.setValid(data.valid);
});

events.on(
	'contacts:errors',
	(errors: Partial<Record<keyof IOrderForm, string>>) => {
		const hasErrors = Object.keys(errors).length > 0;
		orderStep2View.setValid(!hasErrors);
		orderStep2View.setErrors(Object.values(errors).join('; '));
	}
);

events.on('contacts:submit', () => {
	if (orderModel.validateContacts()) {
		const orderData = orderModel.getOrderData();
		const basket = basketModel.getBasket();
		const order: IOrder = {
			...orderData,
			total: basket.total,
			items: basket.items
				.filter((item) => item.price !== null)
				.map((item) => item.id),
		};

		api
			.post('/order', order)
			.then((res: { id: string; total: number }) => {
				modalView.close();
				modalView.open(successView.render(res.total));
				basketModel.clear();
				orderModel.clear();
			})
			.catch((err) => {
				console.error(err);
				const errorMessages = err.data?.errors
					? Object.values(err.data.errors).join('; ')
					: 'Ошибка отправки заказа';
				orderStep2View.setErrors(errorMessages);
			});
	}
});

events.on('order:success', () => {
	modalView.close();
});

// Управление модальным окном
events.on('modal:close', () => {
	modalView.close();
});
