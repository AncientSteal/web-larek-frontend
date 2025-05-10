import { IEvents } from '../base/events';
import { FormErrors } from '../../types/index'

// интерфейс для работы с формами
export interface IFormModel {
  payment: string;
  address: string;
  email: string;
  phone: string;
  total: number;
  items: string[];
  setOrderAddress(field: string, value: string): void
  validateOrder(): boolean;
  setOrderData(field: string, value: string): void
  validateContacts(): boolean;
  getOrderLot(): object;
}

// этот класс отвечает за работу всех форм
export class FormModel implements IFormModel {
  payment: string;
  address: string;
  email: string;
  phone: string;
  total: number;
  items: string[];
  formErrors: FormErrors = {};

  constructor(protected events: IEvents) {
    this.payment = '';
    this.address = '';
    this.email = '';
    this.phone = '';
    this.total = 0;
    this.items = [];
  }

  // получим значение введёного адреса
  setOrderAddress(field: string, value: string) {
    if (field === 'address') {
      this.address = value;
    }
  // если адрес валидный, вызываем событие
    if (this.validateOrder()) {
      this.events.emit('order:ready', this.getOrderLot());
    }
  }

  // получим значения введённых телефона и почты
  setOrderData(field: string, value: string) {
    if (field === 'email') {
      this.email = value;
    } else if (field === 'phone') {
      this.phone = value;
    }
  // если данные валидны, вызываем событие order:ready
    if (this.validateContacts()) {
      this.events.emit('order:ready', this.getOrderLot());
    }
  }

  // проверим валидность адреса
  validateOrder() {
    const regexp = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;
    const errors: typeof this.formErrors = {};
    if (!this.address) {
      errors.address = 'Необходимо указать адрес'
    } else if (!regexp.test(this.address)) {
      errors.address = 'Некорректный адрес'
    } else if (!this.payment) {
      errors.payment = 'Выберите способ оплаты'
    }
    this.formErrors = errors;
    this.events.emit('formErrors:address', this.formErrors);
    return Object.keys(errors).length === 0;
  }
  
  // проверяем валидность телефона и почты
  validateContacts() {
    const regexpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const regexpPhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;
    const errors: typeof this.formErrors = {};
    if (!this.email) {
      errors.email = 'Необходимо указать электронную почту'
    } else if (!regexpEmail.test(this.email)) {
      errors.email = 'Некорректный адрес электронной почты'
    }
    if (!this.phone) {
      errors.phone = 'Необходимо указать телефон'
    } else if (!regexpPhone.test(this.phone)) {
      errors.phone = 'Некорректный номер телефона'
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }
  
  // получаем объект с данными заказа пользователя
  getOrderLot() {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
      total: this.total,
      items: this.items,
    }
  }
}