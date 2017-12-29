import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, Platform, Events, Content } from 'ionic-angular';
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

//Celá stránka slouží jako formulář pro vlastní menu

@Component({
    selector: 'page-CustomMenu',
    templateUrl: 'customMenu.html'
})
export class CustomMenuPage {
    @ViewChild(Content) content: Content;
    price: any = 0;
    menu = [];
    storedMenus = [];
    idStringArr = "";



    customMenuForm: FormGroup;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private formBuilder: FormBuilder,
        private modalCtrl: ModalController,
        public events: Events,
        private storage: Storage
    ) {
        this.customMenuForm = this.formBuilder.group({
            menuName: ['', Validators.compose([Validators.maxLength(20), Validators.required])]
        });
        this.events.subscribe('addfood', (body) => {
            this.AddItem(body);
        });

     
    }

    //Vytvoří modální okno, kde si uživatel vybere z nabídky jídel, které chce přidat do vlastního menu
    addFood() {
        let modal = this.modalCtrl.create(ModalPage);
        modal.present();
    }

    AddItem(item): void {
        this.menu.push(item);
        this.price += item.price;
       // this.idStringArr += item.id + ',';
    }

    ionViewDidLoad() {
        this.storage.get("local_menus").then((data) => {
            for (let i = 0; i < data.length; ++i) {
                this.storedMenus.push(data[i]);
            }
        });
        console.log(this.storedMenus);
    }

    //Uloží menu a odstraní stránku
    saveCustomMenu() {
        if (this.customMenuForm.valid && this.price != 0 ) {
            let menu = {
                name: this.customMenuForm.value.menuName,
                menu: this.menu,
                price: this.price
            };
            this.storedMenus.push(menu);
            this.storage.set("local_menus", this.storedMenus);
            this.navCtrl.pop();
        }
       
    }

}


