import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  db = firebase.firestore();
  overallusers = 0;
  users = [];
  user = {}

  reviews = []
  isreviews = false;
  constructor() { }

  ngOnInit() {
    this.getUsers();
  }
  getUsers() {
    this.db.collection('users').get().then(snapshot => {
     if (snapshot.empty !== true) {
       snapshot.forEach(doc => {
         this.users.push(doc.data());
       });
       this.user = this.users[0];
       this.overallusers = this.users.length;
     }
    });
  }
  selectUser(user){
    this.user = user;
  }
  getReviews(){
    this.db.collection('reviews').get().then(snapshot => {
      if (snapshot.empty !== true) {
        this.isreviews = true;
        snapshot.forEach(doc => {
          this.reviews.push(doc.data());
        });
      } else {
        console.log('No reviews');
        
      }
     });
  }
}
