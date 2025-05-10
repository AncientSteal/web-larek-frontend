import { IEvents } from "../base/events";

export interface IContacts {
  formContacts: HTMLFormElement;
  inputs: HTMLInputElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;
  render(): HTMLElement;
}

export class Contacts implements IContacts {
  formContacts: HTMLFormElement;
  inputs: HTMLInputElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.formContacts = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
    this.inputs = Array.from(this.formContacts.querySelectorAll('.form__input'));
    this.buttonSubmit = this.formContacts.querySelector('.button');
    this.formErrors = this.formContacts.querySelector('.form__errors');

// на поля ввода привяжем обработчик, который при вводе вызовет событие contacts:changeInput
    this.inputs.forEach(item => {
      item.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        const field = target.name;
        const value = target.value;
        this.events.emit(`contacts:changeInput`, { field, value });
      })
    })

// при отправке формы вызовем событие success:open (для открытия модального окна)
    this.formContacts.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('success:open');
    });
  }

// если valid true то кнопка отправки будет активна
  set valid(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }

  render() {
    return this.formContacts
  }
}