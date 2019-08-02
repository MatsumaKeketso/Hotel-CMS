import { Component } from '@angular/core';
import { AuthService } from '../services/user/auth.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
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
  // tslint:disable-next-line: max-line-length
  items = [];
  room ={}
  constructor(
    private authService: AuthService,
    private router: Router,
    public modal: ModalController,
    private roomsService: RoomService
  ) {
    this.db.collection('rooms').get().then(snapshot => {
      snapshot.forEach(doc => {
        this.items.push(doc.data());
      });
    });
  }
    ionViewDidLoad() {
      
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
}

