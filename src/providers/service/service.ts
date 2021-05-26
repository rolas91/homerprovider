import { Injectable } from '@angular/core'
import { Http, RequestOptions } from '@angular/http'
import { LoadingController } from 'ionic-angular'
import { Config } from './config'
import { Values } from './values';
import { URLSearchParams } from '@angular/http'
import { NativeStorage } from '@ionic-native/native-storage'
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/forkJoin'
import { HTTP } from '@ionic-native/http'
import { Functions } from '../../providers/service/functions'
import { ProductsPage } from '../../pages/products/products'
import { AccountLogin } from '../../pages/account/login/login'
import { AccountForgotten } from '../../pages/account/forgotten/forgotten'



@Injectable()
export class Service {

  header:any = new Headers();
  cartDataMembership: any;
  data: any
  categories: any
  banners: any
  orders: any
  order: any
  isloggedIn: any
  status: any
  address: any
  products: any
  products_membership: any
  product: any
  cart: any
  configuration: any
  loader: any
  loginStatus: any
  mainCategories: any
  country: any
  user: any
  login_nonce: any
  dir: any = 'left'
  filter: any = {}
  has_more_items: boolean = true
  blocks: any = []
  customer: any
  dataSearchProduct: any = []
  includeProduct: any
  constructor(
    private reqhttp: HTTP,
    private http: Http,
    private config: Config,
    private values: Values,
    public loadingCtrl: LoadingController,
    private nativeStorage: NativeStorage,
    public functions: Functions,
  ) {
    this.mainCategories = []
    this.filter.page = 1
  }
  load() {
    return new Promise(resolve => {
      this.http
        .get(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-keys')
        .map(res => res.json())
        .subscribe(data => {
          this.values.data = data
          this.values.settings = data.settings
          this.blocks = data.blocks
          for (let item in this.blocks) {
            var filter
            if (this.blocks[item].block_type == 'product_block') {
              if (this.blocks[item].filter_by == 'tag')
                filter = { tag: this.blocks[item].link_id, status: 'publish' }
              else
                filter = {
                  category: this.blocks[item].link_id,
                  status: 'publish',
                }
              this.http
                .get(
                  this.config.setUrl(
                    'GET',
                    '/wp-json/wc/v2/products/?',
                    filter,
                  ),
                )
                .map(res => res.json())
                .subscribe(data => {
                  this.blocks[item].products = data
                })
            }
            if (this.blocks[item].block_type == 'flash_sale_block') {
              if (this.blocks[item].filter_by == 'tag')
                filter = { tag: this.blocks[item].link_id, status: 'publish' }
              else
                filter = {
                  category: this.blocks[item].link_id,
                  status: 'publish',
                }
              this.http
                .get(
                  this.config.setUrl(
                    'GET',
                    '/wp-json/wc/v2/products/?',
                    filter,
                  ),
                )
                .map(res => res.json())
                .subscribe(data => {
                  this.blocks[item].products = data
                })
              this.blocks[item].interval = setInterval(() => {
                var countDownDate = new Date(
                  this.blocks[item].sale_ends,
                ).getTime()
                var now = new Date().getTime()
                var distance = countDownDate - now
                this.blocks[item].days = Math.floor(
                  distance / (1000 * 60 * 60 * 24),
                )
                this.blocks[item].hours = Math.floor(
                  (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
                )
                this.blocks[item].minutes = Math.floor(
                  (distance % (1000 * 60 * 60)) / (1000 * 60),
                )
                this.blocks[item].seconds = Math.floor(
                  (distance % (1000 * 60)) / 1000,
                )
                if (distance < 0) {
                  clearInterval(this.blocks[item].interval)
                  this.blocks[item].hide = true
                }
              }, 1000)
            }
          }
          this.values.currency = data.currency
          this.login_nonce = data.login_nonce
          if (data.user && data.user.data != undefined) {
            this.values.isLoggedIn = data.user.data.status
            this.values.customerId = data.user.data.ID
            this.values.customerName = data.user.data.display_name
            //this.values.avatar = data.user.data.avatar_url;
            this.values.logoutUrl = this.encodeUrl(data.user.data.url)
            this.nativeStorage.getItem('loginData').then(
              data => {
                if (data.type == 'social') {
                  this.values.customerName = data.displayName
                  //this.values.avatar = data.avatar;
                }
              },
              error => console.error(error),
            )
          } else {
            this.nativeStorage.getItem('loginData').then(
              data => {
                if (data.type == 'woo') {
                  this.login(data)
                } else if (data.type == 'social') {
                  this.values.customerName = data.displayName
                }
              },
              error => console.error(error),
            )
          }
          this.nativeStorage.setItem('blocks', data).then(
            data => console.log('Saved'),
            error => console.error(error),
          )
          this.getCategories(1)
          this.nativeStorage.getItem('loginData').then(
            data => this.login(data),
            error => console.error(error),
          )
          this.http
            .get(
              this.config.url +
              '/wp-admin/admin-ajax.php?action=mstoreapp-cart',
            )
            .map(res => res.json())
            .subscribe(data => {
              this.cart = data
              this.values.cartNonce = data.cart_nonce
              this.values.updateCart(this.cart)
            })
          resolve(true)
        })
    })
  }
  getCategories(page) {
    this.http
      .get(
        this.config.setUrl('GET', '/wp-json/wc/v2/products/categories?', {
          per_page: 100,
          page: page,
        }),
      )
      .map(res => res.json())
      .subscribe(data => {
        if (page == 1) this.categories = data
        else {
          this.categories.push.apply(this.categories, data)
        }
        if (data.length == 100) this.getCategories(page + 1)
        else {
          this.categories = this.categories.filter(
            item => item.name !== 'Uncategorized',
          )
          this.mainCategories = this.categories.filter(
            item => item.parent === 0,
          )
          this.nativeStorage.setItem('categories', this.categories).then(
            data => console.log('Saved'),
            error => console.error(error),
          )
        }
      })
  }
  getNonce() {
    return new Promise(resolve => {
      this.http
        .get(
          this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-nonce',
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        })
    })
  }
  getNonceResendKey(username) {
    var params = new URLSearchParams()
    params.append('username', username)
    return new Promise(resolve => {
      this.http
        .get(
          this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-nonce&' + params,
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        })
    })
  }

