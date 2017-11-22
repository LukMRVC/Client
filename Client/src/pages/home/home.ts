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

    constructor(public navCtrl: NavController, public http: Http, public app: App, public globals: Globals, public alertCtrl: AlertController, public events: Events) {
        this.populateMenuData();
    }

    //Run  ionic server after each change

    ionViewDidLoad() {

    }

    populateMenuData() {
        if (this.called === true)
            return;
        let link = "http://192.168.0.108:8088/get_food/";
        let headers = new Headers;
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'text/json');
        headers.append("Authorization", "Basic " + this.globals.getToken());
        this.http.get(link, { headers: headers }).map(response => response.json()).subscribe(data => {
            for (var x in data) {
                this.food.push(data[x]);
            }
            this.food.splice(0, 1);
            this.selectCategories();

        }, error => {
            console.log("Error: " + error);
        });
        this.called = true;
    }

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

    selectCategories() {
        for (let i = 0; i < this.food.length; ++i) {
            if (this.food[i][2] == 1) {
                if (this.food[i][14].length == 1) {
                    this.mainCategories.push(this.food[i]);
                } else {
                    this.subs.push(this.food[i]);
                }
            } else {
                this.actualFood.push(this.food[i]);
            }
        }
    }

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
