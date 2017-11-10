import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Globals } from "../../app/Globals";

import * as braintree from 'braintree-web';

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
        this.submitBtn = document.getElementById('submit_order');
        this.createClient();
    }

    private createClient(): void{
        this.client = braintree.client.create({
            authorization: this.token
        }, this.clientDidCreate)
    }

    public clientDidCreate(error, instance) {
        braintree.hostedFields.create({
            client: instance,
            styles: {
                'input': {
                    'font-size': '16pt',
                    'color': '#3A3A3A'
                },

                '.number': {
                    'font-family': 'monospace'
                },

                '.valid': {
                    'color': 'green'
                }
            },
            fields: {
                number: {
                    selector: '#card-number'
                },
                cvv: {
                    selector: '#cvv'
                },
                expirationDate: {
                    selector: '#expiration-date'
                }
            }
        }, this.hostedFieldsDidCreate);
    }

    hostedFieldsDidCreate(err, hostedFields) {
        this.submitBtn.addEventListener('click', this.submitHandler.bind(null, hostedFields));
        this.submitBtn.removeAttribute('disabled');
    }

    submitHandler(hostedFields, event) {
        event.preventDefault();
        this.submitBtn.setAttribute('disabled', 'disabled');

        hostedFields.tokenize(function (err, payload) {
            if (err) {
                this.submitBtn.removeAttribute('disabled');
                console.error(err);
            } else {
                this.form['payment_method_nonce'].value = payload.nonce;
                this.form.submit();
            }
        });
    }

}
