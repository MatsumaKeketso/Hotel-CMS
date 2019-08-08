import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/user/auth.service';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { RoomService } from '../services/room/room.service';
import { RoomCreatePage } from '../pages/room-create/room-create.page';
import * as firebase from 'firebase';
// import { ModalController } from '@ionic/angular';
import { BookingsPage } from '../bookings/bookings.page';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  db = firebase.firestore();
  classname = 'roominmage';
  // true = rooms
  // false = users
  view = true;
  // tslint:disable-next-line: max-line-length
  items = [];
  room = {};
  reviews = [];
  noRevs = null;
  user = {
    name: '',
    surname: '',
    image: '',
    phone: '',
    uid: '',
    bio: '',
    email: ''
  };
  users = [];
  userreviews = [];
  searchbar = document.querySelector('ion-searchbar');

    overallbookings = 0;
    bookings  = [];
  constructor(
    private authService: AuthService,
    private router: Router,
    public modal: ModalController,
    private roomsService: RoomService,
    public alertCtrl: AlertController
  ) {
    
    console.log(this.items);
    this.db.collection('rooms').get().then(snapshot => {
      snapshot.forEach(doc => {
        this.items.push(doc.data());
      });
      this.room = this.items[0];
      this.noRevs = this.items.length;
    });
  }
  ngOnInit() {
    this.getReviews();
    this.getUsers();
    this.getBooking();
  }
  getReviews() {
    this.db.collection('reviews').get().then(snapshot => {
      if (snapshot.empty !== true) {
        console.log('Got Reviews');
        snapshot.forEach(doc => {
          this.reviews.push(doc.data());
        });
        console.log('Reviews: ', this.reviews);
        
      } else {
        console.log('No reviews');
      }
    });
  }
  getUsers() {
    this.db.collection('users').get().then(snapshot => {
      if (snapshot.empty !== true) {
        snapshot.forEach(doc => {
          this.users.push(doc.data());
        });
        this.user = this.users[0];
        console.log('Users: ', this.users);
      } else {
        console.log('No users');
      }
    })
  }
logOut(): void {
  this.authService.logoutUser().then(() => {
    this.router.navigateByUrl('login');
  });
}
async addRoom() {
  const modal = await this.modal.create({
    component: RoomCreatePage
  });
  return modal.present();
}
viewRoom(val) {
  this.room = val;
}
viewUser(user){
  this.user = user;
  this.getUserReview();
}
getUserReview() {
  this.userreviews = [];
  this.db.collection('reviews').where('image', "==", this.user.image).get().then(snapshot => {
    if (snapshot.empty !== true){
      snapshot.forEach(doc => {
        this.userreviews.push(doc.data());
      });
    }
  });
}
changeView(val) {
  if (val) {
    this.view = true;
    console.log(this.view);
  } else {
    this.view = false;
    console.log(this.view);
  }
}
async editRoom() {
  const modal = await this.modal.create({
    component: RoomCreatePage,
    componentProps: this.room
  });
  return modal.present();
}
 async deleteRoom(doc) {
  const alert = await this.alertCtrl.create({
    header: 'Confirm!',
    message: 'Are sure you?',
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Yes',
        handler: () => {
          this.db.collection('rooms').doc(doc.name).delete().then( async res => {
            location.reload();
            const alrt = await this.alertCtrl.create({
              message: 'Room deleted'
            });
            alrt.present();
            console.log(res);
          }).catch(err => {
            console.log(err);
          })
        }
      }
    ]
  });
  await alert.present();
 }
async presentBookings() {
  const modal = await this.modal.create({
    component: BookingsPage
  });
  return modal.present();
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

