import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { SignIn } from '../sign/sign.in';
import { SignUp } from '../sign/sign.up';
import { TabsPage } from '../tabs/tabs';
import { Globals } from "../../app/Globals";
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';



/*
  Generated class for the welcome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-welcome',
    templateUrl: 'welcome.html'
})
export class WelcomePage {

    public token: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private platform: Platform,
        private http: Http,
        private globals: Globals,
        private storage: Storage
    ) {
        this.tryLogin();
    }

    ionViewDidLoad() {
        
    }

    tryLogin() {
        this.storage.get('saved_token').then((token) => {
            let body = {
                token: token
            }
            this.http.post(this.globals.url + "/login/", JSON.stringify(body), {}).map(res => res.text()).subscribe(success => {
                this.storage.set('saved_token', success);
                this.globals.setToken(success);
                this.navCtrl.push(TabsPage);
                this.navCtrl.setRoot(TabsPage);
            }, error => {
                console.log(error);
                });
        }).catch((exception) => {
            console.log("Exception: ", exception);
            });
    }

    login() {
        this.navCtrl.push(SignIn);
    }

    signUp() {
        this.navCtrl.push(SignUp);
    }

}
