
//Globální Singleton třída, pro sdílení dat mezi stránkami

import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
    private Token: string;

    public readonly url: string = "http://localhost:8088";
    public RSAKeyString: string;

    public AESKey = [23, 54, 87, 23, 2, 100, 4, 8, 8, 46, 102, 48, 12, 123, 14, 2];
    

    private Orders = [];
    private Food;

    public setFood(food) {
        this.Food = food;
    }

    public getFood() {
        return this.Food;
    }

    constructor() {
        this.Token = "";
    }

    public setToken(value: string) {
        this.Token = value;
    }

    public getToken(): string {
        return this.Token;
    }

    public AddOrder(order) {
        this.Orders.push(order);
    }

    public RemoveMenuFromOrder(menu) {
        this.Orders.splice(this.Orders.indexOf(menu), 1);
    }

    public RemoveFromOrder(id) {
        this.Orders.splice(this.Orders.indexOf(id), 1);
        /*for (let i = 0; i < this.Orders.length; ++i) {
            if (this.Orders[i].id == id) {
                this.Orders.splice(i, 1);
                break;
            }
        }*/
    }

    public RemoveOrders() {
        this.Orders = [];
    }

    public GetOrder() {
        return this.Orders;
    }

    public GetBadges(): number {
        return this.Orders.length;
    }

}