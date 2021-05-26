import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'
import { MyApp } from './app.component'
import { Home } from '../pages/home/home'
import { Address } from '../pages/account/address/address'
import { EditAddressForm } from '../pages/account/edit-address-form/edit-address-form'
import { AccountForgotten } from '../pages/account/forgotten/forgotten'
import { AccountLogin } from '../pages/account/login/login'
import { Post } from '../pages/post/post'
import { OrderDetails } from '../pages/account/order-details/order-details'
import { Orders } from '../pages/account/orders/orders'
import { OrdersVendor } from '../pages/account/orders-vendor/orders-vendor'
import { BookingVendor } from '../pages/account/booking-vendor/booking-vendor'
import { BookingDetails } from '../pages/account/booking-details/booking-details'
import { test } from '../pages/account/test/test'
import { IframePage } from '../pages/iframe/iframe'
import { AccountRegister } from '../pages/account/register/register'
import { WishlistPage } from '../pages/account/wishlist/wishlist'
import { AccountPage } from '../pages/account/account/account'
import {DashProveedorPage} from '../pages/dash-proveedor/dash-proveedor'
import {ChatPage} from '../pages/chat/chat';
import {NewProductPage} from '../pages/new-product/new-product';

import { CartPage } from '../pages/cart/cart'
import { BillingAddressForm } from '../pages/checkout/billing-address-form/billing-address-form'
import { OrderSummary } from '../pages/checkout/order-summary/order-summary'
import { TermsCondition } from '../pages/checkout/terms-condition/terms-condition'
import { ProductPage } from '../pages/product/product'
import { ProductsPage } from '../pages/products/products'
import { SearchPage } from '../pages/search/search'
import { TabsPage } from '../pages/tabs/tabs'
import { ProductsListPage } from '../pages/products-list/products-list'
import {PagesSupportPage} from '../pages/pages-support/pages-support'
import {ServicesPage} from '../pages/services/services';
import {PagesProductsProvidersPage} from '../pages/pages-products-providers/pages-products-providers';
import {CategoryServicePage} from '../pages/category-service/category-service';
import {OrdersPage} from '../pages/orders/orders';
import {EndOrdersPage} from '../pages/end-orders/end-orders';
import {OrdersDetailPage} from '../pages/orders-detail/orders-detail';

import {ModalPage} from '../pages/modal/modal'
/*------------------------Providers----------------------------------*/

import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { InAppBrowser } from '@ionic-native/in-app-browser'
import { NativeStorage } from '@ionic-native/native-storage'
import { BrowserModule } from '@angular/platform-browser'
import { CartService } from '../providers/service/cart-service'
import { WishlistService } from '../providers/service/wishlist-service'
import { CategoryService } from '../providers/service/category-service'
import { CheckoutService } from '../providers/service/checkout-service'
import { Config } from '../providers/service/config'
import { Functions } from '../providers/service/functions'
import { ProductService } from '../providers/service/product-service'
import { SearchService } from '../providers/service/search-service'
import { Service } from '../providers/service/service'
import { Values } from '../providers/service/values'
import { KeysPipe } from '../providers/pipe/pipe'
import {EndOrdesService} from '../providers/service/endorders'
//import { PhotoViewer } from '@ionic-native/photo-viewer';
import { CallNumber } from '@ionic-native/call-number'
import { EmailComposer } from '@ionic-native/email-composer'
import { AppRate } from '@ionic-native/app-rate'
import { SocialSharing } from '@ionic-native/social-sharing'
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { HttpModule } from '@angular/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { OneSignal } from '@ionic-native/onesignal'
import { HTTP } from '@ionic-native/http'

import { CalendarModule } from 'ion2-calendar'
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder';


// import {ImagePicker} from '@ionic-native/image-picker';

import { BackgroundMode } from '@ionic-native/background-mode';

// import socket io

import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

// const config:SocketIoConfig  = { url:'http://localhost:3001', options:{}}
const config:SocketIoConfig = {url:'https://websockethomer.herokuapp.com/', options:{}}


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

@NgModule({
  declarations: [
    MyApp,
    Home,
    Address,
    EditAddressForm,
    AccountForgotten,
    AccountLogin,
    OrderDetails,
    Orders,
    OrdersVendor,
    BookingVendor,
    BookingDetails,
    test,
    IframePage,
    Post,
    AccountRegister,
    WishlistPage,
    AccountPage,
    CartPage,
    BillingAddressForm,
    OrderSummary,
    TermsCondition,
    ProductPage,
    ProductsPage,
    SearchPage,
    TabsPage,
    ProductsListPage,
    KeysPipe,
    PagesSupportPage,
    DashProveedorPage,
    ServicesPage,
    ChatPage,
    PagesProductsProvidersPage,
    NewProductPage,
    CategoryServicePage,
    OrdersPage,
    EndOrdersPage,
    OrderDetails,
    OrdersDetailPage,
    ModalPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CalendarModule,
    HttpModule,
    SocketIoModule.forRoot(config),
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
    Address,
    EditAddressForm,
    AccountForgotten,
    AccountLogin,
    OrderDetails,
    Orders,
    OrdersVendor,
    BookingVendor,
    BookingDetails,
    test,
    IframePage,
    Post,
    AccountRegister,
    WishlistPage,
    AccountPage,
    CartPage,
    BillingAddressForm,
    OrderSummary,
    TermsCondition,
    ProductPage,
    ProductsPage,
    SearchPage,
    TabsPage,
    ProductsListPage,
    PagesSupportPage,
    DashProveedorPage,
    ServicesPage,
    ChatPage,
    PagesProductsProvidersPage,
    NewProductPage,
    CategoryServicePage,
    OrdersPage,
    EndOrdersPage,
    OrderDetails,
    OrdersDetailPage,
    ModalPage
  ],
  providers: [
    FileTransfer,
    CartService,
    WishlistService,
    CategoryService,
    CheckoutService,
    Config,
    Functions,
    ProductService,
    SearchService,
    Service,
    Values,
    OneSignal,
    StatusBar,
    SplashScreen,
    InAppBrowser,
    NativeStorage,
    SocialSharing,
    AppRate,
    EmailComposer,
    CallNumber,
    HTTP,
    Geolocation,
    NativeGeocoder,
    BackgroundMode,
    FileTransfer,
    EndOrdesService,
    BackgroundMode,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AppModule {}
