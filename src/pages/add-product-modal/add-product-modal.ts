import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ProductModel } from '../../shared/product-model';

/**
 * Generated class for the AddProductModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-product-modal',
  templateUrl: 'add-product-modal.html',
})
export class AddProductModalPage {
  public model: ProductModel;
  public title: string = "Add new product"
  public buttonText: string ="Add";
  public checked: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController) {
      if(this.navParams.get('product')){
        this.model = ProductModel.clone(this.navParams.get('product'));
        this.title = "Edit product";
        this.buttonText = "Edit";
      }
    else {
      let categoryId = this.navParams.get('categoryId');
      this.model = new ProductModel ('','',1,'',0,categoryId,false,1);
    
     }
  }

  ionViewDidLoad() {
    
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  submit(){
    this.viewCtrl.dismiss(this.model);
  }
  updateChecked(){
    this.checked = !this.checked
    if(this.checked){
      return true;
    }
    return false;
  }
}
