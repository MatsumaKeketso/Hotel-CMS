import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'firebase/auth';
import { LoadingController, AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class RoomService {
  db = firebase.firestore();
  constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    // firebase.auth().onAuthStateChanged(user =>{
    //   if (user) {
    //     this.db.collection('users').doc(user.uid).set(this.roomInfo);
    //   }
    // })
  }
  async addRoom(room) {
    const loading = await this.loadingCtrl.create({
      message: 'Adding Room'
    });
    this.db.collection('rooms').doc(room.name).set(room).then(res => {
        console.log('Room add Response', res);
        loading.dismiss();
        this.alertCtrl.create({
          message: 'Room added'
        });
      }).catch(err => {
        loading.dismiss();
        this.alertCtrl.create({
          message: 'Error adding room'
        });
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

      }
}

