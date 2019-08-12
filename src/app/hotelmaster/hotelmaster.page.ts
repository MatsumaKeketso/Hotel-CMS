import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hotelmaster',
  templateUrl: './hotelmaster.page.html',
  styleUrls: ['./hotelmaster.page.scss'],
})
export class HotelmasterPage implements OnInit {
  active = {
    info: true,
    gallery: false,
    facilities: false,
    attractions: false
  }
  constructor() { }

  ngOnInit() {
  }
  onClick(category) {
    if (category == 1) {
        this.active.info = true;
        this.active.gallery = false;
        this.active.facilities = false;
        this.active.attractions = false;
      } else if (category == 2) {
        this.active.info = false;
        this.active.gallery = true;
        this.active.facilities = false;
        this.active.attractions = false;
      } else if (category == 3) {
        this.active.info = false;
        this.active.gallery = false;
        this.active.facilities = true;
        this.active.attractions = false;
      } else if (category == 4) {
        this.active.info = false;
        this.active.gallery = false;
        this.active.facilities = false;
        this.active.attractions = true;
      }
  }
}
