import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Service } from '../providers/service/service';
import { Values } from '../providers/service/values';
import { Config } from '../providers/service/config';
import { TranslateService } from '@ngx-translate/core';
import { OneSignal } from '@ionic-native/onesignal';
import { ProductsPage } from '../pages/products/products';
import { CartPage } from '../pages/cart/cart';
import { AccountLogin } from '../pages/account/login/login';
import { Address } from '../pages/account/address/address';
import { Orders } from '../pages/account/orders/orders';
import { AccountRegister } from '../pages/account/register/register';
import { OrderSummary } from '../pages/checkout/order-summary/order-summary';
import { WishlistPage } from '../pages/account/wishlist/wishlist';
import { ProductPage } from '../pages/product/product';
import { Post } from '../pages/post/post';
import { AppRate } from '@ionic-native/app-rate';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EmailComposer } from '@ionic-native/email-composer';
import { NativeStorage } from '@ionic-native/native-storage';
import { AccountPage } from '../pages/account/account/account';
// import { OrdersVendor } from '../pages/account/orders-vendor/orders-vendor';
import { BookingVendor } from '../pages/account/booking-vendor/booking-vendor';
import { test } from '../pages/account/test/test';
import { IframePage } from '../pages/iframe/iframe';
import {PagesSupportPage} from '../pages/pages-support/pages-support';
import {ChatPage} from '../pages/chat/chat';
import {ProductsListPage} from '../pages/products-list/products-list';
import {TabsPage} from '../pages/tabs/tabs';
import { timer } from 'rxjs/observable/timer';
import {PagesProductsProvidersPage} from '../pages/pages-products-providers/pages-products-providers';
import { CategoryServicePage } from '../pages/category-service/category-service';
import {DashProveedorPage} from '../pages/dash-proveedor/dash-proveedor';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage: any = AccountLogin;
    status: any;
    items: any = {};
    buttonLanguagesSettings: boolean = false;
    Languages: any;
    customers: any;
    showSplash = true;

    constructor(statusBar: StatusBar, public splashScreen: SplashScreen, public alertCtrl: AlertController, public config: Config, private oneSignal: OneSignal, private emailComposer: EmailComposer, private appRate: AppRate, public platform: Platform, public service: Service, public values: Values, public translateService: TranslateService, private socialSharing: SocialSharing, private nativeStorage: NativeStorage) {

        this.service.getCustomer()
        .then((results) => this.customers = results);

        this.Languages = []
        platform.ready().then(() => {
            statusBar.styleDefault();
            statusBar.backgroundColorByHexString('#f4f5f8');
            this.splashScreen.hide();
            timer(2000).subscribe(()=>this.showSplash = false);
            this.service.load().then((results) => this.handleService(results));
            this.nativeStorage.getItem('blocks').then(data => { if (data) {

                this.service.blocks = data.blocks;
                this.values.settings = data.settings;
                this.values.calc(platform.width());
                } }, error => console.error(error));

            this.nativeStorage.getItem('categories').then(data => {
                if (data) {
                    this.service.categories = data;
                    this.service.mainCategories = [];
                    for (var i = 0; i < this.service.categories.length; i++) {
                        if (this.service.categories[i].parent == '0') {
                            this.service.mainCategories.push(this.service.categories[i]);
                        }
                    }
                }
            }, error => console.error(error));

        });

    }
    handleService(results) {
        if (this.values.settings.app_dir == 'rtl') this.platform.setDir('rtl', true);
        //cambiar luego en la configuracion del wordpress en el plugin
        this.translateService.setDefaultLang('spanish');
        // this.translateService.setDefaultLang(this.values.settings.language);

        this.values.calc(this.platform.width());

        if(this.values.isLoggedIn){
            if(this.values.subscription.length > 0){
                console.log('entro:',this.values.isLoggedIn);
                this.nav.setRoot(TabsPage);
            }else{
                console.log('entro:',this.values.isLoggedIn);
                this.nav.setRoot(test);
            }

        }else{
            console.log('entro else:',this.values.isLoggedIn);
            this.nav.setRoot(AccountLogin);
        }


        if (this.platform.is('cordova')) {
            this.oneSignal.startInit(this.values.settings.onesignal_app_id, this.values.settings.google_project_id);
            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
            this.oneSignal.handleNotificationReceived().subscribe(result => {
                console.log(result);
            });
            this.oneSignal.handleNotificationOpened().subscribe(result => {
                if (result.notification.payload.additionalData.category) {
                    this.nav.push(ProductsPage, {id: result.notification.payload.additionalData.category, slug: result.notification.payload.additionalData.slug, name: result.notification.payload.additionalData.name});
                } else if (result.notification.payload.additionalData.product) {
                    this.nav.push(ProductPage, {id: result.notification.payload.additionalData.product});
                } else if (result.notification.payload.additionalData.post) {
                    this.post({di: result.notification.payload.additionalData.post});
                } else if (result.notification.payload.additionalData.order) {
                    this.nav.push(OrderSummary, {id: result.notification.payload.additionalData.order});
                }
            });

            this.oneSignal.getIds().then(identity => {
              console.log("agarro id",identity.userId, identity.userId);

              this.values.pushToken = identity.pushToken
              this.values.userId = identity.userId
            });

            this.oneSignal.endInit();
        }
    }

    openPage(page) {
        this.nav.setRoot(page);
    }
    getCategory(id, slug, name) {
        this.items = [];
        this.items.id = id;
        this.items.slug = slug;
        this.items.name = name;
        this.items.categories = this.service.categories.filter(item => item.parent === parseInt(id));
        this.nav.setRoot(ProductsPage, this.items);
    }

    getCart() {
        this.nav.setRoot(CartPage);
    }
    logout() {
        this.service.logout();
        this.values.wishlistId = [];
        this.nav.setRoot(AccountLogin);
    }
    iframe() {
        this.nav.setRoot(IframePage);
    }
    chat(){
        this.nav.setRoot(ChatPage);
    }
    account() {
        this.nav.setRoot(AccountPage);
    }
    login() {
        this.nav.setRoot(AccountLogin);
    }
    register() {
        this.nav.setRoot(AccountRegister);
    }
    address() {
        this.nav.setRoot(Address);
    }
    order() {
        this.nav.setRoot(Orders);
    }
    orderVendor() {
        this.nav.setRoot(TabsPage);
    }
    pagesProductsProviders() {
        this.nav.setRoot(PagesProductsProvidersPage);
    }
    mycategories(){
      this.nav.setRoot(CategoryServicePage);
    }
    bookingVendor() {
        this.nav.setRoot(BookingVendor);
    }
    test() {
        this.nav.setRoot(test);
    }
    cart() {
        this.nav.setRoot(CartPage);
    }
    wishlist() {
        this.nav.setRoot(WishlistPage);
    }
    shop() {
        this.nav.setRoot(TabsPage);
    }
    rateApp() {
        if (this.platform.is('cordova')) {
            this.appRate.preferences.storeAppURL = {
                ios: this.values.settings.rate_app_ios_id,
                android: this.values.settings.rate_app_android_id,
                windows: 'ms-windows-store://review/?ProductId=' + this.values.settings.rate_app_windows_id
            };
            this.appRate.promptForRating(true);
        }
    }
    shareApp() {
        if(this.platform.is('cordova')){
            var url = '';
            if(this.platform.is('android'))
            url = this.values.settings.share_app_android_link;
            else url = this.values.settings.share_app_ios_link;
            var options = {
                message: '',
                subject: '',
                // files: ['', ''],
                url: url,
                chooserTitle: ''
            }
            this.socialSharing.shareWithOptions(options);
        }
    }
    setLang(){
        console.log(this.Languages)
        this.translateService.setDefaultLang(this.Languages);
    }
    contact() {
        let email = {
            to: this.values.settings.support_email,
            subject: '',
            body: '',
            isHtml: true
        };
        this.emailComposer.open(email);
    }
    support(){
        this.nav.setRoot(PagesSupportPage);
    }
    post(id) {
        this.nav.setRoot(Post, id);
    }

    dashboard(){
      this.nav.setRoot(DashProveedorPage)
    }
    openchat(){
      this.nav.setRoot(ChatPage)
    }

}
