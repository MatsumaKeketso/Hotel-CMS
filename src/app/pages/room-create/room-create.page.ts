import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../../services/room/room.service';
import * as firebase from 'firebase';
import { AlertController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.page.html',
  styleUrls: ['./room-create.page.scss'],
})
export class RoomCreatePage implements OnInit {
  storage = firebase.storage().ref();
  room = {
    image: '',
    name: '',
    price: null,
    description: null,
    features: []
  };
  constructor(public loadingCtrl: LoadingController, private roomservice: RoomService, public alertCtrl: AlertController) { }

  ngOnInit() {
  }
  changeListener(event): void {
    const i = event.target.files[0];
    console.log(i);
    const upload = this.storage.child(i.name).put(i);
    upload.on('state_changed', snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('upload is: ', progress , '% done.');
    }, err => {
    }, () => {
      upload.snapshot.ref.getDownloadURL().then(dwnURL => {
        console.log('File avail at: ', dwnURL);
        this.room.image = dwnURL;
      });
    });
  }
  async addRoom() {
    if (!this.room.description || !this.room.features || !this.room.name || !this.room.price) {
      const alert =  await this.alertCtrl.create({
        message: 'All room fields must be filled',
      });
      alert.present();
    } else {
      this.roomservice.addRoom(this.room);
    }
  }
}
