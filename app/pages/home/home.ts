import { Component , NgZone, ViewChild, ViewChildren, QueryList} from '@angular/core';
import {NavController, Platform, Gesture, LoadingController, AlertController} from 'ionic-angular';
import {Screenshot, Vibration} from 'ionic-native';
import {Http, RequestOptions, Headers, Response} from '@angular/http';
import 'rxjs/Rx';
import {DinoImage} from "../../extra/dino/dino";
import {FirebaseKey} from "../../extra/config";
import {AnimateAnything} from "../../extra/animate";
import {SnapShotServer} from "../../extra/snapshot";
import {Prescription} from "../../extra/prescription";

declare var TweenMax,Circ, Back,   // => TWEEN MAX
            navigator,
            cordova,
            Clarifai,
            $,
            Hammer,
            Cropper,
            firebase;

@Component({
  templateUrl: 'build/pages/home/home.html',
  directives: [DinoImage],
  providers: [FirebaseKey,AnimateAnything, SnapShotServer]
})

export class HomePage {

  //Extras    Extras    Extras    Extras    Extras    Extras    Extras    Extras
  zone;                 // ==> To update the DOM
  Capp;                 // => CLARIFAI\
  el;
  pressGesture: Gesture;   //=> Makes it so we get rid of the 300ms delay

  //List Of Premade Components
  LogoHomeContainer;    // => containers had the next buttona and the word logo
  Mascot;               // => The axctual picture logo
  bottomContainer;      // ==> COntains the snapchat buttons
  bracketContainer;      // ==> Container to hold the bracket img
  blinker;
  loader;

  mainLoader;

  //Not used yet, but we might need it@
  messageButton;
  circleButton;
  cropper;

  refreshElem;


  HomeNextButton;

  prescription;

  TagClickedStarted = false;
  TagClickedCurrent;

  MenuToggle = false;

  reverseMenu;

  TranslateList:any = "";

  //REVERAL   REVERAL   REVERAL   REVERAL   REVERAL   REVERAL   REVERAL   REVERAL
  StopMascot;           // => Used to stop/pause the main logo from moving up and down

  constructor(public navCtrl: NavController,
              private platform: Platform,
              private http: Http,
              public AnimateService: AnimateAnything,
              public snapShot : SnapShotServer,
              public alertCtrl: AlertController,
              public FBKey : FirebaseKey,
              public loadingCtrl: LoadingController) {



    console.log(3);

    this.prescription = Prescription;

  }

  ionViewDidEnter(){


    this.zone = new NgZone({enableLongStackTrace: false});
    let valueChanged = firebase.database().ref("/MobileListener");

    //Firebase Setup
    valueChanged.on("value", (snapshot) => {
      let obj = snapshot.val();
      console.log(obj);
      this.zone.run(() => {
        Object.keys(obj).forEach((key) => {
          if(obj[key].active === 1){
            this[key](key, obj);
          };
        });
      });
    });



    console.log(this.prescription);
    this.el = $(".middle-top-circle")[0];

    this.pressGesture = new Gesture(this.el,{
      recognizers: [
        [Hammer.Press, {threshold: 1, time: 5000}]
      ]}
    );
    this.pressGesture.listen();
    this.pressGesture.on('press', e => {
      console.log('press!');
    });

    this.pressGesture.on('pressup', e => {
      console.log('pressup!!!');
    });

    // this.pressGesture.on('pressup', e => {
    //   console.log('pressed up');
    // });

    //Set the Variable
    this.LogoHomeContainer = $(".logo-home-container");
    this.Mascot = $("#mascot");
    this.StopMascot = TweenMax.from(this.Mascot, 3 ,{top: "25%", repeat: 'infinite', yoyo: true, ease: Back.easeInOut});
    this.bottomContainer = $(".bottom-container");
    this.bracketContainer = $(".bracket_containers");
    this.HomeNextButton = $(".next-button");
    this.blinker = $("#blinker");
  }

  refresh(){
    Vibration.vibrate(1000);
    this.zone.run(() => {
      window.location.reload();
    });
  }


