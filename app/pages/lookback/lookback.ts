import { Component , NgZone, ViewChild, ViewChildren, QueryList} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {Screenshot, Vibration} from 'ionic-native';
import {Http} from '@angular/http';
import 'rxjs/Rx';

import {
  StackConfig,
  Stack,
  Card,
  ThrowEvent,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent} from 'angular2-swing';
import {DinoImage} from "../../extra/dino/dino";


declare var TweenMax;
declare var TweenLite;
declare var Circ;
declare var Back;
declare var navigator;
declare var cordova;
declare var firebase;
declare var Clarifai;

@Component({
  templateUrl: 'build/pages/home/home.html',
  directives: [SwingStackComponent, SwingCardComponent, DinoImage]
})
export class HomePage {
  @ViewChild('myswing1') swingStack: SwingStackComponent;
  @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

  cards: Array<any>;
  // recipes: any[] = [{image_url : 'http://static.food2fork.com/604133_mediumd392.jpg', title: "blahhhh"}];
  recipes: any[] = [];
  recipesCounter:number = 0;
  stackConfig: StackConfig;
  recentCard: string = '';


  zone;

  lovelySquare;


  ShowTinder:boolean = false;

  directionBox;

  line1;
  line2;

  line1Counter = 0;
  line2Counter = 0;

  testNum = "2";


  totalTags:any[]= [];
  testTags:any[] = ["bang", "bro", "hjoe", "for", "doe", "bruhhhhh"];
  tagCounter = 0;
  tagVar;

  tinderContainer;

  titleLogo;

  Capp;

  totalRecipes;

  constructor(public navCtrl: NavController, private platform: Platform, private http: Http) {
    this.Capp = new Clarifai.App(
      'pyBoYQMROC5Ft2-KsWFAO6U-5_a86wpS5hoqERpU',
      'FtSn4x-z9OOCv5CYV42_k5DzXuA85tX9zvzaUbBv'
    );


    this.stackConfig = {
      throwOutConfidence: (offset, element) => {
        return Math.min(Math.abs(offset) / (element.offsetWidth/2), 1);
      },
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
      },
      throwOutDistance: (d) => {
        return 800;
      }
    };

    this.zone = new NgZone({enableLongStackTrace: false});
    // document.addEventListener("deviceready", onDeviceReady, false);
    // function onDeviceReady() {
    // console.log(navigator);
    // console.log("Device is rdy");
    // }

    var config = {
      apiKey: "AIzaSyDEuDCUfy_f-F4_j7sKHX8dXeB_FI6enpc",
      authDomain: "foodai-b24f3.firebaseapp.com",
      databaseURL: "https://foodai-b24f3.firebaseio.com",
      storageBucket: "foodai-b24f3.appspot.com",
      messagingSenderId: "556215253127"
    };

