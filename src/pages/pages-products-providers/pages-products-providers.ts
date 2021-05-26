import { Component } from '@angular/core';
import { NavController, NavParams,PopoverController } from 'ionic-angular';
import {Service} from '../../providers/service/service';
import { CategoryService } from '../../providers/service/category-service'
import { Values } from '../../providers/service/values'
import { Functions } from '../../providers/service/functions'
import { CartPage } from '../cart/cart'
import { ProductPage } from '../product/product'
import { ProductsPage } from '../products/products';
import { NewProductPage } from '../new-product/new-product';
/**
 * Generated class for the PagesProductsProvidersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-pages-products-providers',
  templateUrl: 'pages-products-providers.html',
})
export class PagesProductsProvidersPage {

  products: any
  productsIdsVendor: any
  moreProducts: any
  count: any
  offset: any
  category: any
  filters: any
  has_more_items: boolean = true
  listview: boolean = false
  status: any
  options: any
  pop: any
  categories: any
  subCategories: any
  items: any
  quantity: any
  filter: any
  q: any
  shouldShowCancel: boolean = true
  showFilters: boolean = false
  data: any
  sort: number = 0
  categoryName: any
  constructor(
    public nav: NavController,
    public popoverCtrl: PopoverController,
    public service: CategoryService,
    params: NavParams,
    public values: Values,
    public functions: Functions,
  ) {
    this.data = {}
    this.filter = {}
    this.q = ''

    if (params.data.slug != '') {
      this.filter['filter[category]'] = params.data.slug
      this.filter.id = params.data.id
    }

    if(params.data.productslocation != ''){
        this.filter['include'] = params.data.productslocation
    }


    this.categoryName = params.data.name
    this.filter.page = 1
    this.count = 10
    this.offset = 0
    this.values.filter = {}
    this.options = []
    this.subCategories = []
    this.items = []
    this.quantity = '1'
    this.subCategories = params.data.categories


  }

  ionViewDidEnter() {
    this.service.getProductsByIdVendor()
    .then((resultsByVendor) => this.handleProdInit(resultsByVendor));
  }

  handleProdInit(resultsByVendor) {
    this.filter['include'] = resultsByVendor.toString()
    console.log(this.filter)
    this.service.load(this.filter).then(results => {
      this.products = results
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

  getCategory(id, slug, name) {
    this.items.id = id
    this.items.slug = slug
    this.items.name = name
    this.items.categories = this.categories
    this.nav.push(ProductsPage, this.items)
  }
  parseText(id, count, offset, obj2) {
    var text = '{'
    text += '"category' + '":"' + id + '"}'
    var obj1 = JSON.parse(text)
    var obj3 = {}
    for (var attrname in obj1) {
      obj3[attrname] = obj1[attrname]
    }
    for (attrname in obj2) {
      obj3[attrname] = obj2[attrname]
    }
    return obj3
  }
  getProducts(item) {
    this.nav.push(ProductsPage, item)
  }
  getProduct(id) {
    this.nav.push(ProductPage, id)
  }
  getProductForANewProduct(id) {
    this.nav.push(NewProductPage, id)
  }
  getCart() {
    this.nav.push(CartPage)
  }
  doInfinite(infiniteScroll) {
    this.filter.page += 1
    this.service
      .loadMore(this.filter)
      .then(results => this.handleMore(results, infiniteScroll))
  }
  handleMore(results, infiniteScroll) {
    if (results != undefined) {
      for (var i = 0; i < results.length; i++) {
        this.products.push(results[i])
      }
    }
    console.log('resultados', results)

    if (results.length == 0) {
      this.has_more_items = false
    }
    infiniteScroll.complete()
  }
  setListView() {
    this.values.listview = true
  }
  setGridView() {
    this.values.listview = false
  }
  deleteFromCart(id) {
    this.service.deleteFromCart(id).then(results => (this.status = results))
  }
  updateToCart(id) {
    this.service.updateToCart(id).then(results => (this.status = results))
  }
  addToCart(id, type) {
    if (type == 'variable') {
      this.nav.push(ProductPage, id)
    } else {
      var text = '{'
      var i
      for (i = 0; i < this.options.length; i++) {
        var res = this.options[i].split(':')
        text += '"' + res[0] + '":"' + res[1] + '",'
      }
      text += '"product_id":"' + id + '",'
      text += '"quantity":"' + this.quantity + '"}'
      var obj = JSON.parse(text)
      this.service.addToCart(obj).then(results => this.updateCart(results))
    }
  }
  updateCart(a) { }
  onInput($event) {
    this.filter['filter[q]'] = $event.srcElement.value
    console.log(this.filter['filter[q]'])
    this.service.search(this.filter).then(results => (this.products = results))
  }
  onCancel($event) {
    console.log('cancelled')
  }
  getFilter() {
    this.showFilters = true
    this.has_more_items = false
  }
  cancel() {
    this.showFilters = false
    this.has_more_items = true
  }
  chnageFilter(sort) {
    this.showFilters = false
    this.has_more_items = true
    this.filter.page = 1
    // if (sort == 0) {
    //   this.filter['filter[order]'] = 'ASC'
    //   this.filter['filter[orderby]'] = 'date'
    // }
    // if (sort == 1) {
    //   this.filter['filter[order]'] = 'ASC'
    //   this.filter['filter[orderby]'] = 'name'
    // } else if (sort == 2) {
    //   this.filter['filter[order]'] = 'DESC'
    //   this.filter['filter[orderby]'] = 'name'
    // } else if (sort == 3) {
    //   this.filter['filter[order]'] = 'ASC'
    //   this.filter['filter[orderby]'] = 'meta_value_num'
    //   this.filter['filter[orderby_meta_key]'] = '_price'
    // } else if (sort == 4) {
    //   this.filter['filter[order]'] = 'DESC'
    //   this.filter['filter[orderby]'] = 'meta_value_num'
    //   this.filter['filter[orderby_meta_key]'] = '_price'
    // }
    // FILTROS SHIT EN FUNCION
    if (sort == 5) {
      this.filter['orderby'] = 'menu_order'
    }
    else if (sort == 6) {
      this.filter['orderby'] = 'popularity'
    }
    else if (sort == 7) {
      this.filter['orderby'] = 'rating'
    }
    else if (sort == 8) {
      this.filter['orderby'] = 'date'
      this.filter['order'] = 'asc'
    }
    else if (sort == 9) {
      this.filter['orderby'] = 'date'
      this.filter['order'] = 'desc'
    }
    else if (sort == 10) {
      this.filter['orderby'] = 'price'
      this.filter['order'] = 'asc'
    }
    else if (sort == 11) {
      this.filter['orderby'] = 'price'
      this.filter['order'] = 'desc'
    }
    else if (sort == 12) {
      this.filter['orderby'] = 'title'
      this.filter['order'] = 'asc'
    }
    else if (sort == 13) {
      this.filter['orderby'] = 'title'
      this.filter['order'] = 'desc'
    }

    /*this.filter['filter[meta_query][key]'] = "_price";
        this.filter['filter[meta_query][value]'] = '[0,10]';
        this.filter['filter[meta_query][compare]'] = "BETWEEN";*/
    this.service.load(this.filter).then(results => (this.products = results))
  }
  addToWishlist(id) {
    if (this.values.isLoggedIn) {
      this.values.wishlistId[id] = true
      this.service.addToWishlist(id).then(results => this.update(results, id))
    } else {
      this.functions.showAlert(
        'Warning',
        'You must login to add product to wishlist',
      )
    }
  }
  update(results, id) {
    if (results.success == 'Success') {
      //this.functions.showAlert(a.success, a.message);
      this.values.wishlistId[id] = true
    } else {
    }
  }
  removeFromWishlist(id) {
    this.values.wishlistId[id] = false
    this.service.deleteItem(id).then(results => this.updateWish(results, id))
  }
  updateWish(results, id) {
    if (results.status == 'success') {
      this.values.wishlistId[id] = false
    }
  }

  newProduct(){
    this.nav.push(NewProductPage);
  }

  gohome(){
    this.nav.parent.select(0);
  }

}
