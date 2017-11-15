import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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

    constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private http: Http, private globals: Globals) {
        this.tryLogin();
    }


    tryLogin() {
        this.storage.get('saved_token').then((token) => {
            let body = {
                token: token
            }
            this.http.post("http://192.168.0.108:8088/login/", JSON.stringify(body), {}).map(res => res.text()).subscribe(success => {
                this.storage.set('saved_token', success);
                this.globals.setToken(success);
                this.navCtrl.push(TabsPage);
                this.navCtrl.setRoot(TabsPage);
            }, error => {

            });
        });
    }

    login() {
        this.navCtrl.push(SignIn);
    }

    signUp() {
        this.navCtrl.push(SignUp);
    }

}
