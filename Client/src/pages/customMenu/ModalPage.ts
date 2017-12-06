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
        let food = this.globals.getFood();
        for (let i = 0; i < food.length; ++i) {
            if (food[i][2] == 1) {
                if (food[i][14].length == 1) {
                    this.main.push(food[i]);
                } else {
                    this.sub.push(food[i]);
                }
            } else {
                this.food.push(food[i]);
            }
        }
    }

    addToMenu(name, price, id): void {
        this.events.publish('addfood', {name: name, price:price, id:id});
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}