    firebase.initializeApp(config);



  }

  ionViewDidEnter(){

    // let logo = document.getElementById("main-logo");
    // this.titleLogo = TweenMax.from(logo, 2 ,{top: "30%", repeat: 'infinite', yoyo: true, ease: Back.easeInOut});

  }

  refresh(){
    Vibration.vibrate(1000);
    this.zone.run(() => {
      window.location.reload();
    });
  }


  devicerdy(callback){

    Screenshot.URI(80).then((data) => {
      console.log("Taking picture now!");
      this.sendDataToFirebase(data.URI, callback);
    }, (err) => {
      console.log(err)
    });

  }

  testDevice(){

    let obj = document.getElementById("internetCon");

    Vibration.vibrate(1000);
    this.directionBox.reverse();

    setTimeout(() => {
      console.log("connection now");
      this.startConnection();
    },1000);

    this.UploadToClarifai("https://s-media-cache-ak0.pinimg.com/736x/b1/9f/4c/b19f4c9303325f8b13aa96f652c4c278.jpg", () => {
      obj.style.visibility = " ";
      obj.style.visibility = "hidden";
      this.realLineScan();
    });
  }


  startTagDisplaying(){
    let counter = 0;
    let container = document.getElementById("tagContainer");
    this.tagVar = document.getElementById("tagBox");


    container.style.visibility = " ";
    container.style.visibility = "visible";

    TweenLite.from(container, 0.5, {left: '100%',ease: Circ.easeOut});



    this.tagVar.innerHTML = ` `;
    this.tagVar.innerHTML = `<span style="color: #FFF">${this.totalTags[0].name}</span>`;
    TweenLite.from(this.tagVar, 1, {left: '-250px', opacity: 0,ease: Circ.easeOut, onComplete: this.createScenario, onCompleteParams: [this], delay: 1});


  }


  createScenario(vm){

    vm.tagCounter += 1;

    if(vm.tagCounter <= 9){
      vm.tagVar.innerHTML = ` `;
      vm.tagVar.innerHTML = `<span style="color: #FFF">${vm.totalTags[vm.tagCounter].name}</span>`;
      TweenLite.from(vm.tagVar, 1, {left: '-250px', opacity: 0,ease: Circ.easeOut, onComplete: vm.createScenario, onCompleteParams: [vm]});
    }else{

      console.log("Done!");
      let container = document.getElementById("tagContainer");
      TweenLite.to(container, 1, {scale: 0 ,ease: Circ.easeOut});

    }


  }

  startConnection(){
    console.log("yup");
    let obj = document.getElementById("internetCon");
    obj.style.visibility = " ";
    obj.style.visibility = "visible";
    console.log(obj.style);
  }

  GoToScanSession(second){
    Vibration.vibrate(1000);


    if(!second){
      this.titleLogo.kill();
      let logo = document.getElementById("main-logo");
      TweenMax.to(logo, 0.5, {top:'0', ease: Circ.easeOut});

      let title = document.getElementById("title-name");
      TweenLite.to(title, 0.5, {top:"0", ease:Circ.easeOut});

      let nextButton = document.getElementById("nextButton");
      TweenLite.to(nextButton, 0.5, {left: '100%', opacity: 0,ease: Circ.easeOut});
    }
    let directionBoxContainer = document.getElementById("directionBox");
    directionBoxContainer.style.opacity = '1';
    this.directionBox = TweenLite.from(directionBoxContainer, 1, {scale: 0, ease: Circ.easeOut});

  }

  getRequest(){
    console.log("test");
  }


  StartScanning(){
    Vibration.vibrate(1000);
    this.directionBox.reverse();
    setTimeout(() => {
      this.LineScanning();
    },1000);
  }


  goRight(){

    let dude = document.getElementById("lovelySquare");
    this.lovelySquare = TweenLite.to(dude, 0.5, {left: '68%', ease: Circ.easeOut});

  }

  stopScanning(){
    Vibration.vibrate(1000);
    this.line1.reverse();
    this.line2.reverse();


    let tinderBox = document.getElementById("tinder-container");
    tinderBox.style.opacity = '1';
    this.tinderContainer = TweenMax.from(tinderBox, .75, {scale: 0, ease: Circ.easeOut});
    console.log("***********************************************************");
    console.log(this.recipes);

    let backButton = document.getElementById('BackButton');
    backButton.style.opacity = '1';
    TweenMax.from(backButton, 0.5, {scale: 0, rotate: 720, ease: Circ.easeOut, delay: 1});


    let percentButton = document.getElementById('PercentButton');
    percentButton.style.opacity = '1';
    TweenMax.from(percentButton, 0.5, {scale: 0, rotate: 720, ease: Circ.easeOut, delay: 1});


    for(let i = 0; i < this.totalTags.length; i++){
      this.totalTags[i].value = Math.round(this.totalTags[i].value * 100);
    }


  }

  PercentButton(){
    Vibration.vibrate(1000);
    this.tinderContainer.reverse();

    let page = document.getElementById("percentContainer");
    page.style.opacity =  '1';
    TweenMax.from(page, 0.5, {scale: 0, rotate: 720, ease: Circ.easeOut, delay: 1});

  }

  ReverseTheFoodBox(){
    Vibration.vibrate(1000);
    this.tinderContainer.reverse();
  }

  MoveLines1(vm, myline){
    let tm = vm;
    let line = myline;
    tm.line1Counter += 1;

    let randomNum = Math.round(Math.random() * 80) + 10;

    TweenLite.to(line, 1, {left: `${randomNum}%`});

    setTimeout(() => {
      // if(tm.line1Counter <= 5){
      if(tm.tagCounter <= 9){
        tm.MoveLines1(tm, line);
      }else{
        tm.stopScanning();
      }
    }, 1500);
  }

  MoveLines2(vm, myline){
    let tm = vm;
    let line = myline;

    tm.line2Counter += 1;

    let randomNum = Math.round(Math.random() * 80) + 10;

    TweenLite.to(line, 1, {top: `${randomNum}%`});

    setTimeout(() => {
      // if(tm.line2Counter <= 5){
      if(tm.tagCounter <= 9){
        tm.MoveLines2(tm, line)
      }
    }, 500);
  }



  LineScanning(){

    let obj = document.getElementById("internetCon");



    this.cards = [{email: ''}];
    this.addNewCards(1);

    // this.recipes = [];
    // this.setUpNewFoodCard();

    setTimeout(() => {
      console.log("connection now");
      this.startConnection();
    },1000);

    this.devicerdy(() => {
      obj.style.visibility = " ";
      obj.style.visibility = "hidden";
      this.realLineScan();
    });



  }

  realLineScan(){
    this.startTagDisplaying();
    let line1elem = document.getElementById("line1");
    let line2elem = document.getElementById("line2");
    this.line1 = TweenLite.to(line1elem, 0.5, {opacity: 1, ease: Circ.easeOut, onComplete: this.MoveLines1, onCompleteParams: [this, line1elem]});
    this.line2 = TweenLite.to(line2elem, 0.5, {opacity: 1, ease: Circ.easeOut, onComplete: this.MoveLines2, onCompleteParams: [this, line2elem]});
  }


  reverseMe(){
    this.lovelySquare.reverse();
  }

  sendDataToFirebase(dataURI, callback){
    let blob = this.blobFirebase(dataURI);
    console.log("Starting to send to db now");
    var storageRef = firebase.storage().ref(`multiplefiles/checkerTest.jpg`).put(blob).then((snapshot) => {
      console.log(snapshot.downloadURL);
      this.UploadToClarifai(snapshot.downloadURL, callback);
    });

  }

  UploadToClarifai(url, callback){
    console.log("IN HERE");
    console.log(url);
    console.log("Starting Clarifai search now....")
    this.Capp.models.predict(Clarifai.FOOD_MODEL, url).then(
      (response) => {
        console.log("SUCCESsss GRABBING THE RESPONSE");
        console.log(response.data.outputs[0].data.concepts[1]);
        // for(let i = 0; i < response.data.outputs[0].data.concepts.length; i++){
        //   this.totalTags.push(response.data.outputs[0].data.concepts[i]);
        // }
        this.totalTags = response.data.outputs[0].data.concepts;
        console.log(this.totalTags);
        console.log(this.totalTags.length);
        this.SendToFoodApi(this.totalTags);
        callback();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  SendToFoodApi(tags){
    console.log("HEYYYYY");
    console.log(tags)
    console.log("After");
    console.log(tags[0].name);
    console.log(tags[1].name);

    let url = `http://food2fork.com/api/search?key=6212afdfdbd8b43b30e4af31d5ac6e1c&q=${tags[0].name},${tags[1].name},${tags[2].name},${tags[3].name}`;
    console.log(url);

    // this.http.get(`http://food2fork.com/api/search?key=6212afdfdbd8b43b30e4af31d5ac6e1c&q=${},${},${},${}` + count)
    // this.http.get(`http://food2fork.com/api/search?key=6212afdfdbd8b43b30e4af31d5ac6e1c&q=${tags[0].name},${tags[1].name},${tags[2].name},${tags[3].name}`)
    // this.http.get(`http://food2fork.com/api/search?key=6212afdfdbd8b43b30e4af31d5ac6e1c&q=juice`)
    this.http.get(url)
      .map(data => data.json())
      .subscribe(result => {
        this.totalRecipes = result.recipes;
        console.log(this.totalRecipes);
        this.setUpNewFoodCard();
      })
  }

  setUpNewFoodCard(){
    console.log("MADE IT HERE");
    console.log(this.totalRecipes);
    console.log(this.recipesCounter);
    console.log(this.totalRecipes[0]);
    console.log("Bang bang");


    this.zone.run(() => {
      this.recipes.push(this.totalRecipes[this.recipesCounter]);
      this.recipesCounter += 1;
      this.ShowTinder = true;
    });


    // this.recipes.push(this.totalRecipes[0]);
    // this.recipesCounter += 1;

    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    console.log(this.recipes);

  }


  blobFirebase(dataURI){
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



  //TINDER CARDS
  onItemMove(element, x, y, r) {
    var color = '';
    var abs = Math.abs(x);
    let min = Math.trunc(Math.min(16*16 - abs, 16*16));
    let hexCode = this.decimalToHex(min, 2);

    if (x < 0) {
      color = '#FF' + hexCode + hexCode;
    } else {
      color = '#' + hexCode + 'FF' + hexCode;
    }

    element.style.background = color;
    element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
  }

// Connected through HTML
  voteUp(like: boolean) {
    Vibration.vibrate(1000);
    let removedCard = this.cards.pop();
    let removeRecipe = this.recipes.pop();
    // this.addNewCards(1);
    this.setUpNewFoodCard();
    // if (like) {
    //   this.recentCard = 'You liked: ' + removedCard.email;
    // } else {
    //   this.recentCard = 'You disliked: ' + removedCard.email;
    // }
  }

  addNewCards(count: number) {
    this.http.get('https://randomuser.me/api/?results=' + count)
      .map(data => data.json().results)
      .subscribe(result => {
        // console.log(result);
        for (let val of result) {
          this.cards.push(val);
        }
      })
  }

// http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript
  decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
      hex = "0" + hex;
    }

    return hex;
  }



}
