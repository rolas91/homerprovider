import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import {Values} from '../../providers/service/values'

import { Service } from '../../providers/service/service';
import { ProductsPage } from '../products/products';
import { SearchPage } from '../search/search';
import { ProductPage } from '../product/product';
import { Post } from '../post/post';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
// import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { TabsPage } from '../tabs/tabs';

import { CategoryService } from '../../providers/service/category-service'
import { PagesProductsProvidersPage } from '../pages-products-providers/pages-products-providers';

/**
 * Generated class for the CategoryServicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-category-service',
  templateUrl: 'category-service.html',
})
export class CategoryServicePage {
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

  setProduct:any;
  data:any;
  category:any;
  checked:boolean=false;

  filter: any;
  products: any

    status: any;
    items: any;
    product: any;
    options: any;
    id: any;
    variationID: any;
    time: any;
    has_more_items: boolean = true;
    loading: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public values:Values, public service: Service, public alert:AlertController, public categoryService:CategoryService) {
        this.items = [];
        this.options = [];
        this.service.getProducts();

        this.autocomplete = { input: '' };
        this.autocompleteItems = [];

        this.autocompleteCat = { input: '' };
        this.itemsCategory = [];

        this.lat = '';
        this.long = '';
        this.category = [];

  }

  gohome() {
    this.navCtrl.parent.select(0);
  }

  addServicio(e,cat){
    this.category.push({id:cat});
    // let index;
    // if(this.category.length != 0){
    //   for(let i in this.category){

    //     console.log('hi',this.category[i].id, cat);

    //     if(this.category[i].id == cat){
    //       console.log('elimino ');

    //       index = this.category.map(result => result.id).indexOf(cat);
    //       if ( index > -1 ) {
    //         this.category.splice( index, 1 );
    //       }

    //     }else if(this.category[i].id != cat){
    //       this.category.push({id:cat});
    //     }
    //   }


    // }else{
    //   this.category.push({id:cat});
    // }

    // let index;
    // if(this.category.length != 0){
    //   index = this.category.map(result => result.from_date).indexOf(cat);
    //   console.log((index));

    //   if ( index > -1 ) {
    //       this.category.splice( index, 1 );
    //   }
    // }else{
    //   this.category.push({id:cat})
    // }


  }

  showAlert(title, text) {
    let alert = this.alert.create({
        title: title,
        subTitle: text,
        buttons: ['OK'],
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryServicePage');
  }


  updateCategory(){
    this.data={
      categories : this.category
    }
    this.service.updateProduct(this.data, this.setProduct);
    this.showAlert('Actualizado correctamente', '<strong>Exito:</strong> Has actualizado las categorías correctamente');
    this.navCtrl.push(PagesProductsProvidersPage);
  }

  ionViewDidEnter() {
    this.categoryService.getProductsByIdVendor()
    .then((resultsByVendor) => {
      this.setProduct = resultsByVendor;
    });
  }



}
