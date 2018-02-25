import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController, App, AlertController, Events } from 'ionic-angular';
import { Globals } from "../../app/Globals";
import 'rxjs/add/operator/map';
import { WelcomePage } from "../welcome/welcome";


@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    called = false;

    food = [[]];
    subs = [];
    mainCategories = [];
    actualFood = [];
    treeview = {};

    constructor(
        public navCtrl: NavController,
        public http: Http,
        public app: App,
        public globals: Globals,
        public alertCtrl: AlertController,
        public events: Events
    ) {
        this.populateMenuData();
    }

    ionViewDidLoad() {

    }

    //Získá momentální nabídku ze serveru
    populateMenuData() {
        if (this.called === true)
            return;
        let link = this.globals.url + "/getMenuData";
        let headers = new Headers;
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append("Authorization", "Basic " + this.globals.getToken());
        this.http.get(link, { headers: headers }).map(response => response.json()).subscribe(data => {
            console.log(data);
            //I should maybe parse these data, and order them somehow... Categories to be exact
            this.treeview = data;
            /*for (var x in data) {
                this.food.push(data[x]);
            }
            this.food.splice(0, 1);
            
            //Vybere kategorie a roztřídí vše*/
            this.AssociateFoodWithCategories();
            this.globals.setFood(this.treeview['Food']);
        }, error => {
            console.log("Error: " + error);
        });
        this.called = true;
    }

    //Pokud uživatel podrží stisknuté tlačítko, zobrazí se mu dialogové okno s informaceni a konkrétní potravině
    showNutrition(EKj, EKcal, Protein, Carbs, Sugar, TotalFat, SaturatedFat, Fiber, Salt, allergenes) {
        let alert = this.alertCtrl.create({
            title: "Nutriční hodnoty",
            subTitle: "Energie (Kj): " + EKj + "kj<br/>Energie (KCal): " + EKcal + "kcal<br/>Bílkoviny: " + Protein + "g<br/>Sacharidy:  "
            + Carbs + "g<br/>Z toho cukry: " + Sugar + "g<br/>Tuky: " + TotalFat + "g<br/>Z toho nas. mastné kyseliny: " + SaturatedFat + "g<br/>Vláknina: "
            + Fiber + "g<br/>Sůl: " + Salt + "g<br/>Alergeny: " + allergenes.toString(),
            buttons: ['OK']
        });
        alert.present();
    }



    AssociateFoodWithCategories() {
        let parent;
        for (let i = 0; i < this.treeview['Food'].length; ++i) {
            parent = this.FindParent(this.treeview['Categories'], this.treeview['Food'][i].CategoryId);
            while (parent.ParentId != null) {
                this.treeview['Food'][i]['Text'] = parent.Name + " ";
                parent = this.FindParent(this.treeview['Categories'], parent.ParentId);
            }
            this.treeview['Food'][i].CategoryId = parent.Id;
        }
    }

    FindParent(categories, parentId) : any {
        for (let i = 0; i < categories.length; ++i) {
            if (categories[i].Id == parentId) {
                return categories[i];
            }
        }
    }


    //Přidá název, cenu a id jídla do objednávky, posíláno však je pouze id
    addToOrder(name, price, id) {
        let food = {
            name: name,
            price: price,
            id: id
        }
        this.globals.AddOrder(food);
        this.events.publish("order", food);
    }

    onLink(url: string) {
        window.open(url);
    }

    logout() {
        this.navCtrl.popAll();
        this.app.getRootNav().setRoot(WelcomePage);
    }

}
