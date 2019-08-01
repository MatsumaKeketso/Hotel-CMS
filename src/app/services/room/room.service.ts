import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  db = firebase.firestore();
  roomInfo;
  constructor() { 
    firebase.auth().onAuthStateChanged(user =>{
      if (user) {
        this.db.collection('users').doc(user.uid).set(this.roomInfo);
      }
    })
  }
  
}
