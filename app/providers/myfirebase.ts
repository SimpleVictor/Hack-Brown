import { Injectable } from '@angular/core';

declare var firebase;

@Injectable()
export class MyFirebaseService {

    constructor() {


    }

    testService(){
      console.log("bang");
    }

}
