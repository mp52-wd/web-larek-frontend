import type { IBasket, IBasketItem } from '../../types';
import { EventEmitter } from '../base/events';

export class BasketView {
	private element: HTMLElement;
	private list: HTMLElement;
	private total: HTMLElement;
	private orderButton: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, private events: EventEmitter) {
		this.element = template.content
			.querySelector('.basket')
			.cloneNode(true) as HTMLElement;
		this.list = this.element.querySelector('.basket__list');
		this.total = this.element.querySelector('.basket__price');
		this.orderButton = this.element.querySelector('.basket__button');

		this.orderButton.addEventListener('click', () => {
			this.events.emit('basket:order');
		});
	}

	setItems(items: HTMLElement[]) {
		this.list.innerHTML = '';
		items.forEach((item) => this.list.appendChild(item));
	}

	render(total: number): HTMLElement {
		this.total.textContent = String(total);
		this.orderButton.disabled = total === 0;
		return this.element;
	}
}