  //FIREBASE LISTENER FIREBASE LISTENER   FIREBASE LISTENER   FIREBASE LISTENER
  //FIREBASE LISTENER FIREBASE LISTENER   FIREBASE LISTENER   FIREBASE LISTENER
  //FIREBASE LISTENER FIREBASE LISTENER   FIREBASE LISTENER   FIREBASE LISTENER
  ReceiveData(skill, respond){
    let MainData = respond[skill].respond;
    console.log(MainData);
    this.PopUpMedicine(MainData);
    this.Refresh_ActiveSkill(skill).subscribe(
      (data) => {
        console.log("Successfylly changed it back to 1");
      }, (err) => {
        console.log("Error with changing the active value to 0");
        console.log(err);
      }
    );
  }


  Refresh_ActiveSkill(skill){
    let obj = {
      active: 0
    };
    let body = JSON.stringify(obj);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.patch(`https://foodai-b24f3.firebaseio.com/MobileListener/${skill}/.json`, body, options).map((res: Response) => res.json());
  }



  //BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS
  //BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS
  //BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS
  HomeNextButtonClicked(){
    Vibration.vibrate(1000);
    let ObjToReverse = {
      LogoHomeContainer: this.LogoHomeContainer,
      mascot: this.Mascot,
      homeNextButton: this.HomeNextButton,
      stopMascot: this.StopMascot,
      bottomContainer: this.bottomContainer,
      bracketContainer: this.bracketContainer
    };
    this.AnimateService.ChangeSession("HomeScan", ObjToReverse, () => {

    });
  }

  TestButton(){
    // let extraCare = $("#emptyBottle");
    // extraCare.css("display", "block");
    // TweenMax.from(extraCare, 1, {scale: 0,ease: Circ.easeOut});
    this.snapShot.TakeScreenShot(() => {
      console.log("$$$$$$$$$$$$$$$$$$$$$");
      console.log("all done!");
    });
  }
  //BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS
  //BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS
  //BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS   BUTTONS



  DisplayFakeContainer(callback?){
    let image = $("#fakeContainer")[0];
    this.cropper = new Cropper(image, {
      movable: true
    });
    // callback();
  }

  getData(){
    console.log(this.cropper.getCropBoxData());
  }

  fixedUpBox(callback?){
    var data = {
      left: 74,
      top: 21,
      width: 51,
      height: 57
    };
    this.cropper.setCropBoxData(data);
    // callback();
  }

  sendOff(){
    this.cropper.getCroppedCanvas().toBlob((blob) => {
      console.log("send to firebase");
      this.snapShot.SendStraightToFirebase(blob);
      console.log("###############################################");
    });
  }

