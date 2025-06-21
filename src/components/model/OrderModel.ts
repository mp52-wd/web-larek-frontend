import type { IOrderForm } from '../../types';
import { EventEmitter } from '../base/events';

export class OrderModel {
	private data: IOrderForm = {
		payment: '',
		address: '',
		email: '',
		phone: '',
	};

	private formErrors: Partial<Record<keyof IOrderForm, string>> = {};

	constructor(private events: EventEmitter) {}

	setOrderField(field: keyof IOrderForm, value: string) {
		(this.data as any)[field] = value;

		if (field === 'payment' || field === 'address') {
			this.validateOrder();
		} else if (field === 'email' || field === 'phone') {
			this.validateContacts();
		}
	}

	getOrderData() {
		return this.data;
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.data.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		if (!this.data.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('order:errors', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		const phoneRegex = /^\+7\d{10}$/;

		if (!this.data.email) {
			errors.email = 'Необходимо указать email';
		} else if (!emailRegex.test(this.data.email)) {
			errors.email = 'Неверный формат email';
		}

		if (!this.data.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!phoneRegex.test(this.data.phone)) {
			errors.phone = 'Неверный формат телефона. Ожидается +7xxxxxxxxxx';
		}

		this.formErrors = errors;
		this.events.emit('contacts:errors', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clear() {
		this.data = { payment: '', address: '', email: '', phone: '' };
	}
}
