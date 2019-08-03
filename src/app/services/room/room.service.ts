import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'firebase/auth';
import { LoadingController, AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class RoomService {
  db = firebase.firestore();
  constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController) {}

  async addRoom(room) {
    const loading = await this.loadingCtrl.create({
      message: 'Adding Room'
    });
    loading.present();
    this.db.collection('rooms').doc(room.name).set(room).then(async res => {
        console.log('Room add Response', res);
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          message: 'Room added'
        });
        alert.present();
      }).catch(async err => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          message: 'Error adding room'
        });
        alert.present();
      });
    }
    // firebase.firestore.CollectionReference
    getRoomList() {
      this.db.collection('rooms').get().then(snapshot => {
        const rooms = [];
        snapshot.forEach(doc => {
          rooms.push(doc.data());
        });
        return rooms;
      });
      }
  updateRoom(room) {
    const roomUpdate = this.db.collection('rooms').doc(room.name);

// Set the "capital" field of the city 'DC'
    return roomUpdate.update(room)
.then(() => {
    console.log('Document successfully updated!');
})
.catch(error => {
    // The document probably doesn't exist.
    console.error('Error updating document: ', error);
});
  }
}

