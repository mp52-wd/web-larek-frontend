import type { IOrder, IOrderFormStep1, IOrderFormStep2, PaymentType } from '../../types';
import { EventEmitter } from '../base/events';

export class OrderModel {
  private data: IOrder = {
    payment: 'online',
    address: '',
    email: '',
    phone: '',
    items: []
  };
  constructor(private events: EventEmitter) {}

  setStep1({ payment, address }: IOrderFormStep1) {
    this.data.payment = payment as PaymentType;
    this.data.address = address;
    this.events.emit('order:step1', this.getStep1());
  }

  setStep2({ email, phone }: IOrderFormStep2) {
    this.data.email = email;
    this.data.phone = phone;
    this.events.emit('order:step2', this.getStep2());
  }

  setItems(items: string[]) {
    this.data.items = items;
  }

  getOrder() { return this.data; }
  getStep1() { return { payment: this.data.payment, address: this.data.address }; }
  getStep2() { return { email: this.data.email, phone: this.data.phone }; }
  clear() {
    this.data = { payment: 'online', address: '', email: '', phone: '', items: [] };
    this.events.emit('order:cleared');
  }
}
