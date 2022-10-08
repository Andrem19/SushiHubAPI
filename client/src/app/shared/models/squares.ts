export interface ISquare {
    id: string;
    point: number;
    city: string;
    street: string;
    house: string;
    postCode: string;
    deliveryCost: number;
    freeZone: boolean;

    latN: number;
    latS: number;
    lonW: number;
    lonE: number;
}