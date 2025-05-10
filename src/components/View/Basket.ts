import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IProductItem } from "../../types";
import { BasketItem } from '../View/BasketItem';

// интерфейс самой корзины
export interface IBasket {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  headerBasketButton: HTMLButtonElement;
  headerBasketCounter: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  headerBasketCount(value: number): void;
  SumAllProducts(sumAll: number): void;
  renderBasketItems(products: IProductItem[], cardTemplate: HTMLTemplateElement): HTMLElement[];
  render(): HTMLElement;
}

export class Basket implements IBasket {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  headerBasketButton: HTMLButtonElement;
  headerBasketCounter: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  
  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.basket = template.content.querySelector('.basket').cloneNode(true) as HTMLElement;
    this.title = this.basket.querySelector('.modal__title');
    this.basketList = this.basket.querySelector('.basket__list');
    this.headerBasketButton = document.querySelector('.header__basket');
    this.headerBasketCounter = document.querySelector('.header__basket-counter');
    this.button = this.basket.querySelector('.basket__button');
    this.basketPrice = this.basket.querySelector('.basket__price');
    this.headerBasketButton.addEventListener('click', () => { this.events.emit('basket:open') });
    this.button.addEventListener('click', () => { this.events.emit('order:open') });
    this.items = [];
  }
  
  // сеттер для определения состояния корзины
  set items(items: HTMLElement[]) {
    if (items.length) { //если не пустая
      this.basketList.replaceChildren(...items);
      this.button.removeAttribute('disabled');
    } else { //если пустая
      this.basketList.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
      this.button.setAttribute('disabled', 'disabled');
    }
  }
  // значение для счетчика на иконке корзины
  headerBasketCount(value: number) {
    this.headerBasketCounter.textContent = String(value);
  }
  // отобразим стоимость всех товаров строкой
  SumAllProducts(sumAll: number) {
    this.basketPrice.textContent = String(sumAll + ' синапсов');
  }
  // метод для рендера содержимого модального окна корзины
  renderBasketItems(products: IProductItem[], cardTemplate: HTMLTemplateElement): HTMLElement[] {
    let n = 0; // счётчик нумерации товаров
    return products.map((item) => {
      const basketItem = new BasketItem(cardTemplate, this.events, { onClick: () => this.events.emit('basket:basketItemRemove', item) });
      n += 1; // увеличиваем счётчик
      return basketItem.render(item, n); // рендерим элемент в корзине с его номером по списку
    });
  }

  render() {
    this.title.textContent = 'Корзина';
    return this.basket;
  }
}