import { IProductView } from '../../types';
import { EventEmitter } from '../base/events';

export abstract class CardView {
	protected element: HTMLElement;
	protected title: HTMLElement;
	protected image?: HTMLImageElement;
	protected price: HTMLElement;
	protected category?: HTMLElement;
	protected description?: HTMLElement;
	protected button?: HTMLButtonElement;

	constructor(
		template: HTMLTemplateElement,
		protected events: EventEmitter
	) {
		this.element = template.content.firstElementChild.cloneNode(
			true
		) as HTMLElement;
		this.title = this.element.querySelector('.card__title');
		this.image = this.element.querySelector('.card__image');
		this.price = this.element.querySelector('.card__price');
		this.category = this.element.querySelector('.card__category');
		this.description = this.element.querySelector('.card__text');
		this.button = this.element.querySelector('.card__button');
	}

	render(data: IProductView): HTMLElement {
		this.title.textContent = data.title;
		if (this.image) {
			this.image.src = data.imageUrl;
			this.image.alt = data.title;
		}
		if (data.price === null) {
			this.price.textContent = 'Бесценно';
			if (this.button) this.button.disabled = true;
		} else {
			this.price.textContent = `${data.price} синапсов`;
			if (this.button) this.button.disabled = false;
		}
		if (this.category) this.category.textContent = data.category;
		if (this.description) this.description.textContent = data.description;
		return this.element;
	}
}
