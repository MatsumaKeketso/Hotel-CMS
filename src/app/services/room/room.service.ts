import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'firebase/auth';
import { stringify } from 'querystring';


@Injectable({
  providedIn: 'root'
})
export class RoomService {
  db = firebase.firestore();
  roomInfo;
  constructor() { 
    // firebase.auth().onAuthStateChanged(user =>{
    //   if (user) {
    //     this.db.collection('users').doc(user.uid).set(this.roomInfo);
    //   }
    // })
  }
  addRoom(
    roomImage: string,
    roomName:string,
    roomPrice: number,
    roomDescription: string,
    roomFeatures : string,
    ): Promise <firebase.firestore.DocumentReference>{
      return this.roomInfo.add({
        image: roomImage,
        name: roomName,
        price:roomPrice,
        description:roomDescription,
        features:roomFeatures
      });
    }
    getRoomList():firebase.firestore.CollectionReference{
      return this.roomInfo;
      }

getRoomDetail(roomId:string): firebase.firestore.DocumentReference{
  return this.roomInfo.doc(roomId);
}



  }
  

