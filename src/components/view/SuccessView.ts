import { EventEmitter } from '../base/events';

export class SuccessView {
  constructor(
    private template: HTMLTemplateElement,
    private events: EventEmitter
  ) {}

  render(total: number) {
    const el = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    el.querySelector('.order-success__total')!.textContent = total.toString();
    el.querySelector('.order-success__close')?.addEventListener('click', () => {
      this.events.emit('modal:close');
    });
    this.events.emit('modal:open', el);
  }

  getElement() {
    return this.template.content.firstElementChild as HTMLElement;
  }
}
