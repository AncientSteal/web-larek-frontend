import { Card } from "./Card";
import { IActions, IProductItem } from "../../types";
import { IEvents } from "../base/events";

//интерфейс для открытой карточки товара
export interface ICard {
  text: HTMLElement;
  button: HTMLElement;
  render(data: IProductItem): HTMLElement;
}

//класс для открытой карточки товара
export class CardPreview extends Card implements ICard {
  text: HTMLElement;
  button: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    super(template, events, actions);
//инициализировали поля и методы родителя, добавляем элементы описания товара и кнопку купить к клону
    this.text = this._cardElement.querySelector('.card__text');
    this.button = this._cardElement.querySelector('.card__button');
//сразу привяжем к кнопке вызов события по клику которое вызовет событие card:addBasket
    this.button.addEventListener('click', () => { this.events.emit('card:addBasket') });
  }
//теперь кнопка не будет активна если цена null и изменит текст
  notSale(data:IProductItem) {
    if(data.price) {
      return 'Купить'
    } else {
      this.button.setAttribute('disabled', 'true')
      return 'Не продается'
    }
  }

  render(data: IProductItem): HTMLElement {
    this._cardCategory.textContent = data.category;
    this.cardCategory = data.category;
    this._cardTitle.textContent = data.title;
    this._cardImage.src = data.image;
    this._cardImage.alt = this._cardTitle.textContent;
    this._cardPrice.textContent = this.setPrice(data.price);
    this.text.textContent = data.description;
    this.button.textContent = this.notSale(data);
    return this._cardElement;
  }
}