import type { IOrderFormStep1, PaymentType } from '../../types';
import { EventEmitter } from '../base/events';
import { FormView } from './FormView';

export class OrderStep1View extends FormView<IOrderFormStep1> {
	private paymentButtons: HTMLButtonElement[];

	constructor(template: HTMLTemplateElement, events: EventEmitter) {
		super(template, events, 'order:changed');

		this.paymentButtons = Array.from(
			this.form.querySelectorAll('.button_alt')
		);
		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.setSelected(button.name as PaymentType);
				this.events.emit('order:changed', {
					field: 'payment',
					value: button.name,
				});
			});
		});
	}

	setSelected(name: PaymentType) {
		this.paymentButtons.forEach((button) => {
			button.classList.toggle('button_alt-active', button.name === name);
		});
	}

	render(data?: Partial<IOrderFormStep1>): HTMLFormElement {
		const form = super.render(data);
		if (data?.payment) {
			this.setSelected(data.payment as PaymentType);
		}
		return form;
	}
}
