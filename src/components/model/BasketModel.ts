import type { IBasketItem, IBasket } from '../../types';
import { EventEmitter } from '../base/events';

export class BasketModel {
  private items: IBasketItem[] = [];
  constructor(private events: EventEmitter) {}

  addItem(item: IBasketItem) {
    if (!this.items.find(i => i.id === item.id)) {
      this.items.push(item);
      this.events.emit('basket:changed', this.getBasket());
    }
  }

  removeItem(id: string) {
    this.items = this.items.filter(i => i.id !== id);
    this.events.emit('basket:changed', this.getBasket());
  }

  clear() {
    this.items = [];
    this.events.emit('basket:changed', this.getBasket());
  }

  getBasket(): IBasket {
    return {
      items: this.items,
      total: this.items.reduce((sum, i) => sum + i.price, 0)
    };
  }

  isInBasket(id: string) {
    return this.items.some(i => i.id === id);
  }

  getCount() {
    return this.items.length;
  }
}
