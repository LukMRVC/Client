import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
    private Token: string;

    public url: string = "http://localhost:8088";

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