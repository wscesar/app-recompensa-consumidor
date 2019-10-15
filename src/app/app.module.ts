import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FormsModule } from '@angular/forms';

@NgModule({

    declarations: [AppComponent],

    entryComponents: [],

    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(),
        FormsModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase, 'my-dummy-database'),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
    ],

    providers: [
        StatusBar,
        SplashScreen,
        BarcodeScanner,
        {
            provide: RouteReuseStrategy,
            useClass: IonicRouteStrategy
        }
    ],

    bootstrap: [AppComponent]
})
export class AppModule {}
