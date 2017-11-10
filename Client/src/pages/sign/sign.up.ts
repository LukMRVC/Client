import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { TabsPage } from "../tabs/tabs";
import 'rxjs/add/operator/map';
import { Globals } from "../../app/Globals";
import { SignIn } from './sign.in';


/*
  Generated class for the signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignUp {

    email = '';
    username = '';
    password = '';


    constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, public toastCtrl: ToastController) { }

    ionViewDidLoad() {
        console.log('ionViewDidLoad signupPage');
    }

    presentToast(msg: string): void {
        const toast = this.toastCtrl.create({
            message: msg,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    }

    signUp(): void {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'text/plain');
        let body = {
            username: this.username,
            password: this.password,
            email: this.email,
        };
        this.http.post("http://192.168.0.108:8088/signup/", JSON.stringify(body), { headers: headers }).map(response => response.text()).subscribe(
            data => {
                console.log(data);
                this.navCtrl.push(SignIn);
                this.navCtrl.remove(1, 1);
                this.presentToast("Byl jste úspěšně registrován.");
            }, error => {
                this.presentToast("Uživatel s tímto jménem nebo mailem již existuje!");
            }
        );
    }



}
