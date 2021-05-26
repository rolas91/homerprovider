import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Service } from '../../../providers/service/service';
import { Values } from '../../../providers/service/values';
import { AccountLogin } from '../login/login';
import { EditAddressForm } from '../edit-address-form/edit-address-form';
import { TabsPage } from '../../tabs/tabs';

@Component({
    templateUrl: 'account.html',
})
export class AccountPage {
    customers: any;
    addresses: any;
    address: any;
    status: any;
    form: any;
    constructor(public nav: NavController, public service: Service, public values: Values) {
        this.service.getCustomer()
            .then((results) => this.customers = results);

        this.service.getAddress()
            .then((resultsAddresses) => this.addresses = resultsAddresses);
    }
    editAddress() {
      this.nav.push(EditAddressForm, this.addresses.customer);
    }

    gohome(){
      this.nav.parent.select(0);
  }

  getCart() {
    this.nav.parent.select(2);
  }


     checkAvatar() {
       return this.service.checkAvatar();
     }
    login() {
      this.nav.setRoot(AccountLogin);
  }
   
}
