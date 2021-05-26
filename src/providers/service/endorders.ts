import { Injectable } from '@angular/core'
import { Http } from '@angular/http'
import { LoadingController } from 'ionic-angular'
import { Config } from './config'
import { Values } from './values'
import { URLSearchParams } from '@angular/http'
import 'rxjs/add/operator/map'


@Injectable()
export class EndOrdesService {
  data: any
  header:any = new Headers();
  constructor(

    private http: Http,
    private config: Config,
    private values: Values,
    private loadingController: LoadingController,
  ) {}

  getEndOrders(data){
    return new Promise(resolve => {
      this.header.append('Content-Type', 'application/json');
      this.http
      .post(
        this.config.urlApi + '/orders/endorders',
        {
          "provider": data.provider,
        },
        this.header
      )
      .map(res => res.json())
      .subscribe(data => {
         resolve(data)
      });
    })
  }
}
