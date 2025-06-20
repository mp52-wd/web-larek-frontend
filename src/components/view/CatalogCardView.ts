import { IProductView } from '../../types';
import { EventEmitter } from '../base/events';
import { CardView } from './CardView';

export class CatalogCardView extends CardView {
	constructor(template: HTMLTemplateElement, events: EventEmitter) {
		super(template, events);
		this.element.addEventListener('click', () => {
			this.events.emit('card:select', { id: this.element.dataset.id });
		});
	}

	render(data: IProductView): HTMLElement {
		const element = super.render(data);
		this.element.dataset.id = data.id;
		return element;
	}
}
