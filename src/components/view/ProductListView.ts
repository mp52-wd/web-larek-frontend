import type { IProductApi } from '../../types';
import { EventEmitter } from '../base/events';
import { CDN_URL } from '../../utils/constants';

export class ProductListView {
  constructor(
    private root: HTMLElement,
    private cardTemplate: HTMLTemplateElement,
    private events: EventEmitter
  ) {}

  render(products: IProductApi[], inBasket: (id: string) => boolean) {
    this.root.innerHTML = '';
    products.forEach(product => {
      const card = this.cardTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
      card.dataset.id = product.id;
      const categoryEl = card.querySelector('.card__category');
      if (categoryEl) categoryEl.textContent = product.category;
      const titleEl = card.querySelector('.card__title');
      if (titleEl) titleEl.textContent = product.title;
      const image = card.querySelector('.card__image') as HTMLImageElement;
      if (image) {
        image.src = `${CDN_URL}/${product.image}`;
        image.alt = product.title;
      }
      const priceEl = card.querySelector('.card__price');
      if (priceEl) priceEl.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесценно';
      const btn = card.querySelector('.card__button, .button') as HTMLButtonElement;
      if (btn) {
        if (inBasket(product.id)) {
          btn.textContent = 'Уже в корзине';
          btn.disabled = true;
        } else if (product.price === null) {
          btn.textContent = 'Бесценно';
          btn.disabled = true;
        } else {
          btn.textContent = 'В корзину';
          btn.disabled = false;
        }
      }
      card.addEventListener('click', () => this.events.emit('card:select', { id: product.id }));
      this.root.appendChild(card);
    });
  }
}
