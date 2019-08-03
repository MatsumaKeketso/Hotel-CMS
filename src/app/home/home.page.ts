import { Component } from '@angular/core';
import { AuthService } from '../services/user/auth.service';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { RoomService } from '../services/room/room.service';
import { RoomCreatePage } from '../pages/room-create/room-create.page';
import * as firebase from 'firebase';
// import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  db = firebase.firestore();
  classname = 'roominmage';
  // true = rooms
  // false = users
  view = false;
  // tslint:disable-next-line: max-line-length
  items = [];
  room = {};
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
    });
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
}

