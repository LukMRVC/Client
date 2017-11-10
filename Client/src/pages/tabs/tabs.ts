import { Component } from '@angular/core';
import { Globals } from "../../app/Globals";
import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { OrderPage } from '../order/order';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    tab1Root: any = HomePage;
    tab2Root: any = OrderPage;
    tab3Root: any = AboutPage;

    constructor(public globals: Globals) {

    }

    countBadges() {
        return this.globals.GetBadges();
    }

}
