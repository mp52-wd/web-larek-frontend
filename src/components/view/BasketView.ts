import type { IBasket, IBasketItem } from '../../types';
import { EventEmitter } from '../base/events';

export class BasketView {
  constructor(
    private template: HTMLTemplateElement,
    private itemTemplate: HTMLTemplateElement,
    private events: EventEmitter
  ) {}

  render(basket: IBasket) {
    const basketEl = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const list = basketEl.querySelector('.basket__list') as HTMLElement;
    const total = basketEl.querySelector('.basket__price') as HTMLElement;
    const orderBtn = basketEl.querySelector('.basket__button') as HTMLButtonElement;

    list.innerHTML = '';
    basket.items.forEach((item, idx) => {
      const itemEl = this.renderItem(item, idx);
      list.appendChild(itemEl);
    });

    total.textContent = basket.total.toString();
    if (orderBtn) {
      orderBtn.disabled = basket.items.length === 0 || basket.total === 0;
      orderBtn.onclick = () => this.events.emit('basket:order');
    }

    this.events.emit('modal:open', basketEl);
  }

  renderItem(item: IBasketItem, idx: number) {
    const el = this.itemTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const indexEl = el.querySelector('.basket__item-index');
    if (indexEl) indexEl.textContent = String(idx + 1);
    el.querySelector('.card__title')!.textContent = item.title;
    el.querySelector('.card__price')!.textContent = item.price.toString();
    const removeBtn = el.querySelector('.basket__item-delete') as HTMLButtonElement;
    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.events.emit('basket:remove', { id: item.id });
      });
    }
    return el;
  }
}
