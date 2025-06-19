import type { IOrderFormStep1, IOrderFormStep2 } from '../../types';
import { EventEmitter } from '../base/events';

export class OrderFormView {
  constructor(
    private orderTemplate: HTMLTemplateElement,
    private contactsTemplate: HTMLTemplateElement,
    private events: EventEmitter
  ) {}

  renderStep1(data: IOrderFormStep1) {
    const form = this.orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
    const onlineBtn = form.querySelector('button[name="card"]') as HTMLButtonElement;
    const cashBtn = form.querySelector('button[name="cash"]') as HTMLButtonElement;
    const addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;
    const nextBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;

    if (onlineBtn) onlineBtn.classList.remove('button_alt_selected');
    if (cashBtn) cashBtn.classList.remove('button_alt_selected');
    if (onlineBtn && data.payment === 'online') onlineBtn.classList.add('button_alt_selected');
    if (cashBtn && data.payment === 'cash') cashBtn.classList.add('button_alt_selected');

    if (addressInput) addressInput.value = data.address;
    if (nextBtn) nextBtn.disabled = !(data.payment && data.address.trim());

    if (onlineBtn) onlineBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.events.emit('order:payment', { payment: 'online' });
    });
    if (cashBtn) cashBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.events.emit('order:payment', { payment: 'cash' });
    });
    if (addressInput) addressInput.addEventListener('input', (e) => {
      this.events.emit('order:address', { address: (e.target as HTMLInputElement).value });
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (nextBtn && !nextBtn.disabled) this.events.emit('order:step1:submit');
    });
    this.events.emit('modal:open', form);
  }

  renderStep2(data: IOrderFormStep2) {
    const form = this.contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
    const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
    const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
    const payBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;

    if (emailInput) emailInput.value = data.email;
    if (phoneInput) phoneInput.value = data.phone;
    if (payBtn) payBtn.disabled = !(data.email.trim() && data.phone.trim());

    if (emailInput) emailInput.addEventListener('input', (e) => {
      this.events.emit('order:email', { email: (e.target as HTMLInputElement).value });
      if (payBtn) payBtn.disabled = !((e.target as HTMLInputElement).value.trim() && phoneInput.value.trim());
    });
    if (phoneInput) phoneInput.addEventListener('input', (e) => {
      this.events.emit('order:phone', { phone: (e.target as HTMLInputElement).value });
      if (payBtn) payBtn.disabled = !(emailInput.value.trim() && (e.target as HTMLInputElement).value.trim());
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (payBtn && !payBtn.disabled) this.events.emit('order:step2:submit');
    });
    this.events.emit('modal:open', form);
  }

  showError(message: string) {
    // Можно реализовать через отдельный элемент или alert
    alert(message);
  }
}
