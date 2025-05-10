import { IProductItem } from "../../types";
import { IEvents } from "../base/events";

// интерфейс модели данных
export interface IDataModel {
  productCards: IProductItem[];
  selectedСard: IProductItem;
  setPreview(item: IProductItem): void;
}

export class DataModel implements IDataModel {
  protected _productCards: IProductItem[];
  selectedСard: IProductItem;

  constructor(protected events: IEvents) {
    this._productCards = []
  }

// сеттер для установки карточек товаров
// когда данные получены, вызывается событие 'productCards:receive'
  set productCards(data: IProductItem[]) {
    this._productCards = data;
    this.events.emit('productCards:receive');
  }
  
// геттер для получения массива с карточками
  get productCards() {
    return this._productCards;
  }

// когда выбрана карточка из массива вызовется 'modalCard:open'
  setPreview(item: IProductItem) {
    this.selectedСard = item;
    this.events.emit('modalCard:open', item)
  }
}