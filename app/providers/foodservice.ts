import { Injectable } from '@angular/core';
import {SqlStorage, Storage} from 'ionic-angular';
import {Http, Response} from "@angular/http";
import 'rxjs/Rx';


@Injectable()
export class FoodService {

  storage: Storage = null;
  fbURL ="https://umbchack.firebaseio.com/";

    constructor(private http: Http) {

      this.storage = new Storage(SqlStorage);
      this.storage.query('CREATE TABLE IF NOT EXISTS my_saved_food (id INTEGER PRIMARY KEY AUTOINCREMENT, food_id text, food_name text, is_saved text, is_recent text, is_scanned text)').then(
        result => {
          console.log(result);
          console.log("Created Table Successfully");
        }, err => {
          console.log("Failed Making Table BOoo");
          console.log(err);
        }
      );
    }

  //GET ALL DATA
    getAllBarCodeRecent(){
        let sql = 'SELECT * from my_saved_food';
        // let sql = 'SELECT * from my_saved_food where is_recent="true"';
        return this.storage.query(sql);
    }
  /*
  *
  * RECENT TABS
  *
  * */


  //ADD DATA
    addBarcodeRecent(data){
      console.log(data);
      let sql = `INSERT INTO my_saved_food (food_id, food_name, is_recent) VALUES (?,?,?)`;
      return this.storage.query(sql, [data.id, data.name, "true"]);
    }


  /*
   *
   * SCANNED TABS
   *
   * */

  //ADD DATA
  addBarcodeScanned(id){
    let url = `${this.fbURL}${id}.json`;
    this.http.get(url).map((res:Response) => res.json()).subscribe(
      data => {
        console.log("DATA HERE");
        console.log(data);
        let sql = `INSERT INTO my_saved_food (food_id, food_name, is_scanned) VALUES (?,?,?)`;
        return this.storage.query(sql, [id, data.name, "true"]);
      }, err => {
        console.log("great another error");
        console.log(err);
      }
    )
  }

  /*
   *
   * SAVED TABS
   *
   * */

  //UPDATE DATA INTO SAVED
  addBarcodeSaved(id){
    console.log(id);
    // let sql = `INSERT INTO my_saved_food (food_id, food_name, is_scanned) VALUES (?)`;
    // return this.storage.query(sql, [data.id, data.name, "true"]);
  }



    getData(){
      let sql = `SELECT * from my_saved_food`;
      return this.storage.query(sql);
    }


    deleteTable(){
      return this.storage.query("DROP TABLE IF EXISTS my_saved_food");
    }

}
