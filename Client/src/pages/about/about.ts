import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams } from 'ionic-angular';
import { CustomMenuPage } from '../customMenu/customMenu';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})
export class AboutPage {

    menus: any;

    constructor(public navCtrl: NavController, private storage: Storage, public navParams: NavParams) {

    }

    ionViewDidLoad()
    {
        this.getLocalMenus();
    }

    getLocalMenus() :any{
        this.menus = this.storage.get("menus");
    }

    saveLocalMenus() :void{

    }

    newMenu() {
        this.navCtrl.push(CustomMenuPage);
    }
}
