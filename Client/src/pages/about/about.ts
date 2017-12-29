//Nenechat se zmást je důležité
//Stránka se sice jmenuje about, ale vůbec to tak není
//Tato stránka zobrazuje vlastně vytvořené menu

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

    //Nalezeno na stack overflow 6. 12. 2017 https://stackoverflow.com/questions/40127103/ionic-alert-wait-until-button-is-pressed
    //Ukáže uživateli alert, jestli chce smazat vlastní menu
    //A podle volby vrátí boolean
    //Vše je děláno tak, aby šlo použít callback
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
    //jedná se o Ionic event, který se zavolá, těsně předtím, než bude stránka zobrazena
    ionViewWillEnter() {
        this.getLocalMenus();
    }

    //Vezme z lokálního uložiště vlastní menu
    getLocalMenus(): any {
        this.storage.get("local_menus").then(save => {
            this.menus = save;
        });
    }

    //Smaže menu
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

    //Přidá vlastní menu do objednávky
    addToOrder(menu): void {
        this.globals.AddOrder(menu);
        this.events.publish("orderMenu", menu);
    }

    newMenu() {
        this.navCtrl.push(CustomMenuPage);
    }
}
