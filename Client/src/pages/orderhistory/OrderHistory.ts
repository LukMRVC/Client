import { Component } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { NavController, NavParams } from 'ionic-angular';
import { Globals } from '../../app/Globals';

/*
  Generated class for the OrderHistory page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-OrderHistory',
    templateUrl: 'OrderHistory.html'
})
export class OrderHistoryPage {

    private orders = [];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private http: Http,
        private globals: Globals
    ) {
        let headers = new Headers;
        headers.append("Authorization", "Basic " + this.globals.getToken());
        //získá historii uživatele
        this.http.get(this.globals.url + "/get_user_history", { headers: headers }).map(res => res.json()).subscribe(success => {
            for (let property in success) {
                if (success.hasOwnProperty(property)) {
                    this.orders.push(success[property]);
                }
            }
            this.orders = this.orders.reverse();
            console.log(this.orders);
            console.log("Success: ", success);
        }, error => {
            console.log("Error: ", error);
        })
    }

    ionViewDidLoad() : void {
        
    }

}
