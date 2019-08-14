import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/user/auth.service';
import { Router } from '@angular/router';
import { ModalController, AlertController, NavController, PopoverController } from '@ionic/angular';
import { RoomService } from '../services/room/room.service';
import { RoomCreatePage } from '../pages/room-create/room-create.page';
import * as firebase from 'firebase';
// import { ModalController } from '@ionic/angular';
import { BookingsPage } from '../bookings/bookings.page';
import { HotelmasterPage } from '../hotelmaster/hotelmaster.page';
import { AdminprofilePage } from '../adminprofile/adminprofile.page';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  db = firebase.firestore();
  // css properties DON'T TOUCH**********
  page = '';
  classesToApply = 'links-contain';
  profiletoapply = 'profile'
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


  //*************************** */
    admin = {}
  constructor(
    private authService: AuthService,
    private router: Router,
    public modal: ModalController,
    private roomsService: RoomService,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public popover: PopoverController
  ) {
  }
  ionViewWillEnter() {
    console.log('enterd');
  }
  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.db.collection('admins').where('uid', '==', user.uid).get().then(snapshot => {
          if (snapshot.empty) {
            console.log('No Profile');
            
          } else {
            console.log('Got profile');
            
            snapshot.forEach(doc => {
              this.admin = doc.data();
            })
          }
        })
      } else {
        console.log('no admin');
        
      }
    })
  }
  home() {
    this.page = '';
    this.classesToApply = 'links-contain';
    this.profiletoapply = 'profile'
    this.active = {
      master: false,
      accommodation: false,
      bookings: false
    };
    this.dActive = {
      accommodation: false,
      feedback: false,
      hotelmaster: false,
      call: this.ChangeView
    }
  }
  topage(page, applyClass) {
    this.profiletoapply = 'inactive-profile';
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
async profile(){
  console.log('clicked');
  const profiler = await this.popover.create({
    component: AdminprofilePage
  })
  profiler.present();
}

}

