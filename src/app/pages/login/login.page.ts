import { Component, OnInit } from '@angular/core';
import { FormGroup,Validators, FormBuilder } from '@angular/forms';

import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/user/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  db = firebase.firestore();
  public loginForm: FormGroup;
  public loading: HTMLIonLoadingElement;
  storage = firebase.storage().ref();
  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });
  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(res => {
      if (res) {
        this.router.navigateByUrl('home', { skipLocationChange: true });
      }
    });
  }
  async loginAdmin(loginForm): Promise<void> {

      this.loading = await this.loadingCtrl.create();
      await this.loading.present();

      firebase.auth().signInWithEmailAndPassword(loginForm.email, loginForm.password).then(user => {
          this.loading.dismiss().then(() => {
             this.router.navigateByUrl('home', { skipLocationChange: true });
          });
        },
        error => {
          this.loading.dismiss().then(async () => {
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }]
            });
            await alert.present();
          });
        }
      );
  }
  forgotpassword(email) {
    firebase.auth().sendPasswordResetEmail(email).then(res => {
      console.log(res);
      
    });
  }
  register() {
    this.router.navigate((['register']));
  }
}
