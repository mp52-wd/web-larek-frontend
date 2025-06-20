import { IBasketItem } from '../../types';
import { EventEmitter } from '../base/events';

export class BasketCardView {
	protected element: HTMLElement;
	protected title: HTMLElement;
	protected price: HTMLElement;
	protected index: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, protected events: EventEmitter) {
		this.element = template.content
			.querySelector('.basket__item')
			.cloneNode(true) as HTMLElement;
		this.title = this.element.querySelector('.card__title');
		this.price = this.element.querySelector('.card__price');
		this.index = this.element.querySelector('.basket__item-index');
		this.button = this.element.querySelector('.basket__item-delete');
	}

	render(data: IBasketItem, itemIndex: number): HTMLElement {
		this.element.dataset.id = data.id;
		this.title.textContent = data.title;
		this.price.textContent = `${data.price} синапсов`;
		this.index.textContent = (itemIndex + 1).toString();
		this.button.addEventListener('click', () => {
			this.events.emit('basket:remove', { id: data.id });
		});
		return this.element;
	}
}
