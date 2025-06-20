import type { IOrderFormStep2 } from '../../types';
import { EventEmitter } from '../base/events';
import { FormView } from './FormView';

export class OrderStep2View extends FormView<IOrderFormStep2> {
	constructor(template: HTMLTemplateElement, events: EventEmitter) {
		super(template, events, 'contacts:changed');
	}
}
