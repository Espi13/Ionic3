import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, ToastController } from 'ionic-angular';
import { ProductServiceProvider } from '../../shared/product-service';
import { ProductModel } from '../../shared/product-model';
import { AddProductModalPage } from '../add-product-modal/add-product-modal';
import { CategoryModel } from '../../shared/category-model';
import { CartServiceProvider } from '../../shared/cart-service';

/**
 * Generated class for the ProductsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'products'
})
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {

  private category: CategoryModel;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public productService : ProductServiceProvider,
              private loadingCtrl: LoadingController,
              public modalCtrl : ModalController,
              private toastCtrl: ToastController,
              public cartService: CartServiceProvider
              ) {
      this.category = this.navParams.get('category');
      this.productService.loadFromCategory(this.category.id);
  }

  ionViewDidLoad() {  }
  ionViewWillUnload(){
    this.productService.saveLocaly(this.category.id);
  }
  addToCart(product:ProductModel){
    let toast = this.toastCtrl.create({
      message: 'The product '+product.name+' was added to the cart',
      duration: 3000,
      position: 'top'
    });
    toast.present();
    this.cartService.addCategory(product)
    .subscribe(
      () => toast.dismiss(), () => toast.dismiss()
    );
  }
  addProduct(product: ProductModel){
    let loader = this.loadingCtrl.create();
    loader.present();
    this.productService.addProduct(product)
    .subscribe(
      () => loader.dismiss(), () => loader.dismiss());
  }
  updateProduct(originalProduct: ProductModel, modifiedProduct: ProductModel){
    let loader = this.loadingCtrl.create();
    loader.present();
    this.productService.updateProduct(originalProduct, modifiedProduct)
    .subscribe(()=> loader.dismiss(), ()=> loader.dismiss());
  }
  showAddProduct(){
    let modal = this.modalCtrl.create(AddProductModalPage,{categoryId: this.category.id});
    modal.present();
    modal.onDidDismiss(
      data =>{
        if(data){
          this.addProduct(data)
        }
      });
  }
  showEditProduct(product:ProductModel){
    let modal = this.modalCtrl.create(AddProductModalPage,{product});
    modal.present();
    modal.onDidDismiss(data => {
        if(data){
          this.updateProduct(product,data)
        }
    });
  }
  removeTodo(product:ProductModel){
    this.productService.removeProduct(product);
  }
}
