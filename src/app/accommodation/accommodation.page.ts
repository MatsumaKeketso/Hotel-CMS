import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { LoadingController, AlertController } from '@ionic/angular';
import { TouchSequence } from 'selenium-webdriver';
@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.page.html',
  styleUrls: ['./accommodation.page.scss'],
})
export class AccommodationPage implements OnInit {
  db = firebase.firestore();
  storage = firebase.storage().ref();

  togglebookings = false;

  listaccommodation = [];
  listbookings = [];
  listusers = []
  accommodation = {
    image: '',
    name: '',
    features: [],
    description: '',
    price: null,
    lastcreated: ''
  }

  uploadprogress = 0;
  isuploading = null;
  features = ['Telephone', 'Satellite Channels', 'Cable Channels', 'Laptop safe', 'Flat-screen TV', 'Safety Deposit Box', 'Air conditioning', 'Seating Area' ,'Extra Long Beds (> 2 metres)', 'Heating', 'Sofa', 'Wake-up service', 'Kitchenware', 'Electric kettle', 'Dining area', 'Microwave', 'Refrigerator', 'Kitchenette', 'Minibar', 'Wardrobe or closet', 'Hardwood or parquet floors']
  constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController) { }

  ngOnInit() {
    this.retrieve();
    this.getbookings();
    this.getusers();
  }
 async selectimage(image){
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
          this.isuploading = true;
        }, error => {

        }, () => {
          upload.snapshot.ref.getDownloadURL().then(downUrl => {
            this.accommodation.image = downUrl;
            this.isuploading = false;
          });
        });
       }
    }
  }
  async add(){
    if (!this.accommodation.image){
      const alerter = await this.alertCtrl.create({
        message: 'Error saving Accommodation. No image selected or has not finnished uploading.'
      })
      alerter.present();
    } else {
      if (!this.accommodation.name || !this.accommodation.description || !this.accommodation.features || !this.accommodation.price) {
        const alerter = await this.alertCtrl.create({
          message: 'Error saving Accommodation. Some fields not filled'
        })
        alerter.present();
      }else {
        if (this.accommodation.price > 1000) {
          const alerter = await this.alertCtrl.create({
            message: 'The price cannot be more than R1000.00 pp/pn'
          })
          alerter.present();
        } else{
          this.listaccommodation = [];
    const date = new Date();
    this.accommodation.lastcreated = date.toDateString();
    const worker = await this.loadingCtrl.create({
      message: 'Workking',
      spinner: 'bubbles'
    })
    worker.present();
    this.db.collection('rooms').doc(this.accommodation.name).set(this.accommodation).then( async res => {
      this.retrieve();
      worker.dismiss();
      const alerter = await this.alertCtrl.create({
        message: 'Accomodation saved'
      })
      alerter.present();
    }).catch(async err => {
      const alerter = await this.alertCtrl.create({
        message: 'Error saving Accommodation.'
      })
      alerter.present();
      worker.dismiss();
    })
        }
    //**************************** */
    
  }
    } 
  }
  edit(val){
    this.accommodation = val;
    console.log('Edit: ', this.accommodation);
    
  }
  retrieve(){
    this.listaccommodation = [];
    this.db.collection('rooms').get().then(snapshot => {
      if (snapshot.empty) {
        console.log('No documents');
      } else {
        snapshot.forEach(doc => {
          this.listaccommodation.push(doc.data());
        })
      }
    })
  }
  async delete(value){
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Message <strong>Are you sure you want to delete? This action is ireversable.</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: async () => {
            const worker = await this.loadingCtrl.create({
              message: 'Working',
              spinner: 'bubbles'
            })
            worker.present();
            this.db.collection('rooms').doc(value.name).delete().then(async res => {
              worker.dismiss()
              this.listaccommodation = [];
              this.retrieve();
            const alerter = await this.alertCtrl.create({
              message: 'Room deleted'
            })
            alerter.present();
            })
          }
        }
      ]
    });

    await alert.present();
  }
  getbookings(){
    this.listbookings = [];
    this.db.collection('bookings').get().then(snapshot => {
      if (snapshot.empty){
        console.log('No data');
      } else {
        snapshot.forEach(doc => {
          this.listbookings.push(doc.data())
        })
        console.log('Bookings: ' ,this.listbookings);
        
      }
    })
  }
  clear(){
    this.accommodation = {
      image: '',
      name: '',
      features: [],
      description: '',
      price: '',
      lastcreated: ''
    }
  }
  Tbookings(){
    this.togglebookings = !this.togglebookings;
  }
  getusers(){
    this.db.collection('users').get().then(snapshot => {
      if (snapshot.empty){
        console.log('No data');
      } else {
        snapshot.forEach(doc => {
          this.listusers.push(doc.data());
        })
        console.log(this.listusers);
        
      }
    })
  }
}
