import { EventEmitter } from '../base/events';

export abstract class FormView<T> {
	protected form: HTMLFormElement;
	protected submitButton: HTMLButtonElement;
	protected errorsContainer: HTMLElement;

	constructor(
		template: HTMLTemplateElement,
		protected events: EventEmitter,
		protected eventName: string
	) {
		this.form = template.content.firstElementChild!.cloneNode(
			true
		) as HTMLFormElement;
		this.submitButton = this.form.querySelector('button[type="submit"]');
		this.errorsContainer = this.form.querySelector('.form__errors');

		this.form.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.events.emit(this.eventName, { field, value });
		});

		this.form.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.eventName.split(':')[0]}:submit`);
		});
	}

	setValid(isValid: boolean) {
		if(this.submitButton) this.submitButton.disabled = !isValid;
	}

	setErrors(errors: string) {
		this.errorsContainer.textContent = errors;
	}

	render(data?: Partial<T>): HTMLFormElement {
		if (data) {
			Object.keys(data).forEach((key) => {
				const input = this.form.elements.namedItem(key) as HTMLInputElement;
				if (input) {
					input.value = String(data[key as keyof Partial<T>]);
				}
			});
		}
		return this.form;
	}
}
