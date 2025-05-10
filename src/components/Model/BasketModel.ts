import { IProductItem } from "../../types";

// интерфейс логики корзины
export interface IBasketModel {
  basketProducts: IProductItem[];
  getCounter: () => number;
  getSumAllProducts: () => number;
  setSelectedСard(data: IProductItem): void;
  deleteCardBasket(item: IProductItem): void;
  clearBasketProducts(): void
}

export class BasketModel implements IBasketModel {
  protected _basketProducts: IProductItem[];
  // получили список товаров в корзине, и после иницализировали как пустой массив
  constructor() {
    this._basketProducts = [];
  }
  
  // создали сеттер и геттер для массива товаров в корзине
  set basketProducts(data: IProductItem[]) {
    this._basketProducts = data;
  }
  get basketProducts() {
    return this._basketProducts;
  }

  // получаем количество товаров из массива
  getCounter() {
    return this.basketProducts.length;
  }

  // тут логика счёта суммарной стоимости товаров в корзине
  getSumAllProducts() {
    let sumAll = 0;
    this.basketProducts.forEach(item => {
      sumAll = sumAll + item.price;
    });
    return sumAll;
  }

  // добавим товар в корзину
  setSelectedСard(data: IProductItem) {
    this._basketProducts.push(data);
  }

  // удалим товар из корзины
  deleteCardBasket(item: IProductItem) {
  // получим индекс товара, а затем удалим его из массива
    const index = this._basketProducts.indexOf(item);
    if (index >= 0) {
      this._basketProducts.splice(index, 1);
    }
  }
  // очищаем массив товаров в корзине
  clearBasketProducts() {
    this.basketProducts = []
  }
}