import { EventEmitter } from '../base/events';

export class ModalView {
  private modal: HTMLElement;
  public content: HTMLElement;
  private closeBtn: HTMLElement;
  private _isOpen = false;

  constructor(modal: HTMLElement, private events: EventEmitter) {
    this.modal = modal;
    this.content = modal.querySelector('.modal__content') as HTMLElement;
    this.closeBtn = modal.querySelector('.modal__close') as HTMLElement;

    this.closeBtn.addEventListener('click', () => this.events.emit('modal:close'));

    this.modal.addEventListener('mousedown', (e) => {
      if (e.target === this.modal) {
        this.events.emit('modal:close');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this._isOpen) {
        this.events.emit('modal:close');
      }
    });
  }

  open(content: HTMLElement) {
    this.content.innerHTML = '';
    this.content.appendChild(content);
    this.modal.classList.add('modal_active');
    this._isOpen = true;
  }

  close() {
    this.modal.classList.remove('modal_active');
    this.content.innerHTML = '';
    this._isOpen = false;
  }

  isOpen(): boolean {
    return this._isOpen;
  }
}
