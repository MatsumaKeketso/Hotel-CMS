import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../../services/room/room.service';
import * as firebase from 'firebase';


@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.page.html',
  styleUrls: ['./room-create.page.scss'],
})
export class RoomCreatePage implements OnInit {
  
  storage = firebase.storage().ref();
  constructor() { }

  ngOnInit() {
  }
  changeListener(event): void {
    const i = event.target.files[0];
    console.log(i);
    let upload = this.storage.child(i.name).put(i);
    upload.on('state_changed', snapshot => {
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes)* 100;
      console.log('upload is: ', progress , '% done.');
    }, err => {
    }, () => {
      upload.snapshot.ref.getDownloadURL().then(dwnURL => {
        console.log('File avail at: ', dwnURL);
      });
    });
    
  }
}
