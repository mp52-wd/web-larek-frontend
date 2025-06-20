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
export type IOrderForm = IOrderFormStep1 & IOrderFormStep2;

export interface IOrder extends IOrderForm {
  total: number;
  items: string[];
}

// --- События приложения ---
export type AppEvent =
  | 'products:changed'
  | 'card:select'
  | 'basket:open'
  | 'basket:add'
  | 'basket:remove'
  | 'basket:changed'
  | 'basket:order'
  | 'order:changed'
  | 'order:submit'
  | 'contacts:submit'
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
  setStep1(data: IOrderFormStep1): void;
  setStep2(data: IOrderFormStep2): void;
  getOrderData(): IOrderForm;
  validateOrder(): boolean;
  validateContacts(): boolean;
  clear(): void;
}

// --- Интерфейсы View ---
export interface IPageView {
	setCounter(count: number): void;
	renderGallery(cards: HTMLElement[]): void;
	showError(message: string): void;
}

export interface IProductListView {
  setItems(elements: HTMLElement[]): void;
}
export interface IProductCardView {
  render(product: IProductView): HTMLElement;
}
export interface IBasketView {
  render(basket: IBasket): HTMLElement;
}

export interface IFormView {
	setValid(isValid: boolean): void;
	setErrors(errors: string[]): void;
	render(data: Partial<IOrderForm>): HTMLElement;
}

export interface IOrderStep1View extends IFormView {}
export interface IOrderStep2View extends IFormView {}

export interface ISuccessView {
  render(total: number): HTMLElement;
}
export interface IModalView {
  open(content: HTMLElement): void;
  close(): void;
}
