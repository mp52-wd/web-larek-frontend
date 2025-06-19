import type { IProductApi } from '../../types';
import { EventEmitter } from '../base/events';

export class ProductModel {
  private products: IProductApi[] = [];
  private selectedProduct: IProductApi | null = null;
  constructor(private events: EventEmitter) {}

  setProducts(products: IProductApi[]) {
    this.products = products;
    this.events.emit('products:changed', this.products);
  }

  getProducts() {
    return this.products;
  }

  selectProduct(id: string) {
    this.selectedProduct = this.products.find(p => p.id === id) || null;
    this.events.emit('product:selected', this.selectedProduct);
  }

  getSelectedProduct() {
    return this.selectedProduct;
  }
}
