import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { HotelmasterPage } from '../hotelmaster/hotelmaster.page';
import { AccommodationPage } from '../accommodation/accommodation.page';
import { BookingsPage } from '../bookings/bookings.page';
import { AdminprofilePage } from '../adminprofile/adminprofile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, HotelmasterPage, BookingsPage, AccommodationPage, ]
})
export class HomePageModule {}
