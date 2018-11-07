import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartServiceProvider } from '../../shared/cart-service';
import { ProductModel } from '../../shared/product-model';

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public cartService: CartServiceProvider) {

  } 

  getTotal () {
    return this.cartService.cartProducts.reduce((accumulator, { price }) => accumulator + price, 0);
  }
  ionViewDidLoad() {
  }
  removeCartProduct(cartProduct:ProductModel){
    this.cartService.removeCartProduct(cartProduct);
  }
}
