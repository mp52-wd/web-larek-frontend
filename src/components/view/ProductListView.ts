import type { IProductApi } from '../../types';
import { EventEmitter } from '../base/events';
import { CDN_URL } from '../../utils/constants';

export class ProductListView {
  constructor(private root: HTMLElement) {}

  setItems(items: HTMLElement[]) {
    this.root.innerHTML = '';
    items.forEach((item) => {
      this.root.appendChild(item);
    });
  }

  showError(message: string) {
    this.root.innerHTML = `<div style="color:red">${message}</div>`;
  }
}
