import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';
import { CustomMenuPage } from '../customMenu/CustomMenu';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})
export class AboutPage {

    public menus: any;

    constructor(
        public navCtrl: NavController,
        private storage: Storage
        
    ) {
       
    }

    ionViewWillEnter() {
        this.getLocalMenus();
    }

    getLocalMenus(): any {
        this.storage.get("local_menus").then(save => {
            this.menus = save;
        });
       


    }

    saveLocalMenus(): void {

    }

    newMenu() {
        this.navCtrl.push(CustomMenuPage);
    }
}
