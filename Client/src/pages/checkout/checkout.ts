import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events, LoadingController } from 'ionic-angular';
import { Globals } from "../../app/Globals";
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/map';


import * as braintree from 'braintree-web';
import * as braintreeDropin from 'braintree-web-drop-in';


/*
  Generated class for the checkout page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-checkout',
    templateUrl: 'checkout.html'
})
export class CheckoutPage {

    token: string = "";
    form;
    static sHttp;
    static toastCtrl;
    static totalPrice;
    amount: number = 0;
    static food;
    static nav: NavController;
    static events: Events;
    static loading: LoadingController;
    order;
    client;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public globals: Globals,
        public http: Http,
        private toastCtrl: ToastController,
        public events: Events,
        public loading: LoadingController
    ) {
        //Získá předáná data 
        this.token = this.navParams.get('token');
        this.amount = this.navParams.get('amount');
        this.order = this.navParams.get('order');
    }

    ionViewDidLoad() {
        //Nastaví statické proménně
        CheckoutPage.loading = this.loading;
        CheckoutPage.food = this.order;
        CheckoutPage.events = this.events;
        CheckoutPage.totalPrice = this.amount;
        CheckoutPage.toastCtrl = this.toastCtrl;
        CheckoutPage.sHttp = this.http;
        CheckoutPage.nav = this.navCtrl;
        this.form = document.getElementById('form');
        this.createDropin();
    }
    //Zobrazí načítání
    static presentLoading(): void {
        CheckoutPage.loading.create({
            content: "Počkejte prosím",
            duration: 3500,
        }).present();
    }
    //Zobrazí toast (text v malém bloku)
    static presentToast(ctrl: ToastController, message: string): void {
        ctrl.create({
            position: 'bottom',
            message: message,
            duration: 1500
        }).present();
    }

    //Vytvoří UI integorované braintree platební brány
    createDropin() {
        //User auth token
        var authToken = this.globals.getToken();
        braintreeDropin.create({
            authorization: "sandbox_xsv5yyy8_ghv94zkc2x36bxwc",
            selector: '#dropin-container',
            paypal: {
                flow: 'checkout',
                amount: this.amount,
                currency: 'CZK'
            }
        }, (err, instance) => {
            if (err) {
                console.log(err);
            }
            let submitBtn = document.getElementById('submit-button');
            submitBtn.addEventListener('click', (event) => {
                instance.requestPaymentMethod( (err, payload) => {
                    if (err) {
                        // Kdyby někdo chtěl zaplatit, než vyplní formulář
                        CheckoutPage.presentToast(CheckoutPage.toastCtrl, "Platit můžete až po správném vyplnění vaší platební karty.");
                        return;
                    }
                    //Zobrazí načítání
                    CheckoutPage.presentLoading();
                    payload.amount = CheckoutPage.totalPrice;
                    payload.currency = "CZK";
                    console.log(payload.amount);
                    let headers = new Headers;
                    headers.append('Content-Type', 'application/json');
                    headers.append('Accept', 'application/json');
                    headers.append('Authorization', 'Basic ' + authToken);
                    // Odešle nonce serveru a nějaké další informace
                    CheckoutPage.sHttp.post(this.globals.url + "/pay", JSON.stringify(payload), { headers: headers }).map(res => res.text()).subscribe(success => {
                        CheckoutPage.sHttp.post("http://localhost:8088/order/", JSON.stringify(CheckoutPage.food)).map(response => response.text()).subscribe(good => {
                            instance.teardown();
                            CheckoutPage.events.publish("checkout", true);
                            CheckoutPage.nav.pop();
                        }, bad => {
                            console.log(bad);
                            })
                    }, error => {
                        //instance.teardown() smaže braintree formulář
                        instance.teardown();
                        CheckoutPage.nav.pop();
                        CheckoutPage.presentToast(CheckoutPage.toastCtrl, "Chyba při provádění platby. Zkuste znovu");
                    })
                });
            });

            })
    }

    

}
