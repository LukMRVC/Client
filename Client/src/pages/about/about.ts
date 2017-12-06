import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, AlertController, Events } from 'ionic-angular';
import { CustomMenuPage } from '../customMenu/CustomMenu';
import { Globals } from '../../app/Globals';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})
export class AboutPage {

    public menus: any = [];

    constructor(
        public navCtrl: NavController,
        private storage: Storage,
        private alertCtrl: AlertController,
        private events: Events,
        private globals: Globals
    ) {

    }

    //Found on stack overflow 6. 12. 2017 https://stackoverflow.com/questions/40127103/ionic-alert-wait-until-button-is-pressed
    presentAlert(message: string, title: string = 'Jste si jistý?'): Promise<boolean> {

        return new Promise((resolve, reject) => {
            let alert = this.alertCtrl.create({
                title: title,
                message: message,
                buttons: [
                    {
                        text: "Zrušit",
                        role: 'cancel',
                        handler: () => {
                            alert.dismiss().then(() => { resolve(false) });
                            return false;
                        }
                    },
                    {
                        text: "Ok",
                        role: 'Ok',
                        handler: () => {
                            alert.dismiss().then(() => { resolve(true) });
                            return true;
                        }
                    }
                ]
            });
            alert.present();
        });
    }

    ionViewWillEnter() {
        this.getLocalMenus();
    }

    getLocalMenus(): any {
        this.storage.get("local_menus").then(save => {
            this.menus = save;
        });
    }

    deleteMenu(name: string) {
        this.presentAlert("Opravdu chcete smazat menu: " + name + "?").then((answer) => {
            if (answer) {
                for (let i = 0; i < this.menus.length; ++i) {
                    if (this.menus[i].name == name) {
                        this.menus.splice(i, 1);
                        break;
                    }
                }
                this.storage.set("local_menus", this.menus);
            }
        });
        
    }

    addToOrder(menu): void {
        this.globals.AddOrder(menu);
        this.events.publish("orderMenu", menu);
    }

    newMenu() {
        this.navCtrl.push(CustomMenuPage);
    }
}
