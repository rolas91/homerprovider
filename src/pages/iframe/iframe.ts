import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NavController, ToastController, Platform, Content } from 'ionic-angular';
import { Service } from '../../providers/service/service';
import { Values } from '../../providers/service/values';
import { CartPage } from '../cart/cart';
import { ProductsPage } from '../products/products';
import { SearchPage } from '../search/search';
import { ProductPage } from '../product/product';
import { Post } from '../post/post';
import { Http } from '@angular/http'
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
// import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { TabsPage } from '../tabs/tabs';


declare var google;

@Component({
  selector: "page-iframe",
    templateUrl: 'iframe.html'
})

export class IframePage {
    @ViewChild('map') mapContainer: ElementRef;
    @ViewChild('pageTop') pageTop: Content;
    @ViewChild('myIframe') public myIframe;

//  @ViewChild('map',  {static: false}) mapElement: ElementRef;
  map: any;
  address:string;
  lat: string;
  long: string;  
  autocomplete: { input: string; };
  autocompleteItems: any[];
  PredictionArray: any[];
  
  location: any;
  placeid: any;
  GoogleAutocomplete: any;

  selectedCategory: string;
  HiddenList: boolean = true;
  HiddenListCat: boolean = true;
  HiddenSearchLocation: boolean = false;
  HideRadius: boolean = false;
  HideBtnSearch: boolean = false;
  autocompleteCat: { input: string; };

  itemsCategory: any;
  radius: any = 0;
  originalCoords;
  miLatitude = 0;
  miLongitude = 0;
  
    status: any;
    items: any;
    product: any;
    options: any;
    id: any;
    variationID: any;
    time: any;
    has_more_items: boolean = true;
    loading: boolean = true;
    constructor(
        private http: Http,
        private platform: Platform,
        private geolocation: Geolocation,
        private nativeGeocoder: NativeGeocoder,    
        public zone: NgZone,
        public toastCtrl: ToastController, public nav: NavController, public service: Service, public values: Values) {
        this.items = [];
        this.options = [];
        this.service.getProducts();

        this.autocomplete = { input: '' };
        this.autocompleteItems = [];

        this.autocompleteCat = { input: '' };
        this.itemsCategory = [];

        this.lat = '';
        this.long = '';  


       


        platform.ready().then(() => {
          // const subscription = this.geolocation.watchPosition()
          //   .filter((p) => p.coords !== undefined) //Filter Out Errors
          //   .subscribe(position => {
          //     this.miLatitude = position.coords.latitude;
          //     this.miLongitude = position.coords.longitude;
          //     console.log("miLocation=" + position.coords.latitude + ' ' + position.coords.longitude);
          //   });
          const subscription = this.geolocation.watchPosition().subscribe(position => {
            if ((position as Geoposition).coords != undefined) {
              var geoposition = (position as Geoposition);
              this.miLatitude = geoposition.coords.latitude;
              this.miLongitude = geoposition.coords.longitude;
              // console.log('Latitude: ' + geoposition.coords.latitude + ' - Longitude: ' + geoposition.coords.longitude);
            } else { 
              var positionError = (position as PositionError);
              console.log('Error ' + positionError.code + ': ' + positionError.message);
            }
          });

        });
    }

    ngAfterViewInit() {
      //   const iframDoc = this.myIframe.nativeElement.contentWindow.document;
      //  console.log(iframDoc)
      // // iframDoc.head.appendChild('style.css');
      // var z = document.createElement('p'); // is a node
      // z.innerHTML = 'test satu dua tiga';
      // document.body.appendChild(z);
      // iframDoc.head.innerHTML = '<style type="text/css" id="wp-custom-css-fuck">.site-header .header-main .site-title img{display: none;}.mierda{display:none}</style>';
      // //document.body.appendChild(z);
      // iframDoc.head.appendChild(z);


      // const iframDoc = this.myIframe.nativeElement.contentWindow.document;
      // // var elmnt = iframe.nativeElement.contentWindow.document.getElementsByClassName("w3schools-logo")[0];
      // let floorElements = this.myIframe.nativeElement.contentWindow.document.getElementsByClassName("header-main") as HTMLCollectionOf<HTMLElement>;

      // var cssLink = document.createElement("link") 
      // cssLink.href = "file://path/to/style.css"; 
      // cssLink .rel = "stylesheet"; 
      // cssLink .type = "text/css"; 
      // cssLink .id = "mierda"; 
      // iframDoc.head.innerHTML = cssLink;
 
      // console.log(iframDoc)

      // let iframe = document.getElementById("myIframe");
      // console.log(iframe) 
      // let element = (<HTMLIFrameElement>iframe).contentWindow.document.getElementsByTagName("h1")[0];
      // console.log(element)

      

    }


    ionViewDidEnter() {
        // let iframe = document.getElementById("iframeHomer");
        // let iframeWindow = (<HTMLIFrameElement>iframe).contentWindow;
        // let iframeDocument = (<HTMLIFrameElement>iframe).contentDocument;

        // let ver = iframeWindow.document.getElementById("main");
        // var textnode = document.createTextNode("Water");         // Create a text node
        // ver.appendChild(textnode); 
      
      // setTimeout(() => {
      //     this.searchbar.setFocus();
      // }, 0);
      // setTimeout(() => {
      //   let iframe = document.getElementById("iframeHomer");
      //   let iframeWindow = (<HTMLIFrameElement>iframe).contentWindow;
      //   let iframeDocument = (<HTMLIFrameElement>iframe).contentDocument;

      //   let ver = iframeWindow.document.getElementsByClassName("site-main");
      //   // var textnode = document.createTextNode("Rolando Jose Sanchez");
       
      //   // console.log('trextnode',textnode)
      //   // ver.appendChild(textnode); 
        
      //   // let iframe = document.getElementById("myIframe");
      //   // // let iframeWindow = (<HTMLIFrameElement>iframe).contentWindow;
      //   // let iframeDocument = (<HTMLIFrameElement>iframe);
      //   // let iframeHeader = iframeDocument.querySelectorAll
      //   //  //iframeHeader.textContent = "hola mundo";
      //   // console.log('iframeDocument:',iframeDocument)
      //   // console.log('iframeHeader:',iframeHeader)

      //   // var cssLink = document.createElement("style") 
      //   // cssLink .id = "mierda"; 
      //   // cssLink.innerHTML = '.header-main{display:none!important}';
      //   // console.log('meh:',iframeDocument.appendChild(cssLink))

      // }, 3000)
  }

    ionSelected() {
      console.log("productlist Page has been selected");
      // do your stuff here
      this.nav.setRoot(TabsPage);
      this.pageTop.scrollToTop();
    }
    gohome() {
      this.nav.parent.select(0);
    }

}