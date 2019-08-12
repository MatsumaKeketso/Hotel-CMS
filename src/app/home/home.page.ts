import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/user/auth.service';
import { Router } from '@angular/router';
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { RoomService } from '../services/room/room.service';
import { RoomCreatePage } from '../pages/room-create/room-create.page';
import * as firebase from 'firebase';
// import { ModalController } from '@ionic/angular';
import { BookingsPage } from '../bookings/bookings.page';
import { HotelmasterPage } from '../hotelmaster/hotelmaster.page';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  db = firebase.firestore();
  page = '';
  classesToApply = 'links-contain';
  active = {
    master: false,
    accommodation: false,
    bookings: false
  };
  dActive = {
    accommodation: false,
    feedback: false,
    hotelmaster: false,
    call: this.ChangeView
  }
  constructor(
    private authService: AuthService,
    private router: Router,
    public modal: ModalController,
    private roomsService: RoomService,
    public alertCtrl: AlertController,
    public navCtrl: NavController
  ) {
  }
  ionViewWillEnter() {
    console.log('enterd');
  }
  ngOnInit() {

  }
  topage(page, applyClass) {
    console.log(page);
    // change the layout of options
    this.classesToApply = applyClass;
    // change the page viewed
    this.page = page;
    // style the active class
    // master
    if (page == 'hotelmaster') {
      this.active.master = true;
      this.active.accommodation = false;
      this.active.bookings = false;

      this.dActive.accommodation = false;
      this.dActive.hotelmaster = true;
      this.dActive.feedback = false;
      // accommodation
    } else if (page == 'accommodation') {
      this.active.accommodation = true;
      this.active.master = false;
      this.active.bookings = false;

      this.dActive.accommodation = true;
      this.dActive.hotelmaster = false;
      this.dActive.feedback = false;

      // bookings
    } else if (page == 'bookings') {
      this.active.accommodation = false;
      this.active.master = false;
      this.active.bookings = true;

      this.dActive.accommodation = false;
      this.dActive.hotelmaster = false;
      this.dActive.feedback = true;
    }
  }
logOut(): void {
  this.authService.logoutUser().then(() => {
    this.router.navigateByUrl('login');
  });
}
ChangeView(val){
  this.classesToApply = val;

}
getBooking() {
  this.db.collection('bookings').get().then(snapshot => {
   if (snapshot.empty !== true) {
     snapshot.forEach(doc => {
       this.bookings.push(doc.data());
     });
     this.overallbookings = this.bookings.length;
   }
  });
}
}

