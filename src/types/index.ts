//Основные типы данных

//Категории товаров
type CategoryType = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил'; 

//Тип, описывающий ошибки валидации форм
type FormErrors = Partial<Record<keyof IOrderForm, string>>;

//Основные интерфейсы

//Интерфейс состояния главной страницы приложения
export interface IPage {
    counter: number;
    store: HTMLElement[];
}

//Карточка товара в магазине
export interface IProduct {
    id: string;
    category: CategoryType;
    title: string;
    description: string;
    image: string;
    price: number | null;
}

// Интерфейс, описывающий карточку товара
interface ICard extends IProduct {
    selected: boolean;
  }

//Интерфейс для корзины, элемент корзины и затем сама корзина со списком элементов
export interface IBasketItem {
    productId: string;
    quantity: number;
}
  export interface IBasket {
    items: IBasketItem[];
    totalPrice: number;
}

// Интерфейс, описывающий окошко заказа товара
export interface IOrder {
address: string;
payment: string;
}

// Интерфейс, описывающий окошко контакты
export interface IContacts {
phone: string;
email: string;
}

//Форма для заказа
export interface IOrderForm {
    payment?: string;
    address?: string;
    phone?: string;
    email?: string;
    total?: number;
    items?: string[];
}

//Массив товаров
export interface IProductItems {
    items: IProduct[]
}

//Список товаров в заказе
export interface IOrderList {
	total: number;
	items: string[];
}
