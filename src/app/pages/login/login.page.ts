import { Component, OnInit } from '@angular/core';
import { FormGroup,Validators, FormBuilder } from '@angular/forms';

import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/user/auth.service';
import { Router, PreloadAllModules } from '@angular/router';
import * as firebase from 'firebase';
import { ProfileService } from '../../services/user/profile.service';

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
    private profileService: ProfileService
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
        this.profileService.storeAdmin(res);
        this.router.navigateByUrl('home', { skipLocationChange: true });
      }
    });
  }
  async loginAdmin(loginForm): Promise<void> {

      this.loading = await this.loadingCtrl.create();
      await this.loading.present();

      firebase.auth().signInWithEmailAndPassword(loginForm.email, loginForm.password).then(user => {
          this.loading.dismiss().then(res => {
            this.profileService.storeAdmin(res);
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
async  register() {
    const alert = await this.alertCtrl.create({
      header: 'Enter your email',
      message: 'We need to your email to send the password reset link.',
      inputs: [
        {
          name: 'adminemail',
          type: 'email',
          placeholder: 'your@example.com'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'danger',
          handler: () => {
            console.log('Admin Cancelled');
          }
        },
        {
          text: 'Reset',
          cssClass: 'primary',
          handler: async data => {
            const loading = await this.loadingCtrl.create({
              message: 'Working',
              spinner: 'bubbles'
            });
            loading.present();
            console.log('Admin Sent Email ', data.adminemail, 'and url is ', window.location.href);
            const actionCodeSettings = {
              url: 'window.location.href',
              // When multiple custom dynamic link domains are defined, specify which
              // one to use.
              dynamicLinkDomain: 'hotel-cms-d3e5c.firebaseapp.com'
            };
            firebase.auth().sendPasswordResetEmail(data.adminemail)
              .then( async res => {
                loading.dismiss();
                const response = await this.alertCtrl.create({
                  message: 'Verification email sent',
                  buttons: [{
                    text: 'Okay',
                    role: 'cancel'
                  }]
                });
                response.present();
                loading.dismiss();
              })
              .catch( async error => {
                loading.dismiss();
                const response = await this.alertCtrl.create({
                  message: 'Error sending email. Please try again later.',
                  buttons: [{
                    text: 'Okay',
                    role: 'cancel'
                  }]
                });
                response.present();
              });
          }
        }

      ]
    });
    alert.present();
  }
}
