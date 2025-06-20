import { EventEmitter } from '../base/events';

export class SuccessView {
	protected element: HTMLElement;
	protected totalElement: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(
		template: HTMLTemplateElement,
		protected events: EventEmitter
	) {
		this.element = template.content
			.querySelector('.order-success')
			.cloneNode(true) as HTMLElement;
		this.totalElement = this.element.querySelector('.order-success__total');
		this.closeButton = this.element.querySelector('.order-success__close');

		this.closeButton.addEventListener('click', () => {
			this.events.emit('order:success');
		});
	}

	render(total: number): HTMLElement {
		this.totalElement.textContent = String(total);
		return this.element;
	}
}
