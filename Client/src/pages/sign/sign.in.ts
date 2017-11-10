import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { TabsPage } from '../tabs/tabs';
import 'rxjs/add/operator/map';
import { Globals } from "../../app/Globals";
/*
  Generated class for the login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-signin',
    templateUrl: 'signin.html'
})
export class SignIn {

    username: string = '';
    password: string = '';

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private toastCtrl: ToastController, public globals: Globals) { }

    presentToast(): void {
        const toast = this.toastCtrl.create({
            message: "Špatné přihlašovací údaje!",
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    }


    private login(): void {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
        headers.append('Access-Control-Allow-Headers', ' Origin, Content - Type, X - Auth - Token');
        headers.append('Accept', 'text/plain');
        let body = {
            username: this.username,
            password: this.password,
        };
        this.http.post("http://192.168.0.108:8088/login/", JSON.stringify(body), { headers: headers }).map(Response => Response.text()).subscribe(
            data => {
                this.globals.setToken(data);
                this.navCtrl.push(TabsPage);
                this.navCtrl.setRoot(TabsPage);
                //console.log(this.globals.getToken());
            }, error => {
                console.log(error);
                this.presentToast();
            });
    }



}
