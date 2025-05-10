import './scss/styles.scss';
import { CDN_URL, API_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import { IOrderForm, IProductItem } from './types';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/Model/ApiModel';
import { BasketModel } from './components/Model/BasketModel';
import { DataModel } from './components/Model/DataModel';
import { FormModel } from './components/Model/FormModel';
import { Basket } from './components/View/Basket';
import { Card } from './components/View/Card';
import { CardPreview } from './components/View/CardPreview';
import { Contacts } from './components/View/FormContacts';
import { Order } from './components/View/FormOrder';
import { Modal } from './components/View/Modal';
import { Success } from './components/View/Success';

// получаем тэмплэйты для рендера элементов разметки
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// создаём экземпляры нужных нам классов
const apiModel = new ApiModel(CDN_URL, API_URL);
const events = new EventEmitter();
const dataModel = new DataModel(events);
const basketModel = new BasketModel();
const formModel = new FormModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(basketTemplate, events);
const order = new Order(orderTemplate, events);
const contacts = new Contacts(contactsTemplate, events);

// подписываемся на событие и когда оно произойдёт рендерим массив карточек
events.on('productCards:receive', () => {
  dataModel.productCards.forEach(item => {
    const card = new Card(cardCatalogTemplate, events, { onClick: () => events.emit('card:select', item) });
    ensureElement<HTMLElement>('.gallery').append(card.render(item));
  })
});

// получаем данные с сервера
apiModel.getListProductCard()
  .then(function (data: IProductItem[]) {
  // когда ответ пришёл перезаписываем данные о карточках, тем самым вызывая сеттер
  // сеттер вызовет событие productCards:receive
    dataModel.productCards = data;
  })
  .catch(error => console.log(error))

// получить объект данных "IProductItem" карточки по которой кликнули
events.on('card:select', (item: IProductItem) => { dataModel.setPreview(item) });

// открываем модальное окно карточки товара
events.on('modalCard:open', (item: IProductItem) => {
  const cardPreview = new CardPreview(cardPreviewTemplate, events)
  modal.content = cardPreview.render(item);
  modal.render();
});

// блок прокрутки страницы при открытом модальном окне
events.on('modal:open', () => {
  modal.locked = true;
});

// отменяем блок прокрутки страницы когда закрыли окно
events.on('modal:close', () => {
  modal.locked = false;
});

// добавляем товар в корзину
events.on('card:addBasket', () => {
  basketModel.setSelectedСard(dataModel.selectedСard);
  //показываем сколько товаров на значке корзины
  basket.headerBasketCount(basketModel.getCounter());
  modal.close();
});

// открытие модального окна корзины
events.on('basket:open', () => {
  basket.SumAllProducts(basketModel.getSumAllProducts()); // получаем сумму стоимостей товаров
  basket.items = basket.renderBasketItems(basketModel.basketProducts, cardBasketTemplate); // рендерим список товаров
  modal.content = basket.render(); // внутри модального окна наши товары
  modal.render();
});

// удаление товара из корзины
events.on('basket:basketItemRemove', (item: IProductItem) => {
  basketModel.deleteCardBasket(item); // удалим товар из массива
  basket.headerBasketCount(basketModel.getCounter()); // снова вызываем отображение количества товаров
  basket.SumAllProducts(basketModel.getSumAllProducts()); // получим новую сумму стоимостей
  basket.items = basket.renderBasketItems(basketModel.basketProducts, cardBasketTemplate); // рендерим обновленный список товаров
});

// открытие модального окна адреса и способа оплаты
events.on('order:open', () => {
  modal.content = order.render();
  modal.render();
// formModel.items теперь будет содержать массив идентификаторов всех товаров из корзины
  formModel.items = basketModel.basketProducts.map(item => item.id);
});

// подписываемся на событие которое получает выбранный способ оплаты
events.on('order:paymentSelect', (button: HTMLButtonElement) => { formModel.payment = button.name });

// подписываемся на событие изменения адреса, которое обновит данные адреса в модели
events.on('order:changeAddress', (data: { field: string, value: string }) => {
  formModel.setOrderAddress(data.field, data.value);
});

// валидация данных для адреса и оплаты
events.on('formErrors:address', (errors: Partial<IOrderForm>) => {
  const { address, payment } = errors; // получаем только свойства адреса и полаты
  order.valid = !address && !payment; // проверяем наличие ошибок
  order.formErrors.textContent = Object.values({address, payment}).filter(i => !!i).join(';');
  //получили строку с информацией об ошибках
})

// открытие модального окна почты и телефона
events.on('contacts:open', () => {
  modal.content = contacts.render();
  modal.render();
  formModel.total = basketModel.getSumAllProducts();
});

// подписываемся на событие изменения телефона и почты, которое обновит эти данные в модели
events.on('contacts:changeInput', (data: { field: string, value: string }) => {
  formModel.setOrderData(data.field, data.value);
});

// валидация данных для почты и телефона
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
  const { email, phone } = errors; // получаем ошибки почты и телефона
  contacts.valid = !email && !phone; // проверяем наличие ошибок
  contacts.formErrors.textContent = Object.values({phone, email}).filter(i => !!i).join(';');
  //получили строку с информацией об ошибках
})

// открытие модального окна успешного заказа
events.on('success:open', () => {
  apiModel.postOrderLot(formModel.getOrderLot())// получили объект с данными заказа и отправили его не сервер
    .then((data) => {
      console.log(data); // логируем ответ от сервера
      const success = new Success(successTemplate, events); // создаём экземпляр успешного заказа
      modal.content = success.render(basketModel.getSumAllProducts());
      basketModel.clearBasketProducts(); // очищаем корзину
      basket.headerBasketCount(basketModel.getCounter()); // отображаем количество товара на иконке корзины
      modal.render();
    })
});

// закрытие модального окна успешного заказа
events.on('success:close', () => modal.close());