import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import { Globals } from '../../app/Globals';
import { TabsPage } from "../tabs/tabs";
import 'rxjs/add/operator/map';
import { SignIn } from './sign.in';

import * as nodeRsa from 'node-rsa';

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
    signUpForm: FormGroup;


    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private http: Http,
        public toastCtrl: ToastController,
        private formBuilder: FormBuilder,
        private globals: Globals
    ) {
        this.signUpForm = this.formBuilder.group({
            email: ['', Validators.compose([Validators.maxLength(100), Validators.pattern("\\w+@\\w+\\.\\w{1,3}"), Validators.required])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(15), Validators.required])]
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad signupPage');
       /* let body = {
            password: 'encpass',
            email: 'encemail'
        };
        
        let stringified = CircularJSON.stringify(CryptJS.AES.encrypt(JSON.stringify(body), key,{
            keySize: 256 / 8,
            iv: iv,
            mode: CryptJS.mode.CBC,
            padding: CryptJS.pad.Pkcs7
        }));
        let bytes = CryptJS.AES.decrypt(CircularJSON.parse(stringified.toString()), 'Dbj3l0hL4S/YWDDlNKd2t/rL3t1hrf5Ie3+YyRttyM8=');
        console.log(CircularJSON.parse(stringified.toString()));
        let decrypted = JSON.parse(bytes.toString(CryptJS.enc.Utf8));
        console.log("Decrypted: ", decrypted);*/
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
        

        if (!this.signUpForm.valid)
        {
            this.presentToast("Nesprávně zadané údaje!");
            return;
        }
        let key = new nodeRsa(this.globals.RSAKeyString, 'pkcs8-public-pem', 'pkcs1_oaep');
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'text/plain');
        let body = {
            password: key.encrypt(this.signUpForm.value.password, 'hex'),
            email: key.encrypt(this.signUpForm.value.email, 'hex')
        };

        //let encrypt = CryptJS.AES.encrypt, 'Dbj3l0hL4S/YWDDlNKd2t/rL3t1hrf5Ie3+YyRttyM8=');
        this.http.post(this.globals.url + "/signup/", body, { headers: headers }).map(response => response.text()).subscribe(
            data => {
                this.navCtrl.push(SignIn);
                this.navCtrl.remove(1, 1);
                this.presentToast("Byl jste úspěšně registrován.");
            }, error => {
                this.presentToast("Uživatel s tímto jménem nebo mailem již existuje!");
            }
        );
    }



}
