import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../../services/room/room.service';
import * as firebase from 'firebase';
import { AlertController, LoadingController, NavParams } from '@ionic/angular';


@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.page.html',
  styleUrls: ['./room-create.page.scss'],
})
export class RoomCreatePage implements OnInit {
  storage = firebase.storage().ref();
  features = [
    'Mountain view', 'Flat-screen TV ', 'Air conditioning',  'Bath',  'Private bathroom ', 'Free WiFi',
 'TV', 'Telephone', 'Satellite Channels ', 'Cable Channels',  'Laptop safe', 'Safety Deposit Box', 'Seating Area', 'Extra Long Beds (> 2 metres)', 'Heating',  'Sofa', 'Hardwood or parquet floors', 'Wardrobe or closet', 'Shower',  'Hairdryer', 'Free toiletries', 'Toilet', 'Bath or Shower', 'Kitchenette', 'Refrigerator',  'Microwave', 'Electric kettle ', 'Wake-up service'
  ];
  room = {
    image: '',
    name: '',
    price: null,
    description: null,
    features: []
  };
  // tslint:disable-next-line: max-line-length
  constructor(public loadingCtrl: LoadingController, private roomservice: RoomService, public alertCtrl: AlertController, public navParams: NavParams) { }

  ngOnInit() {
    console.log(this.navParams);
    this.room.image = this.navParams.data.image;
    this.room.name = this.navParams.data.name;
    this.room.price = this.navParams.data.price;
    this.room.description = this.navParams.data.description;
    this.room.features = this.navParams.data.features;
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
