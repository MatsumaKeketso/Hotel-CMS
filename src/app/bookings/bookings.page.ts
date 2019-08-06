import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  db = firebase.firestore();
  overallbookings = 0;
  bookings = [];
  constructor() { }

  ngOnInit() {
    this.getBooking();
  }
  getBooking() {
    this.db.collection('bookings').get().then(snapshot => {
     if (snapshot.empty !== true) {
       snapshot.forEach(doc => {
         this.bookings.push(doc.data());
       });
       this.overallbookings = this.bookings.length;
     }
    });
  }
}
