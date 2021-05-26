import {Component } from '@angular/core';
import { NavController, NavParams, AlertController} from 'ionic-angular';
import { Service } from '../../providers/service/service';
import {Values} from '../../providers/service/values';
import { Config } from '../../providers/service/config';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
// import { ImagePicker } from '@ionic-native/image-picker';
// import { Camera, CameraOptions } from '@ionic-native/camera';
import { PagesProductsProvidersPage } from '../pages-products-providers/pages-products-providers';
// interface Day {
//   name:string;
// }

// interface Availability{
//   type:string ;
//   bookable:string;
//   priority:number,
//   from:string;
//   to:string;
//   from_date:string;
//   to_date:string;
// }
/**
 * Generated class for the NewProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-new-product',
  templateUrl: 'new-product.html',
})
export class NewProductPage {
  // @ViewChild('indicator')indicator:ElementRef;
  // @ViewChild('tabs_control')tabs_control:ElementRef;
  // @ViewChild('tabs')tabs:ElementRef;
  // @ViewChild('tab')tab:ElementRef;

    photos: any;
    err: any;
    imageIndex: any = 0;
    form: any = { type: 'simple', status: 'pending', in_stock: true, images: [], purchasable: true, manage_stock: true, shipping_required: true, sold_individually: false  };
    imageresult: any;
    uploadingImageSpinner: boolean = false;
    getCategory:any;
    data:any = [];
    name: string;
    slug: string;
    status: string = "publish"
    featured:boolean = false;
    catalog_visibility: string = "visible"
    description:string;
    short_description:string;
    sku: string = "";
    price:string;
    regular_price:string;
    sale_price:string;
    date_on_sale_from: null;
    date_on_sale_from_gmt: null;
    date_on_sale_to: null;
    date_on_sale_to_gmt: null;
    price_html:string = "Desde: <span class=\"woocommerce-Price-amount amount\"><span class=\"currency\"><span class=\"woocommerce-Price-currencySymbol\">&#36;</span></span>70<span class=\"decimals\">.00</span></span>";
    on_sale:boolean = false;
    purchasable:boolean = true;
    virtual:boolean = false;
    downloadable: boolean = false;
    downloads:any = [];
    download_limit:number = -1;
    download_expiry:number = -1;
    external_url:string = "";
    button_text:string = "";
    tax_status:string = "taxable";
    tax_class:string = "";
    manage_stock:boolean = false;
    stock_quantity: null;
    stock_status: string = "instock";
    backorders:string = "no";
    backorders_allowed:boolean = false;
    backordered:boolean = false;
    sold_individually:boolean = true;
    weight:string = "";
    shipping_required:boolean = true;
    shipping_taxable:boolean = true;
    shipping_class:string = "";
    shipping_class_id:number = 0;
    reviews_allowed:boolean = true;
    average_rating:string = "1.00";
    rating_count:number = 1;
    upsell_ids: any = [];
    cross_sell_ids:any = [];
    parent_id:number = 0;
    purchase_note:string = "";
    categories:any = [];
    tags:any = [];
    images:any = [
      {
        "id": 5489,
        "date_created": "2020-08-17T02:37:55",
        "date_created_gmt": "2020-08-17T10:37:55",
        "date_modified": "2020-11-05T16:32:01",
        "date_modified_gmt": "2020-11-06T00:32:01",
        "src": "https://dev.digitalfactory.tech/demos/homer/wp-content/uploads/2020/06/unnamed-7.png",
        "name": "unnamed (7)",
        "alt": ""
      }
    ];
    attributes:any = [];
    default_attributes:any = [];
    variations:any = [];
    grouped_products:any = [];
    menu_order:number = 0;
    apply_adjacent_buffer: false;
    availability:any = [];
    block_cost:number;
    buffer_period: number = 0;
    calendar_display_mode:string = "always_visible";
    cancel_limit_unit:string = "day";
    cancel_limit:number = 1;
    check_start_block_only:boolean = false;
    cost:number;
    display_cost:string;
    duration_type:string = "fixed";
    duration_unit:string = "hour";
    duration: number = 1;
    enable_range_picker:boolean = true;
    first_block_time:string = "";
    has_person_cost_multiplier:boolean = false;
    has_person_qty_multiplier:boolean = false;
    has_person_types:boolean = false;
    has_persons: boolean = false;
    has_resources:boolean = false;
    max_date_value:number = 6;
    max_date_unit: string = "month";
    max_duration:number = 1;
    max_persons:number = 0;
    min_date_value:number = 0;
    min_date_unit:string = "month";
    min_duration: number = 1;
    min_persons:number = 0;
    person_types:any = [];
    pricing:any = [];
    qty:number = 1;
    requires_confirmation:boolean = false;
    resource_label:string = "Services";
    resources_assignment:string = "customer";
    restricted_days:string = ""
    can_be_cancelled:boolean = true;
    user_can_cancel:boolean = true;


    from:string;
    to:string;
    from_date:string;
    to_date:string;

    categoriesValue:any;

  // days:Day[] = [
  //   {

  //     name:"MONDAY"
  //   },
  //   {

  //     name:"TUESDAY"
  //   },
  //   {

  //     name:"WEDNESDAY"
  //   },
  //   {

  //     name:"THURSDAY"
  //   },
  //   {

  //     name:"FRIDAY"
  //   },
  //   {
  //     name:"SATURDAY"
  //   },
  //   {
  //     name:"SUNDAY"
  //   }
  // ];

  constructor(public nav: NavController, public navParams: NavParams, public values: Values, public alert:AlertController,public service: Service, public config:Config, private transfer: FileTransfer) {
    this.availability = [];
    this.categories = [];
    this.service.getCategories(1);
    navParams.data.availability
    this.getCategory = this.service.mainCategories;

    console.log(navParams.data);


    if (navParams.data.id) {
      this.name = navParams.data.name;
      this.description = navParams.data.description.replace(/<[^>]*>?/gm,' ');
      this.short_description = navParams.data.short_description.replace(/<[^>]*>?/gm,' ');
      this.cost = navParams.data.cost;
      this.block_cost = navParams.data.block_cost;
      this.display_cost = navParams.data.display_cost;
      navParams.data.availability.map(result =>{
        this.availability.push({
            type: result.type,
            bookable: result.bookable,
            priority:result.priority,
            from: result.from,
            to: result.to,
            from_date: result.from_date,
            to_date:result.to_date
          });
      });
      navParams.data.categories.map(result => {
        this.categories.push({
          id:result.id,
          name:result.name
        })
      });
    }
  }

  ngAfterViewInit() {
    // this.indicator.nativeElement.style.width = this.tabs_control.nativeElement.children[0].clientWidth + "px";

    // for(let i=0; i < this.tabs_control.nativeElement.children.length; i++){
    //   this.renderer.listen( this.tabs_control.nativeElement.children[i],'click',this.handleClick);
    // }
  }

//   picker() {
//     let options = {
//         //maximumImagesCount: 1, //Comment for multi images
//     }
//     this.photos = new Array < string > ();
//     this.imagePicker.getPictures(options).then((results : any) => {
//         // For Single select, crop and upload images
//         //this.reduceImages(results).then((results) => this.handleUpload(results));

//         // For multi image upload
//         for (var i = 0; i < results.length; i++) {
//            this.upload(results[i]);
//         }
//     }, (err) => {
//         console.log(err)
//     });
// }

  upload(image) {
    this.uploadingImageSpinner = true;
    const fileTransfer: FileTransferObject = this.transfer.create();
    var headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    let options: FileUploadOptions = {
        chunkedMode: false,
        fileKey: 'file',
        fileName: 'name.jpg',
        headers: {
            headers
        }
    }
    fileTransfer.upload(image, this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp_admin_upload_image', options).then((data) => {
        this.uploadingImageSpinner = false;
        this.imageresult = JSON.parse(data.response);
        this.form.images[this.imageIndex] = {};
        this.form.images[this.imageIndex].src = this.imageresult.url;
        this.imageIndex = this.imageIndex + 1;
    }, (err) => {
        this.err = err;
        //this.functions.showAlert("error", err.error);
    })
  }

  // upload2()
  // {
  //   let options = {
  //     quality: 100
  //   };

  //   this.camera.getPicture(options).then((imageData) => {
  //     // imageData is either a base64 encoded string or a file URI
  //     // If it's base64:

  //       const fileTransfer: FileTransferObject = this.transfer.create();

  //         let options1: FileUploadOptions = {
  //           fileKey: 'file',
  //           fileName: 'name.jpg',
  //           headers: {}

  //         }

  //     fileTransfer.upload(imageData, 'https://localhost/ionic/upload.php', options1)
  //     .then((data) => {
  //       // success
  //       alert("success");
  //     }, (err) => {
  //       // error
  //       alert("error"+JSON.stringify(err));
  //     });
  //  });
  // }

  deleteTipoServicio(id){
    let index = this.categories.map(result => result.id).indexOf(id);

    if(index > -1){
      this.categories.splice(index, 1);
    }
  }

  deleteAvailability( item ) {
    let index = this.availability.map(result => result.from_date).indexOf(item);
    if ( index > -1 ) {
        this.availability.splice( index, 1 );
    }

  }

  updateProduct(){
    this.data={
      name : this.name,
      description : this.description,
      short_description: this.short_description,
      cost : this.cost,
      block_cost : this.block_cost,
      display_cost : this.display_cost,
      availability: this.availability,
      categories : this.categories
    }
    if(this.name != undefined && this.description != undefined && this.short_description != undefined &&
      this.cost != undefined && this.block_cost != undefined && this.categories.length != 0 && this.availability.length != 0
   ){
     this.service.updateProduct(this.data, this.navParams.data.id);
     this.showAlert('Actualizado correctamente', '<strong>Exito:</strong> Has actualizado este producto correctamente');
     this.nav.push(PagesProductsProvidersPage);
   }else{
     this.showAlert('Ha ocurrido un error', '<strong>Por favor</strong> llena todos los campos');
   }
  }

  sendProduct(){
    this.data = {
      name:this.name,
      slug:this.slug,
      status:this.status,
      featured:this.featured,
      catalog_visibility:this.catalog_visibility,
      description:this.description,
      short_description:this.short_description,
      sku:this.sku,
      price:this.price,
      regular_price:this.regular_price,
      sale_price:this.sale_price,
      date_on_sale_from: this.date_on_sale_from,
      date_on_sale_from_gmt:this.date_on_sale_from_gmt,
      date_on_sale_to:this.date_on_sale_to,
      date_on_sale_to_gmt:this.date_on_sale_to_gmt,
      price_html:this.price_html,
      on_sale:this.on_sale,
      purchasable:this.purchasable,
      virtual:this.virtual,
      downloadable:this.downloadable,
      downloads:this.downloads,
      download_limit:this.download_limit,
      download_expiry:this.download_expiry,
      external_url:this.external_url,
      button_text:this.button_text,
      tax_status:this.tax_status,
      tax_class:this.tax_class,
      manage_stock:this.manage_stock,
      stock_quantity:this.stock_quantity,
      stock_status:this.stock_status,
      backorders:this.backorders,
      backorders_allowed:this.backorders_allowed,
      backordered:this.backordered,
      sold_individually:this.sold_individually,
      weight:this.weight,
      shipping_required:this.shipping_required,
      shipping_taxable:this.shipping_taxable,
      shipping_class:this.shipping_class,
      shipping_class_id:this.shipping_class_id,
      reviews_allowed:this.reviews_allowed,
      average_rating:this.average_rating,
      rating_count:this.rating_count,
      upsell_ids:this.upsell_ids,
      cross_sell_ids:this.cross_sell_ids,
      parent_id:this.parent_id,
      purchase_note:this.purchase_note,
      categories:this.categories,
      tags:this.tags,
      images:this.images,
      attributes:this.attributes,
      default_attributes:this.default_attributes,
      variations:this.variations,
      grouped_products:this.grouped_products,
      menu_order:this.menu_order,
      apply_adjacent_buffer:this.apply_adjacent_buffer,
      availability:this.availability,
      block_cost:this.block_cost,
      buffer_period:this.buffer_period,
      calendar_display_mode:this.calendar_display_mode,
      cancel_limit_unit:this.cancel_limit_unit,
      cancel_limit:this.cancel_limit,
      check_start_block_only:this.check_start_block_only,
      cost:this.cost,
      display_cost:this.display_cost,
      duration_type:this.duration_type,
      duration_unit:this.duration_unit,
      duration:this.duration,
      enable_range_picker:this.enable_range_picker,
      first_block_time:this.first_block_time,
      has_person_cost_multiplier:this.has_person_cost_multiplier,
      has_person_qty_multiplier:this.has_person_qty_multiplier,
      has_person_types:this.has_person_types,
      has_persons:this.has_persons,
      has_resources:this.has_resources,
      max_date_value:this.max_date_value,
      max_date_unit:this.max_date_unit,
      max_duration:this.max_duration,
      max_persons:this.max_persons,
      min_date_value:this.min_date_value,
      min_date_unit:this.min_date_unit,
      min_duration:this.min_duration,
      min_persons:this.min_persons,
      person_types:this.person_types,
      pricing:this.pricing,
      qty: this.qty,
      requires_confirmation:this.requires_confirmation,
      resource_label:this.resource_label,
      resources_assignment:this.resources_assignment,
      restricted_days:this.restricted_days,
      can_be_cancelled: this.can_be_cancelled,
      user_can_cancel:this.user_can_cancel
    }
    if(this.name != undefined && this.description != undefined && this.short_description != undefined &&
       this.cost != undefined && this.block_cost != undefined && this.categories.length != 0 && this.availability.length != 0
    ){
      this.service.addProduct(this.data);
      this.showAlert('Registrado correctamente', '<strong>Exito:</strong> Has registrado un producto correctamente');
      this.nav.pop();
    }else{
      this.showAlert('Ha ocurrido un error', '<strong>Por favor</strong> llena todos los campos');
    }
  }

  onChange(evt) {
    if(this.categories.length == 0){
      this.categories.push({id:evt.id, name:evt.name});
      this.categoriesValue = [];
    }else{
      if(this.categories.id != evt){
        this.categories.push({id:evt.id, name:evt.name});
        this.categoriesValue = [];
      }
    }
    this.categoriesValue = [];
  }
  addAvailability(){
      if(this.availability.length == 0 ){
        if(this.from_date != undefined && this.from_date != ''  && this.to_date != undefined && this.to_date != '' && this.from != undefined && this.from != '' && this.to != undefined && this.to != ''){
          this.availability.push({
            type: "time:range",
            bookable: "yes",
            priority: 10,
            from: this.from,
            to: this.to,
            from_date: this.from_date,
            to_date:this.to_date
          });

          this.from = '';
          this.to = '';
          this.from_date = '';
          this.to_date = '';
        }else{
          this.showAlert('No sea seleccionado ninguna opción', '<strong>Error:</strong> Por favor selecciona todos los campos');
        }
      }else{
        for( let i in this.availability ){
         if(this.availability[i].from_date == this.from_date){
            this.showAlert(`${this.from_date} ya fue agregado`, '<strong>Error:</strong> Por favor selecciona otra disponibilidad.');
            break;
          }else{
            if(this.from_date != undefined && this.from_date != ''  && this.to_date != undefined && this.to_date != '' && this.from != undefined && this.from != '' && this.to != undefined && this.to != ''){
              this.availability.push({
                type: "time:range",
                bookable: "yes",
                priority: 10,
                from: this.from,
                to: this.to,
                from_date: this.from_date,
                to_date:this.to_date
              });
              this.from = '';
              this.to = '';
              this.from_date = '';
              this.to_date = '';
            }else{
              this.showAlert('No sea seleccionado ninguna opción', '<strong>Error:</strong> Por favor selecciona todos los campos');
              break;
            }
          }
      }
    }
  }

  showAlert(title, text) {
    let alert = this.alert.create({
        title: title,
        subTitle: text,
        buttons: ['OK'],
    });
    alert.present();
  }


  //  handleClick (ev){
  //   ev.preventDefault();
  //   let button = ev.currentTarget;
  //   let children = button.parentNode.children;

  //   for(var i=0; i<children.length; i++){
  //     let child = children[i];
  //     if(child == button) {
  //       console.log(i);

  //     };
  //   }
  //   console.log(this.tab);

  }
