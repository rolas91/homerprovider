import { Component } from '@angular/core'
import { NavController, Platform, AlertController } from 'ionic-angular'
import { Service } from '../../../providers/service/service'
import { Functions } from '../../../providers/service/functions'
import { Values } from '../../../providers/service/values'
import { AccountForgotten } from '../forgotten/forgotten'
import { OneSignal } from '@ionic-native/onesignal'
import { CategoryService } from '../../../providers/service/category-service'
// import { TabsPage } from '../../tabs/tabs'
import { test } from '../../account/test/test'
import {DashProveedorPage} from '../../dash-proveedor/dash-proveedor'
// import { IframePage } from '../../iframe/iframe'
// import {Home} from '../../home/home'

@Component({
  templateUrl: 'login.html',
})
export class AccountLogin {
  loginData: any
  loadLogin: any
  status: any
  error: any
  nonce: any
  nonceResendKey: any
  public disableSubmit: boolean = false
  buttonText: any
  countries: any
  isActiveToggleTextPassword: Boolean = true

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  products:any;
  constructor(
    public nav: NavController,
    public service: Service,
    public functions: Functions,
    public values: Values,
    public platform: Platform,
    private oneSignal: OneSignal,
    public alert: AlertController,
    public categoryService: CategoryService
  ) {
    this.loginData = {}
    this.buttonText = 'Login'
    this.service.getNonce().then(results => (this.nonce = results))
    this.countries = {}
    this.products = []

  }


  gohome(){
    this.nav.parent.select(0);
  }

  login() {
    if (this.validateForm()) {
      this.disableSubmit = true
      this.buttonText = 'Logging In...'
      this.service
        .login(this.loginData)
        .then(results => this.handleResults(results))
    }
  }
  validateForm() {
    if (this.loginData.username == undefined || this.loginData.username == '') {
      return false
    }
    if (this.loginData.password == undefined || this.loginData.password == '') {
      return false
    } else {
      return true
    }
  }
  handleResults(results) {
    this.disableSubmit = false
    this.buttonText = 'Login'
    if (!results.errors) {

      if (this.platform.is('cordova'))
        this.oneSignal.getIds().then((data: any) => {
          this.service.subscribeNotification(data)
      })

      // this.categoryService.getProductsByIdVendor2()
      // .then((result:any) => {
      //   if(result.length > 0){
      //     for(let i=0; i<result.length; i++){
      //       this.products.push(result[i])
      //     }
      //   }
      // });



      // this.service.registerProvider({
      //   id:this.values.customerId,
      //   lat: 'kdjlakda',
      //   lng: 'ksajldkas',
      //   products:this.products,
      //   onesignal:this.values.userId
      // })
      // .then(results => console.log("resultado del registro del proveedor",results))
      // .catch(error => console.log(error));



        this.nav.setRoot(DashProveedorPage);

        // console.log(results)
        // if(results.data.subscription.length == 0){
        //   console.log('entro no subscription:',this.values.isLoggedIn);
        //     this.nav.setRoot(test);
        // }else{
        //   console.log('entro subscription:',this.values.isLoggedIn);
        //   this.nav.setRoot(DashProveedorPage);
        // }
    }
    else if (results.errors) {
      if(results.errors.invalid_email)
        this.functions.showAlert('Email', results.errors.invalid_email)
      else if(results.errors.invalid_username)
        this.functions.showAlert('Username', results.errors.invalid_username)
      else if(results.errors.incorrect_password)
        this.showAlertForgotPass('Password', '<strong>ERROR</strong>: The password you entered for the email address <strong>'+this.loginData.username+'</strong> is incorrect.')
      else if(results.errors.az_confirmation_error)
      this.showAlertResendKey('Confirmation mail', '<strong>ERROR:</strong> Please verify your account before login.')
      else
        this.functions.showAlert('error', 'invalid username/password')
    }
  }
  forgotten() {
    this.nav.push(AccountForgotten)
  }
  showAlertForgotPass(title, text) {
    let alert = this.alert.create({
        title: title,
        subTitle: text,
        buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Lost your password?',
              handler: data => {
                 this.forgotten();
              }
            }
          ],
    });
    alert.present();
  }
  showAlertResendKey(title, text) {
    let alert = this.alert.create({
        title: title,
        subTitle: text,
        buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Resend Verification Link?',
              handler: data => {
                this.service.getNonceResendKey(this.loginData.username).then((results) => this.handleResultsNonce(results));

              }
            }]
    });
    alert.present();
  }
  handleResultsNonce(results) {
    this.countries = results;
    this.service.resendKey(this.loginData.username, this.countries.resend_key_nonce);
  }

  public toggleTextPassword(): void{
    this.isActiveToggleTextPassword = (this.isActiveToggleTextPassword==true)?false:true;
}
public getType() {
    return this.isActiveToggleTextPassword ? 'password' : 'text';
}

hideShowPassword() {
  this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
  this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}

}
