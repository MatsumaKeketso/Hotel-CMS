import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import  'firebase/auth';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  public roomListRef:firebase.firestore.CollectionReference;

  constructor() { 
    firebase.auth().onAuthStateChanged(user =>{
      if (user{
        this.roomListRef =firebase
        .firestore()
        .collection(`userProfile/${user.uid}/roomList`);

      }
    })
  }
  
}
