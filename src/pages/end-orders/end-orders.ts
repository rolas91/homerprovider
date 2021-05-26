import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Values} from '../../providers/service/values';
import {EndOrdesService} from '../../providers/service/endorders';
import { Observable } from 'rxjs';
/**
 * Generated class for the EndOrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-end-orders',
  templateUrl: 'end-orders.html',
})
export class EndOrdersPage {
  orders = []
  constructor(
    public values:Values,
      public navCtrl: NavController,
      public navParams: NavParams,
      public endOrdersServices:EndOrdesService
    )
    {

    }

    ionViewDidEnter(){
      this.endOrdersServices.getEndOrders({provider:this.values.customerId}).then((response:any) => {
          for(let orders of response.data){
            this.orders.push(orders)
          }
      });
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EndOrdersPage');
  }
}
