import { IEvents } from "../base/events";

// интерфейс для модального окна успешной покупки
export interface ISuccess {
  success: HTMLElement;
  description: HTMLElement;
  button: HTMLButtonElement;
  render(total: number): HTMLElement;
}

export class Success {
  success: HTMLElement;
  description: HTMLElement;
  button: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.success = template.content.querySelector('.order-success').cloneNode(true) as HTMLElement;
    this.description = this.success.querySelector('.order-success__description');
    this.button = this.success.querySelector('.order-success__close');
  // при нажатии на кнопку вызовется событие success:close
    this.button.addEventListener('click', () => { events.emit('success:close') });
  }

  render(total: number) {
  // отобразим сколько было списано синапсов
    this.description.textContent = String(`Списано ${total} синапсов`);
    return this.success
  }
}