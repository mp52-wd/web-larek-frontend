import type { IOrderForm, IOrderFormStep1, IOrderFormStep2, PaymentType } from '../../types';
import { EventEmitter } from '../base/events';

export class OrderModel {
	private data: IOrderForm = {
		payment: 'online',
		address: '',
		email: '',
		phone: '',
	};
	constructor(private events: EventEmitter) {}

	setStep1({ payment, address }: IOrderFormStep1) {
		this.data.payment = payment as PaymentType;
		this.data.address = address;
		this.events.emit('order:validated', {
			valid: this.validateOrder(),
		});
	}

	setStep2({ email, phone }: IOrderFormStep2) {
		this.data.email = email;
		this.data.phone = phone;
		this.events.emit('contacts:validated', {
			valid: this.validateContacts(),
		});
	}

	getOrderData() {
		return this.data;
	}

	validateOrder() {
		return !!this.data.address && !!this.data.payment;
	}

	validateContacts() {
		return !!this.data.email && !!this.data.phone;
	}

	clear() {
		this.data = { payment: 'online', address: '', email: '', phone: '' };
		// Consider if an event is needed here
	}
}
