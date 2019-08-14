import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AlertController } from '@ionic/angular';
import { ProfileService } from '../services/user/profile.service';

@Component({
  selector: 'app-adminprofile',
  templateUrl: './adminprofile.page.html',
  styleUrls: ['./adminprofile.page.scss'],
})
export class AdminprofilePage implements OnInit {
  db = firebase.firestore();
  storage = firebase.storage().ref();
  profile = {
    image: '',
    name: '',
    bio: '',
    number: '',
    position: '',
    uid: '',
    email: ''
  }
  uploadprogress = 0;
  errtext = '';
  isuploading = false;
  isuploaded = false;

  isprofile = false;

  admin = {
    uid: '',
    email: ''
  }
  constructor(public alertCtrl: AlertController, private profileServ: ProfileService) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('Got admin', user);
        this.admin.uid = user.uid
      this.admin.email = user.email
      this.getProfile();
      } else {
        console.log('no admin');
        
      }
    })
  }
  async getImage(image){
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
          if (progress==100){
            this.isuploading = false;
          } 
        }, error => {

        }, () => {
          upload.snapshot.ref.getDownloadURL().then(downUrl => {
            this.profile.image = downUrl;
            this.uploadprogress = 0;
            this.isuploaded = true;
          });
        });
       }
    }
  }
  createAccount(){
    if (!this.profile.bio||!this.profile.name||!this.profile.number||!this.profile.position){
      this.errtext = 'Fields should not be empty'
    } else {
      if (!this.profile.image){
        this.errtext = 'Profile image still uploading or not selected';
      } else {
        this.profile.uid =  this.admin.uid;
        this.db.collection('admins').doc(this.profile.name).set(this.profile).then(res => {
          console.log('Profile created');
          this.getProfile();
        }).catch(error => {
          console.log('Error');
        });
      }
    }
  }
  getProfile(){
    this.db.collection('admins').where('uid', '==', this.admin.uid).get().then(snapshot => {
      if (snapshot.empty) {
        this.isprofile = false;
      } else {
        this.isprofile = true;
        snapshot.forEach(doc => {
          this.profile.bio = doc.data().bio;
          this.profile.image= doc.data().image
          this.profile.name=doc.data().name
          this.profile.number=doc.data().number
          this.profile.position=doc.data().position
          this.profile.email=doc.data().email
        })
      }
    })
  }
  edit() {
    this.isprofile = false;
  }
}
