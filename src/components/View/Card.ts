import { IActions, IProductItem } from "../../types";
import { IEvents } from "../base/events";

export interface ICard {
  render(data: IProductItem): HTMLElement;
}

// класс для карточки товара на странице
export class Card implements ICard {
  protected _cardElement: HTMLElement;
  protected _cardCategory: HTMLElement;
  protected _cardTitle: HTMLElement;
  protected _cardImage: HTMLImageElement;
  protected _cardPrice: HTMLElement;
// сопоставим категорию карточки и её стиль 
  protected _colors = <Record<string, string>>{
    "софт-скил": "soft",
    "хард-скил": "hard",
    "другое": "other",
    "дополнительное": "additional",
    "кнопка": "button"
  }
  
  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    this._cardElement = template.content.querySelector('.card').cloneNode(true) as HTMLElement; //внутри нашего template клонируем контент блока с классом .card
    //связываем с соответствующими полями нашего клона
    this._cardCategory = this._cardElement.querySelector('.card__category');
    this._cardTitle = this._cardElement.querySelector('.card__title');
    this._cardImage = this._cardElement.querySelector('.card__image');
    this._cardPrice = this._cardElement.querySelector('.card__price');
    
    if (actions?.onClick) {
      this._cardElement.addEventListener('click', actions.onClick);
    }
  }

// установим текст для элементов карточки
  protected setText(element: HTMLElement, value: unknown): string {
    if (element) {
      return element.textContent = String(value);
    }
  }

// получаем категорию для товара и устанавливаем текст категории
  set cardCategory(value: string) {
    this.setText(this._cardCategory, value);
  // устанавливаем в класс значение которое соответствует категории
    this._cardCategory.className = `card__category card__category_${this._colors[value]}`
  }

// текст кнопки меняется в зависимости от типа данных о цене
  protected setPrice(value: number | null): string {
    if (value === null) {
      return 'Бесценно'
    }
    return String(value) + ' синапсов'
  }

// сохраняем всё в нужные поля и забираем готовую карточку
  render(data: IProductItem): HTMLElement {
    this.cardCategory = data.category;
    this._cardTitle.textContent = data.title;
    this._cardImage.src = data.image;
    this._cardImage.alt = this._cardTitle.textContent;
    this._cardPrice.textContent = this.setPrice(data.price);
    return this._cardElement;
  }
}