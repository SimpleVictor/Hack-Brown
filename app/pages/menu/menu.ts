import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {EatService} from "../../providers/eatservice";

@Component({
  templateUrl: 'build/pages/menu/menu.html',
})
export class MenuPage {

  foodData;
  lat;
  lng;

  constructor(private navCtrl: NavController, private eatservice: EatService) {
    Geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      this.eatservice.getData(this.lat, this.lng).subscribe(
        data => {
          // console.log(JSON.parse(data.body));
          this.foodData = JSON.parse(data.body);
          console.log(this.foodData)
        }, err => {
          console.log(err);
        }
      )
      console.log("Latitude: ", resp.coords.latitude);
      console.log("Longitude: ", resp.coords.longitude);
    });
  }

  ionViewLoaded(){

  }

}
