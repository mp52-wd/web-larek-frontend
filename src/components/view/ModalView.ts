export class ModalView {
  private modal: HTMLElement;
  private content: HTMLElement;
  private closeBtn: HTMLElement;
  private escHandler: (e: KeyboardEvent) => void;

  constructor(modal: HTMLElement) {
    this.modal = modal;
    this.content = modal.querySelector('.modal__content') as HTMLElement;
    this.closeBtn = modal.querySelector('.modal__close') as HTMLElement;
    this.escHandler = (e) => {
      if (e.key === 'Escape') this.close();
    };
    this.closeBtn.addEventListener('click', () => this.close());
    this.modal.addEventListener('mousedown', (e) => {
      if (e.target === this.modal) this.close();
    });
  }

  open(content: HTMLElement) {
    this.content.innerHTML = '';
    this.content.appendChild(content);
    this.modal.classList.add('modal_active');
    document.addEventListener('keydown', this.escHandler);
  }

  close() {
    this.modal.classList.remove('modal_active');
    this.content.innerHTML = '';
    document.removeEventListener('keydown', this.escHandler);
  }
}
