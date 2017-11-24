import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { Globals } from '../../app/Globals';

/*
  Generated class for the CustomMenu page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-CustomMenu',
    templateUrl: 'customMenu.html'
})
export class CustomMenuPage {
    price: any = 5;
    mainCategory;
    subCategory;
    actualFood;
    customMenuForm: FormGroup;
    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private modalCtrl: ModalController,
        public globals: Globals) {
        this.customMenuForm = this.formBuilder.group({
            menuName: ['', Validators.compose([Validators.maxLength(20), Validators.required])]
        });
       
    }
    //Use a modal
    addFood() {
        this.modalCtrl.create(ModalPage, { category: this.mainCategory, sub: this.subCategory, food: this.actualFood }).present();

    }

    saveCustomMenu() {
        
    }


    ionViewDidLoad() {
        let food = this.globals.getFood();
        for (let i = 0; i < food.length; ++i) {
            if (food[i][2] == 1) {
                if (food[i][14].length == 1) {
                    this.mainCategory.push(food[i]);
                } else {
                    this.subCategory.push(food[i]);
                }
            } else {
                this.actualFood.push(food[i]);
            }
        }
    }

}


@Component({
    templateUrl: 'modal.html'
})
export class ModalPage {
    main;
    sub;
    food;
    constructor(
        public platfrom: Platform,
        public params: NavParams,
        public viewCtrl: ViewController
    ) {
        this.main = this.params.get("category");
        this.sub = this.params.get("sub");
        this.food = this.params.get("food");
    }
}