import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FIREBASE_CONFIG } from '../environments/environment';
import * as firebase from 'firebase';
import { RoomCreatePage } from './pages/room-create/room-create.page';
import { FormsModule } from '@angular/forms';

firebase.initializeApp(FIREBASE_CONFIG);
@NgModule({
  declarations: [AppComponent, RoomCreatePage],
  entryComponents: [
    RoomCreatePage
  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
