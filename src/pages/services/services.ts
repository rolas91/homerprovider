import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Values} from '../../providers/service/values';
import { Service } from '../../providers/service/service';
import { BookingDetails } from '../account/booking-details/booking-details';
/**
 * Generated class for the ServicesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-services',
  templateUrl: 'services.html',
})
export class ServicesPage {
  has_more_items: boolean = true;
  status:any;
  title:any;
  filter:any;
  count: any;
  offset:any;
  quantity:any;
  idVendor:any;
  orders: any=[];
  order_before_filter:any;
  unconfirm:any;
  constructor(public values:Values, public navCtrl: NavController, public navParams: NavParams, public service: Service) {
    this.title = navParams.data.title;
    this.status = navParams.data.status;
    this.unconfirm = navParams.data.unconfirm;
  }

  ionViewDidEnter(){    
    this.filter = {};
        this.filter.page = 1;
        this.count = 10;
        this.offset = 0;
        this.quantity = "1";
        this.idVendor = this.values.customerId;
        this.filter['id'] = this.values.customerId.toString();
        this.service.getBookingsVendor(this.filter)
            .then((results) =>{
              this.order_before_filter = results;
              this.orders = [this.order_before_filter.orders.filter((order:any) => order.order_status === this.status)];
              console.log(this.orders); 
            });
            
  }

  doInfinite(infiniteScroll) {
      this.filter.page += 1;
      this.service.getBookingsVendor(this.filter)
          .then((results) => {
            this.order_before_filter = results;
            this.orders = [this.order_before_filter.orders.filter((order:any) => order.order_status === this.status)];
            this.handleMore(this.orders, infiniteScroll)
          });
  }
  handleMore(results, infiniteScroll) {
      this.filter.page += 1;
      if (results.orders != undefined) {
          for (var i = 0; i < results.orders.length; i++) {
              this.orders.orders.push(results.orders[i]);
          };
      }
      if (results.orders.length == 0) {
          this.has_more_items = false;
      }
      infiniteScroll.complete();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicesPage');
  }

  getBookingDetails(idOrder) {
    var idVendor = this.idVendor;
    this.navCtrl.push(BookingDetails, {idOrder, idVendor});
  }


}
