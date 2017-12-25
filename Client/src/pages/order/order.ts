import { Component } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { NavController, NavParams, Events, ToastController, Tabs, LoadingController, AlertController, PopoverController, ViewController } from 'ionic-angular';
import { Globals } from "../../app/Globals";
import { CheckoutPage } from '../checkout/checkout';
import { OrderHistoryPage } from '../orderhistory/orderhistory';



/*
  Generated class for the order page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-order',
    templateUrl: 'order.html'
})
export class OrderPage {

    html = [];

    foodIndices = [];

    totalPrice: number = 0;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public event: Events,
        public globals: Globals,
        public http: Http,
        public toastCtrl: ToastController,
        public tabs: Tabs,
        private loading: LoadingController,
        private alertCtrl: AlertController,
        private popoverCtrl: PopoverController
    ) {
        this.event.subscribe('order', (body) => {
            this.AddItem(body);
        });
        this.event.subscribe('orderMenu', (menu) => {
            this.AddMenu(menu);
        })
        this.event.subscribe('checkout', (value: boolean) => {
            if (value === true) {
                this.presentToast("Úspěšná objednávka");
                this.RemoveItems();
                this.tabs.select(0);
            }
        })
        let orders = this.globals.GetOrder();
        for (let i = 0; i < orders.length; ++i) {
            if (orders[i].hasOwnProperty('menu')) {
                this.AddMenu(orders[i]);
            } else {
                this.AddItem(orders[i]);
            }
        }

    }

    presentToast(message: string): void {
        const toast = this.toastCtrl.create({
            message: message,
            duration: 1500,
            position: 'bottom'
        });
        toast.present();
    }

    presentLoading() {
        this.loading.create({
            content: "Počkejte prosím...",
            duration: 3500
        }).present();
    }

    CleanFoodIndices(): void {
        for (let i = 0; i < this.html.length; ++i) {
            if (this.html[i].hasOwnProperty('menu')) {
                for (let j = 0; j < this.html[i].menu.length; ++j) {
                    if (this.html[i].menu[j].checked == false) {
                        this.foodIndices.splice(this.foodIndices.indexOf(this.html[i].menu[j].id), 1);
                    }
                }
            }
        }
    }
    //Fix bug with 
    order() {
        if (this.foodIndices.length == 0) {
            this.presentToast("Nemůžete odeslat prázdnou objednávku.");
            return;
        }
        //Some food may have been removed from custom menu, this method will take care of it
        this.CleanFoodIndices();
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let order = {
            food: this.foodIndices,
            token: [this.globals.getToken()],
            totalprice: [this.totalPrice]
        };

        let getReq = new Headers;
        getReq.append("Authorization", "Basic " + this.globals.getToken());

        this.presentLoading();
        this.http.get(this.globals.url + "/braintree_token/", { headers: getReq }).map(res => res.text()).subscribe(success => {
            
            this.navCtrl.push(CheckoutPage, { token: success, amount: this.totalPrice, order: order });
        })

        

      /*  this.http.post(this.globals.url + "/order/", JSON.stringify(order), { headers: headers }).map(res => res.text()).subscribe(
            res => {
                this.presentToast("Úspěšná objednávka");
                this.RemoveItems();
                this.tabs.select(0);
            }, error => { console.log(error) });*/
       
    }

    //User shared service from internet tutorial

    private RemoveItems() {
        this.html = [];
        this.totalPrice = 0;
        this.foodIndices = [];
        this.globals.RemoveOrders();
    }

    private AddItem(body) {
        this.html.push(body);
        this.totalPrice += body.price;
        this.foodIndices.push(body.id);
    }

    private AddMenu(menu) {
        this.totalPrice += menu.price;
        for (let i = 0; i < menu.menu.length; ++i) {
            this.foodIndices.push(menu.menu[i].id);
            menu.menu[i]["checked"] = true;     
        }
        this.html.push(menu);
    }

    private recalcPrice() {
        this.totalPrice = 0;
        for (let i = 0; i < this.html.length; ++i) {
            this.totalPrice += this.html[i].price;
        }
    }

    public chooseFood(object) {
        if (!object.hasOwnProperty('menu')) {
            return;
        }

        let alert = this.alertCtrl.create({
            title: "Jídlo v menu",
            buttons: [{
                text: "Ok",
                role: 'ok',
                //data are checked values
                handler: (data) => {
                    //diff found on stack overflow 6. 12. 2017 https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
                    //diff is what i need to remove from foodIndices
                    let diff = this.foodIndices.filter(x => data.indexOf(x) == -1);
                    for (let i = 0; i < object.menu.length; ++i) {
                        object.menu[i].checked = false;
                        
                    }
                    object.price = 0;
                    for (let i = 0; i < data.length; ++i) {
                        for (let j = 0; j < object.menu.length; ++j) {
                            if (object.menu[j].id == data[i]) {
                                object.menu[j].checked = true;
                                object.price += object.menu[j].price;
                            }
                        }
                    }
                    this.recalcPrice();
                 //   console.log("After input: ", object.menu);
                }
            }]
        });

        for (let i = 0; i < object.menu.length; ++i) {
           // console.log(" Input object: ", object.menu[i]);
            alert.addInput({
                type: "checkbox",
                label: object.menu[i].name,
                value: object.menu[i].id,
                checked: object.menu[i].checked
            });
        }

       /* alert.addInput({
            type: "checkbox",
            label: "Food",
            value: "5",
            checked: true
        });
        alert.addInput({
            type: "checkbox",
            label: "Food1",
            value: "10",
            checked: true
        });*/

        alert.present();

    }

    //object can be food or menu
    public removeItem(object) {
        if (object.hasOwnProperty('menu')) {
            this.globals.RemoveMenuFromOrder(object);
            this.html.splice(this.html.indexOf(object), 1);
            for (let i = 0; i < object.menu.length; ++i) {
                this.foodIndices.splice(this.foodIndices.indexOf(object.menu[i].id), 1);
            }
            this.totalPrice -= object.price;
        }
        else {
            this.globals.RemoveFromOrder(object.id);
            for (let i = 0; i < this.html.length; ++i) {
                if (this.html[i].id == object.id) {
                    this.totalPrice -= this.html[i].price;
                    this.html.splice(i, 1);
                    break;
                }
            }
            for (let i = 0; i < this.foodIndices.length; ++i) {
                if (this.foodIndices[i] == object.id) {
                    this.foodIndices.splice(i, 1);
                    break;
                }
            }
        }
    }

    private presentPopover(event) {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: event
        });
    }


}


@Component({
    template: ` 
        <ion-list>
            <button ion-item (click)="showHistory()">Historie</button>
        </ion-list>    
`
})

export class PopoverPage {
    constructor(
        public viewCtrl: ViewController,
        public navCtrl: NavController
    ) { }

    close() {
        this.viewCtrl.dismiss();
    }

    showHistory(): void {
        this.navCtrl.push(OrderHistoryPage);
    }
}
