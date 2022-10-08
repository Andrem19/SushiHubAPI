import { IAddress } from "./address";

export interface IUser {
    email: string;
    token: string;
    displayName: string;
    point: string;
    roles: string[];
    refDiscount: number;
    acumDiscount: boolean;
    myRefCode: string;
    address: IAddress;
    telegramBotChatId?: string;
}
