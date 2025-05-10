// интерфейс товара
export interface IProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// интерфейс формы заказа
export interface IOrderForm {
payment?: string;
address?: string;
phone?: string;
email?: string;
total?: string | number;
}

// интерфейс заказа пользователя
export interface IOrderLot{
  payment: string;
  address: string;
  email: string;
  phone: string;
  total: number;
  items: string[];
}

// интерфейс ответа от сервера по заказу
export interface IOrderResult {
  id: string;
  total: number;
}

// интерфейс заказа для отображения ошибок 
export interface IOrder extends IOrderForm {
  items: string[];
}

// тип ошибки формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// интерфейс для передачи обработчика к событию
export interface IActions {
  onClick: (event: MouseEvent) => void;
}