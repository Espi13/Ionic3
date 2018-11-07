import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { CategoryModel } from '../../shared/category-model';
import { CategoryServiceProvider } from '../../shared/category-service';
import { ProductsPage } from '../products/products';

/**
 * Generated class for the CategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
  providers: [Storage],
})
export class CategoriesPage {

  public selectedCategory: CategoryModel = null;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public categoryService: CategoryServiceProvider,
              private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {

    this.clearSelectedCategory();
  }
  clearSelectedCategory(){
    this.selectedCategory = null;
  }
  selectCategory(category:CategoryModel){
    if(this.selectedCategory == category){
       this.clearSelectedCategory();
    }
    else {
      this.selectedCategory = category;
    }
  }
  addNewCategory(name: string, imageUrl:string){
    let loader = this.loadingCtrl.create();
    loader.present();
    this.categoryService.addCategory(name,imageUrl)
    .subscribe( category => {
      this.goToCategory(category);
      loader.dismiss();
    },
    error => {loader.dismiss()})
  }

  goToCategory(category:CategoryModel){
    this.navCtrl.push(ProductsPage, {category});
  }
  showAddCategory(){
    let addCategoryAlert = this.alertCtrl.create({
      title: 'New Category',
      message: "Give a name to the category",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        },
        {
          name: 'image',
          placeholder: 'Url image',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {}
        },
        {
          text: 'Add',
          handler: data => {
            let navTransition  = addCategoryAlert.dismiss();
            navTransition.then(() => {this.addNewCategory(data.name, data.image);})
            return false;
          }
        }
      ]
    });
    addCategoryAlert.present();
  }
  removeSelectedCategory(){
    this.categoryService.removeCategory(this.selectedCategory);
    this.selectedCategory = null;
  }
}
