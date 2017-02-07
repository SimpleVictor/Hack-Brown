import { Injectable } from '@angular/core';
import {SqlStorage, Storage} from 'ionic-angular';
import {Http, Response} from "@angular/http";
import 'rxjs/Rx';


@Injectable()
export class EatService {


  constructor(private http: Http) {


  }

  getData(lat, lng){
    let url = `https://fire-friend.hyperdev.space/getRestaurants/${lat}/${lng}/5`;
    console.log(url);
    return this.http.get(url).map((res:Response) => res.json());
  }
}
