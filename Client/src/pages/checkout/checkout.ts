import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
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
    client;

    constructor(public navCtrl: NavController, public navParams: NavParams, public globals: Globals, public http: Http, private toastCtrl: ToastController) {
        this.token = this.navParams.get('token');
        this.amount = this.navParams.get('amount');
    }

    ionViewDidLoad() {
        CheckoutPage.toastCtrl = this.toastCtrl;
        CheckoutPage.sHttp = this.http;
        this.form = document.getElementById('form');
        this.createDropin();
    }

    static presentToast(ctrl: ToastController, message: string): void {
        ctrl.create({
            position: 'bottom',
            message: message,
            duration: 1500
        }).present();
    }

    createDropin() {
        var authToken = this.globals.getToken();
        braintreeDropin.create({
            authorization: "sandbox_xsv5yyy8_ghv94zkc2x36bxwc",
            selector: '#dropin-container',
            paypal: {
                flow: 'checkout',
                amount: '10.00',
                currency: 'CZK'
            }
        }, (err, instance) => {
            if (err) {
                console.log(err);
            }
            let submitBtn = document.getElementById('submit-button');
            submitBtn.addEventListener('click',  (event) => {
                instance.requestPaymentMethod( (err, payload) => {
                    if (err) {
                        // Handle errors in requesting payment method
                        CheckoutPage.presentToast(CheckoutPage.toastCtrl, "Platit můžete až po správném vyplnění vaší platební karty.");
                        return;
                    }

                    payload.amount = "10.00";
                    payload.currency = "CZK";
                    console.log(payload.amount);
                    let headers = new Headers;
                    headers.append('Content-Type', 'application/json');
                    headers.append('Accept', 'text/plain');
                    headers.append('Authorization', 'Basic ' + authToken);
                    // Send payload.nonce to your server
                    CheckoutPage.sHttp.post("http://192.168.0.108:8088/pay/", JSON.stringify(payload), { headers: headers }).map(res => res.text()).subscribe(success => {
                        
                    }, error => {
                        console.log(error);
                    })
                });
            });

            })
    }

    

}
