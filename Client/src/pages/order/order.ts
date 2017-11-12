import { Component } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { NavController, NavParams, Events, ToastController, Tabs, LoadingController } from 'ionic-angular';
import { Globals } from "../../app/Globals";
import { CheckoutPage } from '../checkout/checkout';



/*
  Generated class for the order page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-order',
    templateUrl: 'order.html'
})
export class OrderPage {

    html = [];

    foodIndices = [];

    totalPrice: number = 0;

    constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events, public globals: Globals,
        public http: Http, public toastCtrl: ToastController, public tabs: Tabs, private loading: LoadingController) {
        this.event.subscribe('order', (body) => {
            this.AddItem(body);
        });
        let orders = this.globals.GetOrder();
        for (let i = 0; i < orders.length; ++i) {
            this.AddItem(orders[i]);
        }

    }

    presentToast(message: string): void {
        const toast = this.toastCtrl.create({
            message: message,
            duration: 1500,
            position: 'bottom'
        });
        toast.present();
    }

    presentLoading() {
        this.loading.create({
            content: "Počkejte prosím...",
            duration: 3500
        }).present();
    }

    order() {
        if (this.foodIndices.length == 0) {
            this.presentToast("Nemůžete odeslat prázdnou objednávku.");
            return;
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let order = {
            food: this.foodIndices,
            token: [this.globals.getToken()],
            totalprice: [this.totalPrice]
        };

        let getReq = new Headers;
        getReq.append("Authorization", "Basic " + this.globals.getToken());

        this.presentLoading();
        this.http.get("http://192.168.0.108:8088/braintree_token/", { headers: getReq }).map(res => res.text()).subscribe(success => {
            
            this.navCtrl.push(CheckoutPage, { token: success, amount: this.totalPrice });
        })

        

      /*  this.http.post("http://192.168.0.108:8088/order/", JSON.stringify(order), { headers: headers }).map(res => res.text()).subscribe(
            res => {
                this.presentToast("Úspěšná objednávka");
                this.RemoveItems();
                this.tabs.select(0);
            }, error => { console.log(error) });*/
       
    }

    //User shared service from internet tutorial

    private RemoveItems() {
        this.html = [];
        this.totalPrice = 0;
        this.foodIndices = [];
        this.globals.RemoveOrders();
    }

    private AddItem(body) {
        this.html.push(body);
        this.totalPrice += body.price;
        this.foodIndices.push(body.id);
    }

    public removeItem(id) {
        this.globals.RemoveFromOrder(id);
        for (let i = 0; i < this.html.length; ++i) {
            if (this.html[i].id == id) {
                this.totalPrice -= this.html[i].price;
                this.html.splice(i, 1);
                break;
            }
        }
        for (let i = 0; i < this.foodIndices.length; ++i) {
            if (this.foodIndices[i] == id) {
                this.foodIndices.splice(i, 1);
                break;
            }
        }
    }


}
