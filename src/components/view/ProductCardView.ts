import type { IProductApi } from '../../types';
import { EventEmitter } from '../base/events';
import { CDN_URL } from '../../utils/constants';

export class ProductCardView {
  constructor(
    private template: HTMLTemplateElement,
    private events: EventEmitter
  ) {}

  render(product: IProductApi, inBasket: boolean) {
    const preview = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const image = preview.querySelector('.card__image') as HTMLImageElement;
    image.src = `${CDN_URL}/${product.image}`;
    image.alt = product.title;
    preview.querySelector('.card__category')!.textContent = product.category;
    preview.querySelector('.card__title')!.textContent = product.title;
    preview.querySelector('.card__text')!.textContent = product.description;
    preview.querySelector('.card__price')!.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесценно';
    const btn = preview.querySelector('.card__button, .button') as HTMLButtonElement;
    if (inBasket) {
      btn.textContent = 'Уже в корзине';
      btn.disabled = true;
    } else if (product.price === null) {
      btn.textContent = 'Бесценно';
      btn.disabled = true;
    } else {
      btn.textContent = 'В корзину';
      btn.disabled = false;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.events.emit('basket:add', { id: product.id });
      });
    }
    this.events.emit('modal:open', preview);
  }
}
