// Типы данных для проекта "Веб-ларёк"

// --- Данные товара с API ---
export interface IProductApi {
  id: string;
  category: string;
  title: string;
  description: string;
  price: number | null;
  image: string;
}

// --- Данные для отображения товара ---
export interface IProductView {
  id: string;
  category: string;
  title: string;
  description: string;
  price: number; // 0 для бесценных
  imageUrl: string;
  inBasket: boolean;
}

// --- Корзина ---
export interface IBasketItem {
  id: string;
  title: string;
  price: number;
}
export interface IBasket {
  items: IBasketItem[];
  total: number;
}

// --- Заказ ---
export type PaymentType = 'online' | 'cash';
export interface IOrderFormStep1 {
  payment: PaymentType | '';
  address: string;
}
export interface IOrderFormStep2 {
  email: string;
  phone: string;
}
export interface IOrder {
  payment: PaymentType;
  address: string;
  email: string;
  phone: string;
  items: string[];
}

// --- События приложения ---
export type AppEvent =
  | 'products:changed'
  | 'product:selected'
  | 'card:select'
  | 'basket:add'
  | 'basket:remove'
  | 'basket:changed'
  | 'basket:order'
  | 'order:payment'
  | 'order:address'
  | 'order:step1:submit'
  | 'order:email'
  | 'order:phone'
  | 'order:step2:submit'
  | 'order:success'
  | 'modal:open'
  | 'modal:close';

// --- Интерфейсы моделей ---
export interface IProductModel {
  getProducts(): IProductApi[];
  setProducts(products: IProductApi[]): void;
  selectProduct(id: string): void;
  getSelectedProduct(): IProductApi | null;
}
export interface IBasketModel {
  getBasket(): IBasket;
  addItem(item: IBasketItem): void;
  removeItem(id: string): void;
  clear(): void;
  isInBasket(id: string): boolean;
  getCount(): number;
}
export interface IOrderModel {
  getOrder(): IOrder;
  setStep1(data: IOrderFormStep1): void;
  setStep2(data: IOrderFormStep2): void;
  setItems(items: string[]): void;
  getStep1(): IOrderFormStep1;
  getStep2(): IOrderFormStep2;
  clear(): void;
}

// --- Интерфейсы View ---
export interface IProductListView {
  render(products: IProductApi[], inBasket: (id: string) => boolean): void;
}
export interface IProductCardView {
  render(product: IProductApi, inBasket: boolean): void;
}
export interface IBasketView {
  render(basket: IBasket): void;
}
export interface IOrderFormView {
  renderStep1(data: IOrderFormStep1): void;
  renderStep2(data: IOrderFormStep2): void;
  showError(message: string): void;
}
export interface ISuccessView {
  render(total: number): void;
  getElement(): HTMLElement;
}
export interface IModalView {
  open(content: HTMLElement): void;
  close(): void;
}
