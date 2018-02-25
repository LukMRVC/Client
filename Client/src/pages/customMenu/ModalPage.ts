import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, Platform, Events } from 'ionic-angular';
import { Globals } from '../../app/Globals';

@Component({
    selector: 'page-CustomMenu',
    templateUrl: 'modal.html'
})
export class ModalPage {
    main = [];
    sub = [];
    food = [];
    constructor(
        public platform: Platform,
        public params: NavParams,
        public viewCtrl: ViewController,
        public globals: Globals,
        public events: Events
    ) {
    }

    ionViewDidLoad() {
        this.food = this.globals.getFood();
    }

    addToMenu(name, price, id): void {
        this.events.publish('addfood', {name: name, price:price, id:id});
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}