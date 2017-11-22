import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})
export class AboutPage {

    menus: any;

    constructor(public navCtrl: NavController, private storage: Storage) {

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

    }
}
