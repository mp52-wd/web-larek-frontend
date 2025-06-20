import { EventEmitter } from '../base/events';

export class PageView {
	private counter: HTMLElement;
	private gallery: HTMLElement;
	private basketButton: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		private events: EventEmitter
	) {
		this.counter = container.querySelector('.header__basket-counter');
		this.gallery = container.querySelector('.gallery');
		this.basketButton = container.querySelector('.header__basket');

		this.basketButton.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	setCounter(count: number) {
		this.counter.textContent = String(count);
	}

	renderGallery(items: HTMLElement[]) {
		this.gallery.innerHTML = '';
		items.forEach((item) => this.gallery.appendChild(item));
	}

	showError(message: string) {
		this.gallery.innerHTML = `<p>${message}</p>`;
	}
}
