import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, Platform, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { Globals } from '../../app/Globals';
import { ModalPage } from './ModalPage';

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
    price: any = 0;
    menu = [];
    idStringArr = "";

    customMenuForm: FormGroup;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private formBuilder: FormBuilder,
        private modalCtrl: ModalController,
        public events: Events,
    ) {
        this.customMenuForm = this.formBuilder.group({
            menuName: ['', Validators.compose([Validators.maxLength(20), Validators.required])]
        });
        this.events.subscribe('addfood', (body) => {
            this.AddItem(body);
        });

     
    }
    //Use a modal
    addFood() {
        let modal = this.modalCtrl.create(ModalPage);
        modal.present();
    }

    AddItem(item): void {
     
        this.price += item.price;
        this.idStringArr += item.id + ',';
    }

    saveCustomMenu() {
      /*  let menu = {
            name: this.customMenuForm.value.menuName,
            menu: this.menu,
            price: this.price
        };*/
       
    }


    ionViewDidLoad() {
       
    }

}


