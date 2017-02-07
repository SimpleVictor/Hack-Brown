import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from "@angular/http";
// import 'rxjs/operator/map';
import 'rxjs/Rx';

@Injectable()
export class ServerComponent {

  fbURL ="https://umbchack.firebaseio.com/";

    constructor(private http: Http) { }

  generateBarcode(data){
    let body = JSON.stringify(data);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post("https://hungryman.herokuapp.com/users/generate", body, options).map((res:Response) => res.json());
  }


  getFirebaseID(id){
    console.log(id);
    let url = `${this.fbURL}${id}/.json`;
    console.log(url);
    return this.http.get(`${this.fbURL}${id}/.json`).map((res:Response) => res.json());

  }


}
