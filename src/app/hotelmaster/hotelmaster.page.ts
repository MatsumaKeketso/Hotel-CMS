import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AlertController, LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-hotelmaster',
  templateUrl: './hotelmaster.page.html',
  styleUrls: ['./hotelmaster.page.scss'],
})
export class HotelmasterPage implements OnInit {
  // CSS PROPERTIES NO TOUCH *************
  active = {
    info: true,
    gallery: false,
    facilities: false,
    attractions: false,
  };
  // ******************
 db = firebase.firestore();
 storage = firebase.storage().ref();

 info = { };
 uploadprogress = 0;

 imagegallery  = [];

 
  constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.getdata();
    this.getimages();
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
  async getdata() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();
    this.db.collection('hotel').get().then(snapshot => {
      if (snapshot.empty !== true) {
        snapshot.forEach(doc => {
          this.info = doc.data();
        });
        loading.dismiss();
      }
    }).catch( async err => {
      const erroralert = await this.alertCtrl.create({
        message: 'There was a problem with fetching some info.',
        buttons: [
          {
            text: 'Dismiss',
            role: 'cancel'
          }
        ]
      });
      erroralert.present();
    });
  }
  async updatehotel() {
    this.db.collection('hotel').doc('Azure Grotto Hotel').update(this.info).then( async res => {
      const updateAlert = await this.alertCtrl.create({
        message: 'Hotel data Updated',
        buttons: [
          {
            text: 'Okay'
          }
        ]
      });
      this.getdata();
      updateAlert.present();
    }).catch( async err => {
      const updateAlert = await this.alertCtrl.create({
        message: 'Update failed. please try again later.',
        buttons: [
          {
            text: 'Okay'
          }
        ]
      });
      updateAlert.present();
    })
  }
  async uploadimage(image) {
    let imagetosend = image.item(0);
    if (!imagetosend) {
      const imgalert = await this.alertCtrl.create({
        message: 'Select image to upload',
        buttons: [{
          text: 'Okay',
          role: 'cancel'
        }]
      });
      imgalert.present();
    } else {
      if (imagetosend.type.split('/')[0] !== 'image') {
        const imgalert = await this.alertCtrl.create({
          message: 'Unsupported file type.',
          buttons: [{
            text: 'Okay',
            role: 'cancel'
          }]
        });
        imgalert.present();
        imagetosend = '';
        return;
       } else {
        const upload = this.storage.child(image.item(0).name).put(imagetosend);

        upload.on('state_changed', snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploadprogress = progress;
        }, error => {

        }, () => {
          upload.snapshot.ref.getDownloadURL().then(downUrl => {
            this.db.collection('hotelgallery').doc('images').update({
              image: firebase.firestore.FieldValue.arrayUnion(downUrl)
            }).then(res => {
              console.log('Success');
            }).catch(error => {
              console.log('Error');
            });
            this.getimages();
            this.uploadprogress = 0;
          });
        });
       }
    }
  }
  getimages() {
    this.db.collection('hotelgallery').get().then(snapshot => {
      snapshot.forEach(doc => {
        this.imagegallery = doc.data().image;
      });
      console.log(this.imagegallery);
    });
  }
  removeimage(img) {
    const imageArray = this.db.collection('hotelgallery').doc('images');
    imageArray.update({
      image: firebase.firestore.FieldValue.arrayRemove(img)
    }).then( async res => {
      const alert = await this.alertCtrl.create({
        message: 'Image has been removed.',
        buttons: [{
          text: 'Okay',
          role: 'cancel'
        }]
      });
      alert.present();
      this.getimages();
    }).catch( async error => {
      const alert = await this.alertCtrl.create({
        message: 'Error removine image',
        buttons: [{
          text: 'Okay',
          role: 'cancel'
        }]
      });
      alert.present();
    });
  }
}
