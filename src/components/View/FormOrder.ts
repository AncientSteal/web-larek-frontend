import { IEvents } from "../base/events";

export interface IOrder {
  formOrder: HTMLFormElement;
  buttonPayment: HTMLButtonElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;
  paymentSelection: String;
  render(): HTMLElement;
}

export class Order implements IOrder {
  formOrder: HTMLFormElement;
  buttonPayment: HTMLButtonElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.formOrder = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
    this.buttonPayment = Array.from(this.formOrder.querySelectorAll('.button_alt'));
    this.buttonSubmit = this.formOrder.querySelector('.order__button');
    this.formErrors = this.formOrder.querySelector('.form__errors');

// привяжем к кнопкам оплаты обработчик клика, который вызовет событие order:paymentSelect
    this.buttonPayment.forEach(item => {
      item.addEventListener('click', () => {
        this.paymentSelection = item.name;
        events.emit('order:paymentSelect', item);
      });
    });

// когда вводим значения в поля iput вызываем событие order:changeAddress
    this.formOrder.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name; // получим имя поля куда вводим
      const value = target.value; // получим значения которое вводим
      this.events.emit('order:changeAddress', { field, value });
    });

// при отправке формы вызываем событие contacts:open (то есть следующую форму)
    this.formOrder.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('contacts:open');
    });
  }

// включаем рамку для выбранной кнопки оплаты
  set paymentSelection(paymentSelect: string) {
    this.buttonPayment.forEach(item => {
      // если имя кнопки оплаты совпадает с выбраной кнопкой оплаты то
      // стиль button_alt-active будет true и отобразится
      item.classList.toggle('button_alt-active', item.name === paymentSelect);
    })
  }

// если valid true то кнопка отправки будет активна
  set valid(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }

  render() {
    return this.formOrder
  }
}