  updateProduct(data, product){
    this.header.append('Content-Type', 'application/json');
    this.http
    .put(
      this.config.url + '/wp-json/wc-bookings/v1/products/'+product+'?consumer_key=ck_462b7613b1f89991924e149f7d7df2a1c37eb71a&consumer_secret=cs_81a58277089318569168ff48defefa83fa740d86',
      {
        'name' : data.name,
        'description' : data.description,
        'short_description':data.short_description,
        'cost' : data.cost,
        'block_cost' : data.block_cost,
        'display_cost' : data.display_cost,
        'availability': data.availability,
        'categories' : data.categories
      },
      this.header
    )
    .map(res => res.json())
    .subscribe(
      data => {
        console.log('Actualizado',data);
      });
  }

  addProduct(data){
    this.header.append('Content-Type', 'application/json');
    this.http
    .post(
      this.config.url + '/wp-json/wc-bookings/v1/products?consumer_key=ck_462b7613b1f89991924e149f7d7df2a1c37eb71a&consumer_secret=cs_81a58277089318569168ff48defefa83fa740d86',
      {
        'name':data.name,
        'slug': data.slug,
        'status': data.status,
        'featured': data.featured,
        'catalog_visibility': data.catalog_visibility,
        'description': data.description,
        'short_description': data.short_description,
        'sku': data.sku,
        'price': data.price,
        'sale_price': data.sale_price,
        'date_on_sale_from': data.date_on_sale_from,
        'date_on_sale_from_gmt': data.date_on_sale_from_gmt,
        'date_on_sale_to': data.date_on_sale_to,
        'date_on_sale_to_gmt': data.date_on_sale_to_gmt,
        'price_html': data.price_htm,
        'on_sale': data.on_sale,
        'purchasable': data.purchasable,
        'virtual': data.virtual,
        'downloadable':data.downloadabl,
        'downloads': data.downloads,
        'download_limit': data.download_limit,
        'download_expiry': data.download_expiry,
        'external_url': data.external_url,
        'button_text': data.button_text,
        'tax_status': data.tax_status,
        'tax_class': data.tax_class,
        'manage_stock': data.manage_stock,
        'stock_quantity': data.stock_quantity,
        'stock_status': data.stock_status,
        'backorders': data.backorders,
        'backorders_allowed':data.backorders_allowed,
        'backordered': data.backordered,
        'sold_individually': data.sold_individually,
        'weight': data.weight,
        'shipping_required': data.shipping_required,
        'shipping_taxable': data.shipping_taxable,
        'shipping_class': data.shipping_class,
        'shipping_class_id': data.shipping_class_id,
        'reviews_allowed': data.reviews_allowed,
        'average_rating': data.average_rating,
        'rating_count': data.rating_count,
        'upsell_ids': data.upsell_ids,
        'cross_sell_ids': data.cross_sell_ids,
        'parent_id': data.parent_id,
        'purchase_note': data.purchase_note,
        'categories': data.categories,
        'tags': data.tags,
        'images': data.images,
        'attributes': data.attributes,
        'default_attributes': data.default_attributes,
        'variations': data.variations,
        'grouped_products': data.grouped_products,
        'menu_order': data.menu_order,
        'apply_adjacent_buffer': data.apply_adjacent_buffer,
        'availability': data.availability,
        'block_cost': data.block_cost,
        'buffer_period': data.buffer_period,
        'calendar_display_mode': data.calendar_display_mode,
        'cancel_limit_unit': data.cancel_limit_unit,
        'cancel_limit':data.cancel_limit,
        'check_start_block_only': data.check_start_block_only,
        'cost': data.cost,
        'display_cost': data.display_cost,
        'duration_type': data.duration_type,
        'duration_unit': data.duration_unit,
        'duration': data.duration,
        'enable_range_picker': data.enable_range_picker,
        'first_block_time':data.first_block_time,
        'has_person_cost_multiplier': data.has_person_cost_multiplier,
        'has_person_qty_multiplier': data.has_person_qty_multiplier,
        'has_person_types': data.has_person_types,
        'has_persons': data.has_persons,
        'has_resources': data.has_resources,
        'max_date_value': data.max_date_value,
        'max_date_unit': data.max_date_unit,
        'max_duration': data.max_duration,
        'max_persons': data.max_persons,
        'min_date_value': data.min_date_value,
        'min_date_unit': data.min_date_unit,
        'min_duration': data.min_duration,
        'min_persons': data.min_person,
        'person_types':data.person_types,
        'pricing':data.pricing,
        'qty': data.qty,
        'requires_confirmation': data.requires_confirmation,
        'resource_label': data.resource_label,
        'resources_assignment': data.resources_assignment,
        'restricted_days': data.restricted_days,
        'can_be_cancelled': data.can_be_cancelled,
        'user_can_cancel': data.user_can_cancel
      },
      this.header
    )
    .map(res => res.json())
    .subscribe(
      data => {
        this.updateProductWithVendor(data.id)
        console.log(data);
      });
  }

