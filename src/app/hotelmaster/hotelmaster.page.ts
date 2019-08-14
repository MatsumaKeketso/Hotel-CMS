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
  facilityoptions ={
    outdoors: ['Outdoor furniture', 'Beachfront', 'Sun terrace', 'Terrace', 'Garden'],
    pets: ['Pets are not allowed.', 'Pets are allowed.'],
    activities: ['Beach', 'Cycling', 'Bicycle rental', 'Golf course (within 3 km)'],
    food: ['On-site coffee house', 'Bottle of water', 'Wine/champagne', 'Special diet menus (on request)', 'Breakfast in the room', 'Bar', 'Restaurant', 'Very good coffee!'],
    internet: ['Wifi is available and free of charge', 'Free wifi not available'],
    general: ['Shuttle service', 'Airport shuttle','Designated smoking area', 'Air conditioning', 'Packed lunches', 'Heating', 'Gift shop', 'Safety deposit box', 'Lift', 'Barber/beauty shop', 'Facilities for disabled guests', 'Non-smoking rooms', 'Newspapers', 'Room service'],
    business: ['Fax/photocopying', 'Business centre', 'Meeting/banquet facilities'],
    cleaning: ['Daily housekeeping', 'Trouser press', 'Ironing service', 'Dry cleaning', 'Laundry'],
    transport: ['Airport drop off', 'Airport pick up'],
    reception: ['Concierge service', 'Luggage storage', 'Tour desk', 'Currency exchange', '24-hour front desk'],
    parking: ['Parking garage', 'Secure Parking'],
    languages: ['English', 'Afrikaans', 'Zulu', 'Xhosa', 'Southern Sotho', 'Tswana', 'Venda', 'Nothern Sotho', 'Tsonga', 'Swati', 'Ndebele']
  }
 facilities = {
   outdoors: [],
   internet: [],
   general: [],
   pets: [],
   parking: [],
   languages: [],
   activities: [],
   transport: [],
   cleaning: [],
   food: [],
   reception: [],
   business: [],
 }
 attraction = {
   category: '',
   image: '',
   name: '',
   distance: null,
   description: ''
 }
 listattractions =[];
 attractionUpload = null;
 isuploading = false;
  constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.getdata();
    this.getimages();
    this.getAttractions();
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
  hotelfacilities() {
    const dbFacilities = this.db.collection('facilities').doc('AzureFacilities');
    dbFacilities.update({
      outdoors: this.facilities.outdoors,
      internet: this.facilities.internet,
      general: this.facilities.general,
      pets: this.facilities.pets,
      parking: this.facilities.parking,
      languages: this.facilities.languages,
      activities: this.facilities.activities,
      transport: this.facilities.transport,
      cleaning: this.facilities.cleaning,
      food: this.facilities.food,
      reception: this.facilities.reception,
      business: this.facilities.business,
    }).then(res=> {
      console.log('Success');
    }).catch(err => {
      console.log('facilities error');
    });
  }
  getfacilities(){
  }
  async attractionimage(image) {
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
          this.attractionUpload = progress;
          this.isuploading = true;
          
        }, error => {

        }, () => {
          upload.snapshot.ref.getDownloadURL().then(downUrl => {
              this.attraction.image = downUrl;
            this.isuploading = false;
          });
        });
       }
    }
  }
  async addAttraction(){
    this.listattractions = []
    const worker = await this.alertCtrl.create({
      message: 'Working'
    })
    worker.present();
    if (this.attraction.name=='' ||
    this.attraction.distance==''
    ) {
      worker.dismiss();
      const distanceerr = await this.alertCtrl.create({
        message: "Can't leave distance or name empty.",
        cssClass: 'danger'
      })
      distanceerr.present();
    } else {
      if (this.attraction.image==''){
        worker.dismiss();
        const distanceerr = await this.alertCtrl.create({
          message: 'You did not select an image.',
          cssClass: 'danger'
        })
        distanceerr.present();
      } else {
        if (this.attraction.name.length == 10){
          worker.dismiss();
      const distanceerr = await this.alertCtrl.create({
        message: 'This name is too long. Provide a shorter name.',
        cssClass: 'danger'
      })
      distanceerr.present();
    } else {
      if (this.attraction.distance > 40){
        worker.dismiss();
        const distanceerr = await this.alertCtrl.create({
          message: 'The attraction should not be more than 40 km in distance.',
          cssClass: 'danger'
        })
        distanceerr.present();
      } else {
        this.db.collection('attractions').doc(this.attraction.name).set(this.attraction).then( async res => {
          this.getAttractions();
          const distanceerr = await this.alertCtrl.create({
            message: 'Attraction saved Successfully.'
          })
          distanceerr.present();
          this.attraction = {
            category: '',
            image: '',
            name: '',
            distance: null,
            description: ''
          }
          worker.dismiss();
        }).catch( async err => {
          worker.dismiss();
          const distanceerr = await this.alertCtrl.create({
            message: 'Error saving attraction.',
            cssClass: 'danger'
          })
          distanceerr.present();
        })
      }
    }
      }
    }
  }
  async getAttractions(){
    this.listattractions = []
    const getter = await this.loadingCtrl.create({
      message: 'Working'
    })
    getter.present();
    this.db.collection('attractions').get().then(snapshot => {
      if (snapshot.empty){
        getter.dismiss()
        console.log('No documents');
      } else {
        snapshot.forEach(doc => {
          this.listattractions.push(doc.data());
        })
        getter.dismiss();
      }
    })
  }
  async deleteAttraction(value){
    this.listattractions = []
const worker = await this.loadingCtrl.create({
      message: 'Working',
      spinner: 'bubbles'
    })
    worker.present()
    this.db.collection('attractions').doc(value.name).delete().then( async res => {
      this.getAttractions();
      worker.dismiss()
      const notifier = await this.alertCtrl.create({
        message: 'Attraction removed'
      })
      
      notifier.present();
    }).catch( async err => {
      this.getAttractions();
      worker.dismiss()
      const notifier = await this.alertCtrl.create({
        message: 'Error removing attraction'
      })
      notifier.present();
      
    })
  }
  async updateAttraction(value) {
    this.attraction = value;
  }
  clearattractionform(){
    this.attraction = {
      category: '',
      image: '',
      name: '',
      distance: null,
      description: ''
    }
  }
}
