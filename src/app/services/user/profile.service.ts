import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {
  admin = {
    uid: '',
    email: ''
  };
  constructor() { }
  storeAdmin(admin){
    this.admin = admin;
    console.log('Loggedin admin', this.admin);
    
  }
  getAdmin(){
    return this.admin.uid;
  }
}
