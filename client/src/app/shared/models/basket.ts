import {v4 as uuidv4} from 'uuid';

export interface IBasket {
    basket_id: string;
    items: IBasketItem[];
    point?: string;
    refDisc?: boolean;
    acumDisc?: boolean;
    promoDisc?: string;
    clientSecret?: string;
    paymentIntentId?: string;
    deliveryMethod?: number;
    shippingPrice?: string;
}

export interface IBasketItem {
    idProd: number;
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    type: string;
}

export class Basket implements IBasket {
    basket_id = uuidv4();
    items: IBasketItem[] = [];
}
export interface IBasketTotals {
    shipping: string;
    subtotal: number;
    discount: number;
    total: number;
    disc: number;
}
