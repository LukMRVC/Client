import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler, Badge } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { HttpModule } from '@angular/http';
import { Globals } from './Globals';
import { SignIn } from '../pages/sign/sign.in';
import { SignUp } from '../pages/sign/sign.up';
import { WelcomePage } from '../pages/welcome/welcome';
import { OrderPage } from '../pages/order/order';
import { CheckoutPage } from '../pages/checkout/checkout';
import { CustomMenuPage } from '../pages/customMenu/customMenu';
import { Storage } from '@ionic/storage';

@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        TabsPage,
        CustomMenuPage,
        OrderPage,
        SignIn,
        SignUp,
        CheckoutPage,
        WelcomePage
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        ContactPage,
        CustomMenuPage,
        HomePage,
        TabsPage,
        OrderPage,
        SignIn,
        SignUp,
        CheckoutPage,
        WelcomePage
    ],
    providers: [Storage, Badge, StatusBar, Globals, Splashscreen, { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
