import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Globals } from "../../app/Globals";

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
    submitBtn;
    client;

    constructor(public navCtrl: NavController, public navParams: NavParams, public globals: Globals) {
        this.token = this.navParams.get('token');
    }

    ionViewDidLoad() {
        this.form = document.getElementById('form');
        this.submitBtn = document.getElementById('submit-button');
        this.createDropin();
    }

    createDropin() {
        braintreeDropin.create({
            authorization: "sandbox_xsv5yyy8_ghv94zkc2x36bxwc",
            selector: '#dropin-container'
        }, (err, instance) => {
            if (err) {
                console.log(err);
            }

            this.submitBtn.addEventListener('click', function () {
                instance.requestPaymentMethod(function (err, payload) {
                    if (err) {
                        // Handle errors in requesting payment method
                    }
                    console.log("Payload: " + payload);
                    // Send payload.nonce to your server
                });
            });

            })
    }

    

}