  getMessage(data){
    return new Promise(resolve => {
      this.header.append('Content-Type', 'application/json');
      this.http
      .post(
        this.config.urlApi + '/message/getmessages',
        {
          'roomName': data.roomName
        },
        this.header
      )
      .map(res => res.json())
      .subscribe(
        data => {
          resolve(data);
        });
    })
  }

  updateProductWithVendor(post_id){
    let params = {
      vendor: this.values.customerId,
      post_id: post_id
    }

      this.http
          .put(
            this.config.url + '/wp-admin/admin-ajax.php?vendor='+this.values.customerId+'&post_id='+post_id+'&action=mstoreapp-update_product_author',
            params,
            this.header
          ).subscribe();
  }


  login(loginData) {
    var params = new URLSearchParams()
    params.append('username', loginData.username)
    params.append('password', encodeURIComponent(loginData.password))
    // params.append});('_wpnonce', this.login_nonce)
    // params.append('login', 'Login')
     params.append(
       'redirect',
       this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-userdata',
     )
    return new Promise(resolve => {
      this.http
        .post(
          this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-login-vendor',
          params,
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(
          data => {
            console.log(data)
            if (!data.errors) {
              this.values.isLoggedIn = data.data.status
              this.values.customerName = data.data.display_name
              this.values.customerId = data.data.ID
              this.values.logoutUrl = this.encodeUrl(data.data.url)
              this.values.user_login = data.data.user_login
              console.log(data.data)
              this.values.vendor = data.allcaps.vendor
              this.values.subscription = data.data.subscription
              console.log(this.values.subscription)
              params = new URLSearchParams()
              params.append('customer_id', this.values.customerId.toString())
              this.http
                .post(
                  this.config.url +
                  '/wp-admin/admin-ajax.php?action=mstoreapp-get_wishlist',
                  params,
                  this.config.options,
                )
                .map(res => res.json())
                .subscribe(data => {
                  for (let item in data) {
                    this.values.wishlistId[data[item].id] = data[item].id
                  }
                })
              params = new URLSearchParams()
              params.append('customer_id', this.values.customerId.toString())
              this.http
                .post(
                  this.config.url +
                  '/wp-admin/admin-ajax.php?action=mstoreapp-get_wishlist',
                  params,
                  this.config.options,
                )
                .map(res => res.json())
                .subscribe(data => {
                  console.log(data)
                })
              this.nativeStorage
                .setItem('loginData', {
                  username: loginData.username,
                  password: loginData.password,
                })
                .then(
                  data => console.log('Login Details Stored'),
                  error => console.error(error),
                )
            }
            resolve(data)
          },
          err => {
            resolve(JSON.parse(err._body))
          },
        )
    })
  }
  encodeUrl(href) {
    return href.replace(/&amp;/g, '&')
  }
  logout() {
    return new Promise(resolve => {
      this.http
        .get(
          this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-logout',
          // this.values.logoutUrl + '&redirect_to=http://localhost:8100',
          this.config.options,
        )
        .subscribe(data => {
          console.log('prueba')
          this.values.isLoggedIn = false
          this.values.customerName = ''
          this.nativeStorage.setItem('loginData', {}).then(
            data => console.log('Login Data cleared'),
            error => console.error(error),
          )
          this.http
            .get(
              this.config.url +
              '/wp-admin/admin-ajax.php?action=mstoreapp-cart',
              this.config.options,
            )
            .map(res => res.json())
            .subscribe(data => {
              this.cart = data
              this.values.updateCart(this.cart)
            })
          resolve(this.cart)
        })
    })
  }
  passwordreset(email, nonce, url) {
    var params = new URLSearchParams()
    params.append('user_login', email)
    params.append('wc_reset_password', 'true')
    params.append('_wpnonce', nonce)
    params.append('_wp_http_referer', '/my-account/lost-password/')
    return new Promise(resolve => {
      this.http
        .post(this.config.url + '/my-account/lost-password/', params)
        .subscribe(status => {
          resolve(status)
        })
    })
  }
  passwordResetNonce() {
    return new Promise(resolve => {
      this.http
        .get(
          this.config.url +
          '/wp-admin/admin-ajax.php?action=mstoreapp-passwordreset',
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        })
    })
  }
  resendKey(usernameKey, nonceKey) {
    console.log(nonceKey);
    return new Promise(resolve => {
      this.http
        .get(
          this.config.url +
          '/my-account/?action=resend_key&user_login=' + usernameKey + '&nonce=' + nonceKey + '',
        )
        .map(res => res)
        .subscribe(data => {
          resolve(data)
          if (data.statusText == "OK"){
            this.functions.showAlert("ÉXITO", "Verifique el correo electrónico para ver si hay un nuevo enlace de verificación");
          }
          else
            this.functions.showAlert("ERROR", "an error has occurred please check. ");
        })
    })
  }
  getAddress() {
    return new Promise(resolve => {
      this.http
        .get(
          this.config.setUrl(
            'GET',
            '/wc-api/v3/customers/' + this.values.customerId + '?',
            false,
          ),
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(data => {
          this.address = data
          resolve(this.address)
        })
    })
  }
  getCustomer() {
    return new Promise(resolve => {
      this.http
        .get(
          this.config.setUrl(
            'GET',
            '/wc-api/v3/customers/' + this.values.customerId + '?',
            false,
          ),
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(data => {
          this.customer = data
          console.log(this.customer)
          resolve(this.customer)
        })
    })
  }
  checkAvatar() {
    let result = ''
    if (this.values.customerId != null) {
      if (
        this.customer.customer.avatar_url.indexOf(
          '8ab2424adb5aafd0f6fc73775cd77668',
        ) != -1
      ) {
        result = 'avatar'
      } else if (
        this.customer.customer.avatar_url.indexOf(
          '8ab2424adb5aafd0f6fc73775cd77668',
        ) == -1
      ) {
        result = 'image'
      }
    } else result = 'false'
    return result
  }
  saveAddress(address) {
    var params = {
      customer: address,
    }
    this.reqhttp.setHeader(
      this.config.url,
      'Content-Type',
      'application/json; charset=UTF-8',
    )
    this.reqhttp.setDataSerializer('json')
    this.reqhttp.clearCookies()
    return new Promise(resolve => {
      this.reqhttp
        .put(
          this.config.setUrl(
            'PUT',
            '/wc-api/v3/customers/' + this.values.customerId + '?',
            false,
          ),
          params,
          {},
        )
        .then(data => {
          resolve(JSON.parse(data.data))
        })
    })
  }
  pushNotification(notification) {
    var params = new URLSearchParams()
    params.append('device_id', notification.device_id)
    params.append('platform', notification.platform)
    params.append('email', notification.email)
    params.append('city', notification.city)
    params.append('state', notification.state)
    params.append('country', notification.country)
    params.append('pincode', notification.pincode)
    return new Promise(resolve => {
      this.http
        .post(
          this.config.url +
          '/wp-admin/admin-ajax.php?action=mstoreapp-user-subcribe-notify',
          params,
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(data => {
          this.status = data
          resolve(this.status)
        })
    })
  }
  pushNotify(deviceId, platform) {
    var params = new URLSearchParams()
    params.append('device_id', deviceId)
    params.append('platform', platform)
    return new Promise(resolve => {
      this.http
        .post(
          this.config.url +
          '/wp-admin/admin-ajax.php?action=mstoreapp-user-subcribe-notify',
          params,
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(data => {
          this.status = data
          resolve(this.status)
        })
    })
  }
  getOrder(id) {
    return new Promise(resolve => {
      this.http
        .get(
          this.config.setUrl('GET', '/wc-api/v3/orders/' + id + '?', false),
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(data => {
          this.order = data
          resolve(this.order)
        })
    })
  }
  getBooking(idOrder, idVendor) {
    return new Promise(resolve => {
      this.http
        .get(
          this.config.setUrl('GET', '/wp-json/custom-api/v1/get_vendor_order?id_vendor=' + idVendor + '&id=' + idOrder + '&', false),
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(data => {
          this.order = data
          resolve(this.order)
        })
    })
  }
  getCountry() {
    return new Promise(resolve => {
      this.http
        .get(
          this.config.url +
          '/wp-admin/admin-ajax.php?action=mstoreapp-get_country',
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(data => {
          this.country = data
          resolve(this.country)
        })
    })
  }
  registerCustomer(customer) {
    var params = {
      customer: customer,
    }
    return new Promise(resolve => {
      this.http
        .post(
          this.config.setUrl('POST', '/wc-api/v3/customers?', false),
          params,
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(
          data => {
            this.user = data
            resolve(this.user)
          },
          err => {
            resolve(err.json())
          },
        )
    })
  }
  registerVendor(vendor) {
    var params = new URLSearchParams();
      params.append("email", vendor.email);
      params.append("password", vendor.password);
      params.append("first_name", vendor.first_name);
      params.append("last_name", vendor.last_name);
      params.append("phone", vendor.phone);
    return new Promise(resolve => {
      this.http
        .post(
          // this.config.setUrl('POST', '/wp-admin/admin-ajax.php?action=mstoreapp-create-user-vendor', false),
          // params,
          this.config.url +
                '/wp-admin/admin-ajax.php?action=mstoreapp-create-user-vendor',
              params,
        )
        .map(res => res.json())
        .subscribe(
          data => {
            this.user = data
            resolve(this.user)
          },
          err => {
            resolve(err.json())
          },
        )
    })
  }

  getOrders(filter) {
    return new Promise(resolve => {
      this.http
        .get(
          this.config.setUrl('GET', '/wc-api/v3/orders?', filter),
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(data => {
          this.orders = data
          resolve(this.orders)
        })
    })
  }
  getOrdersVendor(filter) {
    return new Promise(resolve => {
      this.http
        .get(
          this.config.setUrl('GET', '/wp-json/custom-api/v1/get_vendor_orders?', filter),
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(data => {
          this.orders = data
          resolve(this.orders)
        })
    })
  }
  getBookingsVendor(filter) {
    return new Promise(resolve => {
      this.http
        .get(
          this.config.setUrl('GET', '/wp-json/custom-api/v1/get_vendor_orders?', filter),
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(data => {
          this.orders = data
          resolve(this.orders)
        })
    })
  }
  updateOrder(data, id) {
    this.reqhttp.setHeader(
      this.config.url,
      'Content-Type',
      'application/json; charset=UTF-8',
    )
    this.reqhttp.setDataSerializer('json')
    this.reqhttp.clearCookies()
    return new Promise(resolve => {
      this.reqhttp
        .put(
          this.config.setUrl('PUT', '/wc-api/v3/orders/' + id + '?', false),
          data,
          {},
        )
        .then(
          data => {
            this.status = JSON.parse(data.data)
            resolve(this.status)
          },
          err => {
            console.log(JSON.parse(err.error))
            resolve(JSON.parse(err.error))
          },
        )
    })
  }
  presentLoading(text) {
    this.loader = this.loadingCtrl.create({
      content: text,
    })
    this.loader.present()
  }
  dismissLoading() {
    this.loader.dismiss()
  }
  getPage(id: any) {
    var params = new URLSearchParams()
    params.append('page_id', id)
    return new Promise(resolve => {
      this.http
        .post(
          this.config.url +
          '/wp-admin/admin-ajax.php?action=mstoreapp-page_content',
          params,
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        })
    })
  }
  getProducts() {
    this.http
      .get(
        this.config.setUrl('GET', '/wp-json/wc-bookings/v1/products?', false),
        this.config.options,
      )
      .map(res => res.json())
      .subscribe(data => {
        this.products = data

        for (let index = 0; index < this.products.length; index++) {
          const element = this.products[index]
          let resources = element.resource_block_costs
          let prices = new Array()
          for (var key in resources) {
            prices = [...prices, resources[key]]
          }
          if (Object.keys(resources).length) {
            let minPrice = Math.min(...prices)
            this.products.map(function (element) {
              return (element.minPrice = minPrice)
            })
          }
        }
      })
  }
  getProductsMembership() {
    this.http
      .get(
        this.config.setUrl('GET', '/wc-api/v3/products?type=wcvm-membership&', false),
        this.config.options,
      )
      .map(res => res.json())
      .subscribe(data => {
        this.products_membership = data.products

        // for (let index = 0; index < this.products_membership.length; index++) {
        //   const element = this.products_membership[index]
        //   let resources = element.resource_block_costs
        //   let prices = new Array()
        //   for (var key in resources) {
        //     prices = [...prices, resources[key]]
        //   }
        //   if (Object.keys(resources).length) {
        //     let minPrice = Math.min(...prices)
        //     this.products_membership.map(function (element) {
        //       return (element.minPrice = minPrice)
        //     })
        //   }
        // }
      })
  }
  addToCartMembership(id){
    var params = new URLSearchParams();
      // params.append("quantity", "1");
      params.append("add-to-cart", id);
      params.append("is-membership", "yes");
        return new Promise(resolve => {
                  //  this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-add_to_cart', params, this.config.options).map(res => res.json())
                  this.http.get(this.config.url + '/checkout/?'+params, this.config.options).map(res => res.json())
                .subscribe(data => {
                  console.log(data)
                    this.cartDataMembership = data;
                    this.values.cartNonce = data.cart_nonce;
                    this.values.updateCartTwo(data.cart);
                    resolve(this.cartDataMembership);
            });
        });
  }
  testApiLogin(){
    var params = new URLSearchParams();
      // params.append("quantity", "1");

      params.append("username", "bonod49459");
      params.append("productid", "5138");
        return new Promise(resolve => {
                  //  this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-add_to_cart', params, this.config.options).map(res => res.json())
                  this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-autoLogin', params, this.config.options).map(res => res.json())
                  //this.http.get(this.config.url + '/checkout/?'+params, this.config.options).map(res => res.json())
                .subscribe(data => {
                  console.log(data)
                    // this.cartDataMembership = data;
                    // this.values.cartNonce = data.cart_nonce;
                    // this.values.updateCartTwo(data.cart);
                    // resolve(this.cartDataMembership);
            });
        });
  }
  loadMore() {
    this.filter.page += 1
    return new Promise(resolve => {
      this.http
        .get(
          this.config.setUrl(
            'GET',
            '/wp-json/wc-bookings/v1/products?',
            this.filter,
          ),
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(data => {
          this.handleMore(data)
          resolve(true)
        })
    })
  }
  loadMoreProvider(filter) {
    return new Promise(resolve => {
      this.http
        .get(
          this.config.setUrl(
            'GET',
            '/wp-json/wc-bookings/v1/products?',
            filter,
          ),
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(data => {
          this.handleMore(data)
          resolve(true)
        })
    })
  }
  handleMore(results) {
    console.log(results.length)
    // if (results.products == undefined) {
    //   console.log('No hay mas productos que mostrar...', results.products)
    //   this.has_more_items = false
    //   return
    // }
    if (results != undefined) {
      for (var i = 0; i < results.length; i++) {
        this.products.push(results[i])
      }
    }
    if (results.length == 0) {
      this.has_more_items = false
    }
  }
  addToWishlist(id) {
    return new Promise(resolve => {
      var params = new URLSearchParams()
      params.append('product_id', id)
      params.append('customer_id', this.values.customerId.toString())
      this.http
        .post(
          this.config.url +
          '/wp-admin/admin-ajax.php?action=mstoreapp-add_wishlist',
          params,
          this.config.options,
        )
        .subscribe(data => {
          this.status = data
          resolve(this.status)
        })
    })
  }
  deleteItem(id) {
    var params = new URLSearchParams()
    params.append('product_id', id)
    params.append('customer_id', this.values.customerId.toString())
    return new Promise(resolve => {
      this.http
        .post(
          this.config.url +
          '/wp-admin/admin-ajax.php?action=mstoreapp-remove_wishlist',
          params,
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        })
    })
  }
  subscribeNotification(data) {
    var params = new URLSearchParams()
    params.append('onesignal_user_id', data.userId)
    params.append('onesignal_push_token', data.pushToken)
    return new Promise(resolve => {
      this.http
        .post(
          this.config.url +
          '/wp-admin/admin-ajax.php?action=mstoreapp-update_user_notification',
          params,
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        })
    })
  }

  getLocationFromProduct(lat, long, radius) {
    var params = new URLSearchParams();
    params.append('latitude', lat);
    params.append('longitude', long);
    params.append('use_radius', 'on');
    params.append('radius', radius);

    return new Promise(resolve => {
      this.http
        .post(
          this.config.url +
          '/wp-admin/admin-ajax.php?action=mstoreapp-geolocation_process',
          params,
          this.config.options,
        )
        .map(res => res.json())
        .subscribe(data => {
          this.status = data

          console.log('data:', this.status.data);

          this.dataSearchProduct = this.status.data;
          this.includeProduct = '';

          if (this.dataSearchProduct === undefined || this.dataSearchProduct.length == 0) {
            this.includeProduct = '0';
          }else{
            for (var key in this.dataSearchProduct) {
              let prices = this.dataSearchProduct[key]
              this.includeProduct += prices.ID + ',';
            }
            this.includeProduct = this.includeProduct.slice(0, -1);
          }

          resolve(this.includeProduct)
        })
    })
  }

  registerProvider(data:any){
    return new Promise(resolve => {
      this.header.append('Content-Type', 'application/json');
      this.http
      .post(
        this.config.urlApi + '/provider/register',
        {
          "id":data.id,
          "lat": data.lat,
          "lng": data.lng,
          "products":data.products,
          "onesignal": data.onesignal
        },
        this.header
      ).map(res => res.json())
      .subscribe(data => {
        resolve(data)
      })
    });

  }

}
