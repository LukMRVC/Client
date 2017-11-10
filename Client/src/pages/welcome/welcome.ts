import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SignIn } from '../sign/sign.in';
import { SignUp } from '../sign/sign.up';

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

    constructor(public navCtrl: NavController, public navParams: NavParams) { }

    login() {
        this.navCtrl.push(SignIn);
    }

    signUp() {
        this.navCtrl.push(SignUp);
    }

}
