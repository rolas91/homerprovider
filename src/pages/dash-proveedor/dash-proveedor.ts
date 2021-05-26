import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
// import {Cordova} from 'ionic-native';
import { CategoryService } from '../../providers/service/category-service'
import { BackgroundMode } from '@ionic-native/background-mode';
import {Values} from '../../providers/service/values';
import { Service } from '../../providers/service/service';
import {Socket}  from 'ngx-socket-io';
import {ServicesPage} from '../services/services';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';

import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { OrdersPage } from '../orders/orders';
import { EndOrdersPage } from '../end-orders/end-orders';
import { Post } from '../post/post';


/**
 * Generated class for the DashProveedorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-dash-proveedor',
  templateUrl: 'dash-proveedor.html',
})
export class DashProveedorPage {
  homerProviders = [];
  lat:string;
  lng:string;
  miLatitude = 0;
  miLongitude = 0;
  filter: any;
  products:any;
  constructor(public serv:Service, public service: CategoryService, private nativeGeocoder: NativeGeocoder, private platform: Platform, private backgroundMode: BackgroundMode, private socket: Socket, public navCtrl: NavController, public navParams: NavParams, public values: Values, private geolocation: Geolocation) {
    this.filter = {}
    this.lat = '';
    this.lng = '';
    this.products = [];

    this.socket.connect();
    this.platform.ready().then(() => {
       this.geolocation.watchPosition().subscribe(position => {
        if ((position as Geoposition).coords != undefined) {
          var geoposition = (position as Geoposition);
          this.miLatitude = geoposition.coords.latitude;
          this.miLongitude = geoposition.coords.longitude;
          console.log('Latitude: ' + geoposition.coords.latitude + ' - Longitude: ' + geoposition.coords.longitude);
        } else {
          var positionError = (position as PositionError);
          console.log('Error ' + positionError.code + ': ' + positionError.message);
        }
      });


    });
    // this.backgroundMode.setDefaults({
    //   title: "Homer background",
    //   text: "Ahora esta a la escucha de notificaciones",
    //   icon:'platforms/android/app/src/res/endmipmap-hdpi/ic_launcher.png',
    //   color: 'F14F4D', // hex format like 'F14F4D'
    //   resume: true,
    //   hidden: false,
    //   bigText: false
    // });

    // this.backgroundMode.on('activate').subscribe(() => {
    //   console.log("backgroundMode Activate");
    //   this.backgroundMode.disableWebViewOptimizations();
    // });

    // this.serv.registerProvider({
    //   id:this.values.customerId,
    //   lat: 'kdjlakda',
    //   lng: 'ksajldkas',
    //   products:this.products,
    //   onesignal:this.values.userId
    // })
    // .then(results => console.log("resultado del registro del proveedor",results))
    // .catch(error => console.log(error));
  }



  ionViewDidLoad() {

  }

  ionViewDidEnter(){
    this.service.getProductsByIdVendor2()
    .then((result:any) => {
      if(result.length > 0){
        for(let i=0; i<result.length; i++){
          this.products.push({id:result[i]})
        }
      }
    });
  }


  ngOnInit() {
    this.socket.fromEvent('adduser').subscribe((data:any) => {
      this.homerProviders.push(data);

      for(let provider of this.homerProviders){
        if(this.values.customerId == provider){
          // this.values.isActive = true;
        }
      }
    });

    // this.socket.fromEvent('message').subscribe(message => {
    //   // this.messages.push(message);
    // });
  }

  // ionViewWillEnter(){
  //   console.log("conectando al socket");

  //   this.socket.connect();
  // }



  changeToggle(){
    console.log(this.values.isActive)
    if(!this.values.isActive){
      this.backgroundMode.disable();
      this.values.isActive = false;
      this.socket.emit('adduser',{
        id:this.values.customerId,
        lat: this.miLatitude,
        lng: this.miLongitude,
        products:this.products,
        onesignal:this.values.userId
      });
      // this.backgroundMode.on('deactivate').subscribe(() => {
      // });
    }else {
      this.backgroundMode.enable();
      this.socket.connect();
      this.values.isActive = true;
      this.socket.emit('adduser',{
        id:this.values.customerId,
        lat: this.miLatitude,
        lng: this.miLongitude,
        products:this.products,
        onesignal:this.values.userId
      });

    }
  }

  end_services() {
    this.navCtrl.push(EndOrdersPage);
  }

  pastservice(){
    this.navCtrl.push(Post,{title:'Servicios Pasados',id:93})
  }

  services() {
    this.navCtrl.push(OrdersPage);
  }
  // sendMessage() {
  //   // this.socket.emit('send-message', { text: this.message });
  //   // this.message = '';
  // }
    // ionViewWillLeave() {
    //   this.socket.disconnect();
    // }

}
