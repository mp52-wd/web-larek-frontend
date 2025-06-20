import { IProductView } from '../../types';
import { EventEmitter } from '../base/events';
import { CardView } from './CardView';

export class PreviewCardView extends CardView {
	constructor(template: HTMLTemplateElement, events: EventEmitter) {
		super(template, events);
	}

	render(data: IProductView): HTMLElement {
		const element = super.render(data);
		this.element.dataset.id = data.id;
		if (this.button) {
			this.button.textContent = data.inBasket ? 'Убрать из корзины' : 'В корзину';
			this.button.addEventListener('click', () => {
				if (data.inBasket) {
					this.events.emit('basket:remove', { id: data.id });
				} else {
					this.events.emit('basket:add', { id: data.id });
				}
			});
		}
		return element;
	}
}
