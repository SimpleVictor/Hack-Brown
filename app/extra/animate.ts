import { Injectable } from '@angular/core';


declare var TweenMax;
declare var TweenLite;
declare var Circ;
declare var Back;
declare var $;

@Injectable()
export class AnimateAnything {

    session = "LogoHome";

    constructor() { }

    ChangeSession(newSession, objToReverse, callback){
      this.session = newSession;
      if(this.session === "HomeScan"){ // => Will be going on the MAIn page where the scan button is at
        // TweenMax.to(objToReverse.LogoHomeContainer, 2, {scale: 0, ease: Circ.easeOut});
        TweenMax.to(objToReverse.homeNextButton, 1, {scale: 0, ease: Circ.easeOut});
        setTimeout(() => {

          let refreshButton = document.getElementById("refreshButton");
          TweenMax.to(refreshButton, 0.5, {left: '5%', ease: Circ.easeOut});   //=> Animate the bottom container in

          let mascot = objToReverse.mascot;
          let bottomContainer = objToReverse.bottomContainer;
          objToReverse.stopMascot.pause();
          TweenMax.to(mascot, 1,   // => Turn the mascot into a circle at the top
            {"transform": "scale(0.5) rotate(-17deg)",
              "background": "transparent",
              "opacity": "0.5",
              "top": "68%",
              "left": "41%",
              ease: Circ.easeOut });

          bottomContainer.css("display", "block");
          TweenMax.from(bottomContainer[0], 1, {scale: 0, ease: Circ.easeOut});   //=> Animate the bottom container in

          objToReverse.homeNextButton.css("display", "none");

          setTimeout(() => {  //=> Animate the brackets in
            objToReverse.bracketContainer.css("display", "block");
            TweenMax.from(objToReverse.bracketContainer[0], 0.5, {scale: 0, ease: Circ.easeOut});
            setTimeout(() => {
              this.session = "HomeScan";  // => Make sure to change the session global variable
              callback();         // => Call back the main method after all the animation is finished
            }, 1000);
          }, 1000);
        }, 2000);
      }
    }

    //BLINKER
    FlashThePage(blinker, callback){
      TweenMax.from(blinker, 1, {opacity: 1, ease: Circ.easeOut});
      setTimeout(function(){
        callback();
      }, 1000);
    }

    //Animate BRackets OUT
    AnimateBracketsOut(leftB, rightB, callback){
      TweenMax.to(leftB, 0.5, {left: '-27%', ease: Circ.easeOut});
      TweenMax.to(rightB, 0.5, {left: '105%', ease: Circ.easeOut});
      setTimeout(() => {
        callback()
      }, 750);
    }

    //ANIMATE BOTTOM CONTAINER IN
    AnimateThePictureIn(bottomContainer){
      bottomContainer.css("display", "block");
      TweenMax.from(bottomContainer[0], 1, {scale: 0, ease: Circ.easeOut});   //=> Animate the bottom container in
    }

    //Animate dark container in!
    DisplayDarkContainer(container, callback){
      container.css("display", "block");
      TweenMax.from(container, 0.5, {scale: 0, ease: Circ.easeOut});
      setTimeout(() => {
        callback()
      }, 750);
    }

    //ANimate the Medicine container in
    AnimateMedicineBottle(medicineImg, callback){
      this.AnimateBottomPieceAway(() => {   // => Remove the bottom circle before bringing the container in
        TweenMax.to(medicineImg, 1, {top: "34%" , ease:Circ.easeOut});
        setTimeout(() => {
          callback();
        }, 1500);
      })
    }

    //Animate bottome piece when medicine bottle comes in
    AnimateBottomPieceAway(callback){
      let whenFinish = () => {
        callback();
      };
      TweenMax.to($(".bottom-container"), 0.5 ,{scale: 0 ,ease:Circ.easeOut, onComplete: whenFinish});
    }


  //    EVERYTHING HERE IS FOR THE CONTAINER LABEL DATA (MAIN JSON OBJECT)
  AnimateLabelsIn(obj,callback){
      console.log(obj);

      var DisplayPatientName = () => {
        UseTween(obj.patient_name.j , obj.patient_name.value, "50%", false, 1);
        DisplayPrescription();
      };

      var DisplayPrescription = () => {
        UseTween(obj.prescription.j , obj.prescription.value, '60%', false, 1.5);
        DisplayDirections();
      };

      var DisplayDirections= () => {
        UseTween(obj.directions.j , obj.directions.value, '71%', false, 2);
        DisplayQuantity();
      };

      var DisplayQuantity = () => {
        UseTween(obj.quantity.j , obj.quantity.value, '80%', false, 2.5);
        DisplayStorePhone();
      };

      var DisplayStorePhone = () => {
        UseTween(obj.store.store_phone.j , obj.store.store_phone.value, '84%', false, 3);
        DisplayStoreID();
      };

      var DisplayStoreID = () => {
        UseTween(obj.store.store_id.j , obj.store.store_id.value, '45%', false, 3.5);
        DisplayRX();
      };

      var DisplayRX = () => {
        UseTween(obj.RX_location.j , obj.RX_location.value, '93%', false, 4);
        DisplayPrescriber();
      };

      var DisplayPrescriber = () => {
        UseTween(obj.prescriber.j , obj.prescriber.value, '93%', true, 4.5);
      };

      let picker = $("#LanguagePicker");
      picker.css("display", "block");
      TweenMax.from($("#LanguagePicker"),0.5,{scale: 0,ease:Circ.easeOut});

      //CALL METHOD TO TWEEN ELEM
      var UseTween = (elem, newStr, topPercent, done, myDelay) => {
          elem.css("display", "block");
          elem[0].innerHTML = newStr;
          TweenMax.from(elem, 0.5, {top: topPercent, opacity: 0, ease: Circ.easeOut, delay : myDelay});
          if(done){
            callback();
          };
      };
      //  START THE ANIMATION WITH THIS!!!
      DisplayPatientName();


  }




}