  SetUpAlerts(message){
    let alert = this.alertCtrl.create({
      title: 'Success',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  //THIS IS WHEN THE MAIN BUTTON IS CLICKED
  //THIS IS WHERE THE MAHIC IS HAPPENING!!!!
  TakeSnapShot(){
      this.snapShot.TakeScreenShot((url, miLoader) => {  // ==> TAKE A SNAPSHOT -> SEND TO FIREBASE -> GET A URL RETURN
        console.log("SUCESSSSSS!!");
        console.log(url);
        this.mainLoader = miLoader;
        this.SendUrlToFirebase(url).subscribe(
          (data) => {
            console.log("This would be the lost one");
          }, (err) => {
            console.log("Trouble sending url to Firebase....");
            console.log(err);
            this.mainLoader.dismiss();
          }
        );
      })
  }

  SendUrlToFirebase(url){
    let obj = {
      active: 1,
      respond: url
    };
    let body = JSON.stringify(obj);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.patch("https://foodai-b24f3.firebaseio.com/WebListener/GetUrl/.json", body, options).map((res:Response) => res.json());
  }


  PopUpMedicine(mainData){
    this.mainLoader.dismiss();
    this.ForDebugging();  // ==> Debugging!!!!! ONLY

    let leftBracket = $(".left_brackets");
    let rightBracket = $(".right_brackets");
    let darkContainer = $("#dark-container");
    let medicineBottle = $("#empty_bottle");
    this.AnimateService.AnimateBracketsOut(leftBracket, rightBracket, () => { //ANIMATE BRACKETS OUT
      this.AnimateService.DisplayDarkContainer(darkContainer, () => { //ANIMATE DARK CONTAINER IN
        this.AnimateService.AnimateMedicineBottle(medicineBottle, () => {  //PILL CONTAINER
          this.DisplayJsonData(mainData); // ==> ANIMATE ALL THE LABELS IN
        });
      })
    });
  }


  DisplayJsonData(mainData){
    let FinalObject = {  // ==>take this out once we get the real object
      patient_name: {
        value: mainData.patient_name ? mainData.patient_name : "Bad Request =[",
        // value: "Victor Le",
        j: $("#PatientName")
      },
      prescription: {
        value: mainData.prescription ? mainData.prescription : "Bad Request =[",
        // value: "ssacsasacsa",
        j: $("#Prescription")
      },
      directions: {
        value: mainData.directions ? mainData.directions : "Bad Request =[",
        // value: "xsacxas",
        j: $("#Directions")
      },
      quantity: {
        value: mainData.quantity ? mainData.quantity : "Bad Request =[",
        // value: "sdcdscdsc",
        j: $("#Quantity")
      },
      store: {
        store_phone: {
          value: mainData.store.store_phone ? mainData.store.store_phone : "Bad Request =[",
          // value: "cscsadc",
          j: $("#StorePhone")
        },
        store_id: {
          value: mainData.store.store_id ? mainData.store.store_id : "Bad Request =[",
          // value: "Csdscsdc",
          j: $("#StoreID")
        }
      },
      RX_location: {
        value: mainData.RX_location ? mainData.RX_location : "Bad Request =[",
        // value: "asascas",
        j: $("#RX")
      },
      prescriber: {
        value: mainData.prescriber ? mainData.prescriber : "Bad Request =[",
        // value: "asxasc",
        j: $("#Prescriber")
      }
    };


    this.AnimateService.AnimateLabelsIn(FinalObject,() => {
      console.log("Animation Label is finished...");
    });
  }

  tagClicked(val){

    if(this.TagClickedStarted){
      this.ReverseElem(this.TagClickedCurrent);
    }else{
      this.TagClickedStarted = true;
    };

    let myValue = {
      patient_name: {
        j: $("#PatientName"),
      },
      prescription: {
        j : $("#Prescription")
      },
      directions: {
        j : $("#Directions")
      },
      quantity: {
        j : $("#Quantity")
      },
      storephone: {
        j : $("#StorePhone")
      },
      storeid: {
        j : $("#StoreID")
      },
      rx: {
        j : $("#RX")
      },
      prescriber: {
        j : $("#Prescriber")
      },
    }


    this.refreshElem = TweenMax.to(myValue[val].j, 0.3, { "border": "3px solid grey" ,"background": "#ccc","font-size": "34px", ease: Circ.easeOut});
    // this.SendDataToFirebase(myValue[val].j[0].innerText);
    this.TagClickedCurrent = this.refreshElem;

  }

  ReverseElem(elem){
    elem.reverse();
  }

  OpenMenu(){
    if(!this.MenuToggle){
      var reverseMenus = TweenMax.to($(".languageContainer"), 0.2, {'left': '-1%', ease: Circ.easeOut});
      this.reverseMenu = reverseMenus;
    }else{
      console.log("Here");
      this.reverseMenu.reverse();
    }
    this.MenuToggle = !this.MenuToggle;
    console.log("Works");
  }

  LanguageSwitch(val){
    this.loader = this.loadingCtrl.create({
      content: "Translating...",
    });
    this.loader.present();
    this.reverseMenu.reverse();
    this.MenuToggle = !this.MenuToggle;
    console.log(val);

    if(this.TranslateList === ""){
      this.GetTranslation().subscribe(
        (data) => {
          console.log("SUCESS GETTING TRANSLATION");
          console.log(data);
          this.TranslateList = JSON.parse(JSON.stringify(data));
          console.log(JSON.parse(JSON.stringify(data)));
          this.ChangeText(this.TranslateList[val].value)
        }, (err) => {
          console.log("ERR GETTING TRANSLATION");
          console.log(err);
          this.loader.dismiss();
        }
      )
    }else{
      this.ChangeText(this.TranslateList[val].value)
    }

  }

  GetTranslation() {
    return this.http.get(`https://doublechecker.herokuapp.com/api/translation`).map((res: Response) => res.json());
  }

  // SendDataToFirebase(str){
  //   let obj = {
  //     active: 1,
  //     respond: str
  //   };
  //   let body = JSON.stringify(obj);
  //   let headers = new Headers({ 'Content-Type': 'application/json' });
  //   let options = new RequestOptions({ headers: headers });
  //   return this.http.patch(`https://foodai-b24f3.firebaseio.com/AocListener/PlayAudio.json`, body, options).map((res: Response) => res.json());
  // }

  ChangeText(val){
    $("#Directions")[0].innerHTML = val;
    this.loader.dismiss();
  };

  ForDebugging(){
    // $("#refreshButton").remove();
  }

}








