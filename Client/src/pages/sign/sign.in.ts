import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabsPage } from '../tabs/tabs';
import { Globals } from "../../app/Globals";
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
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
    signInForm: FormGroup;


    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private toastCtrl: ToastController,
        public globals: Globals, private formBuilder: FormBuilder, private storage: Storage) {
        this.signInForm = this.formBuilder.group({
            email: ['', Validators.compose([Validators.pattern("\\w+@\\w+\\.\\w{1,3}"), Validators.required])],
            password: ['', Validators.compose([Validators.required])]
        });        
    }


    presentToast(): void {
        const toast = this.toastCtrl.create({
            message: "Špatné přihlašovací údaje!",
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    }


    private login(): void {
        if (!this.signInForm.valid) {
            this.presentToast();
            return;
        }

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'text/plain');
        let body = {
            email: this.signInForm.value.email,
            password: this.signInForm.value.password,
        };
        this.http.post("http://192.168.0.108:8088/login/", JSON.stringify(body), { headers: headers }).map(Response => Response.text()).subscribe(
            data => {
                this.storage.set('saved_token', data);
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
