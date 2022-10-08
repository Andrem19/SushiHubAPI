import { IAddress } from "./address";

export interface IOrderToCreate {
    basketId: string;
    shipToAddress: IAddress;
}

export interface IOrder {
    id: number;
    buyerEmail: string;
    orderDate: string;
    shipToAddress: IAddress;
    deliveryMethod: number;
    shippingPrice: string;
    readyToPickUp
    point?: string;
    refDisc?: boolean;
    acumDisc?: boolean;
    promoDisc?: string;
    orderItems: IOrderItem[];
    subtotal: number;
    status: string;
    discount: number;
    total: number;
  }
  
  export interface IOrderItem {
    productId: number;
    productName: string;
    pictureUrl: string;
    price: number;
    quantity: number;
  }