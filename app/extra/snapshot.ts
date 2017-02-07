import { Injectable } from '@angular/core';
import { Screenshot } from 'ionic-native';
import {FirebaseKey} from "./config";
import {LoadingController} from "ionic-angular";

declare var firebase;
declare var $;

@Injectable()
export class SnapShotServer {

  session = "LogoHome";
  loader;

  constructor(private fbKey : FirebaseKey, public loadingCtrl: LoadingController) {

    var config = {
      apiKey: fbKey.key.apiKey,
      authDomain: fbKey.key.authDomain,
      databaseURL: fbKey.key.databaseURL,
      storageBucket: fbKey.key.storageBucket,
      messagingSenderId: fbKey.key.messagingSenderId
    };

    firebase.initializeApp(config);
  }

  //Chain Method
  //Step 1
  TakeScreenShot(callback){
    Screenshot.URI(80).then((data) => {
      // $("#fakeContainer").attr("src", data.URI);
      this.presentLoading(); //=> Start loader
      this.SendDataToFirebase(data.URI, callback);
    }, (err) => {
      console.log(err)
    });
  }
  //Chain Method
  //Step 2
  SendDataToFirebase(dataURI, callback){
    let blob = this.DataToBlob(dataURI);
    console.log("Starting to send to db now");
    var storageRef = firebase.storage().ref(`multiplefiles/fbpicture.png`).put(blob).then((snapshot) => {
      console.log("Made it HERE");
      callback(snapshot.downloadURL, this.loader);
    });
  }
  //Chain Method
  //Step 3
  DataToBlob(dataURI){
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var arrayBuffer = new ArrayBuffer(byteString.length);
    var _ia = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteString.length; i++) {
      _ia[i] = byteString.charCodeAt(i);
    }

    var dataView = new DataView(arrayBuffer);
    var blob = new Blob([dataView], { type: mimeString });
    return blob;
  }

  SendStraightToFirebase(blob){
    firebase.storage().ref(`multiplefiles/checkerTest.jpg`).put(blob).then((snapshot) => {
      console.log(snapshot.downloadURL);
    });
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    this.loader.present();
  }

}
