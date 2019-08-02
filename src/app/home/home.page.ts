import { Component } from '@angular/core';
import { AuthService } from '../services/user/auth.service';
import { Router } from '@angular/router';

// import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  classname = 'roominmage';
  // tslint:disable-next-line: max-line-length
  items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 121, 3, 525, 23, 52, 52, 6, 547, 568, 6787, 97, 64, 562, 4, 23, 41, 23, 12, 12, 4, 235, 34, 65, 457, 56, 76, 78, 67, 978, 5, 6, 345, 5, , 23, 5, 23, 4, 2, 35, 67];

  constructor(
    private authService:AuthService,
    private router:Router

  ) {}

logOut(): void{
  this.authService.logoutUser().then(() =>{
    this.router.navigateByUrl('login');
  });

}
addRoom(): void{
  this.router.navigateByUrl('room-create');
}
}

