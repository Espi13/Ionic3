import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryModel } from './category-model';
import { Storage } from '@ionic/storage';
import { AppSettings } from './app-settings';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import { Observable } from  'rxjs/Rx';

/*
  Generated class for the CategoryServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CategoryServiceProvider {

  public  categories : CategoryModel [] = [];

  constructor(public http: HttpClient,
              public local: Storage) {
      this.getCategory();
      
  }
  private getCategory(){
    this.getFromLocal()
    .then(() => {this.getFromServer()},
          () => {this.getFromServer()});

  }
  public getFromLocal(){
    return this.local.ready().then(() => {
      return this.local.get('categories').then(data => {
        let localCategory: CategoryModel[] = [];
        if(data){
          for (let category of data){
            localCategory.push( new CategoryModel(category.name, category.id, category.imageUrl));
          }
        }
        this.categories = localCategory;
      });
    });

  }
  private getFromServer(){
    this.http.get(`${AppSettings.API_ENDPOINT}/categories`)
    .map((categories: Object[]) => {
      return categories.map( item => CategoryModel.fromJson(item));
    })
    .subscribe(
      (result: CategoryModel[]) => {
        this.categories = result;
        this.saveLocaly();
      },
      error => {console.log("Error loading categories from server")}
    );

  }
  public addCategory(name:string, imageUrl: string){
    let observable =  this.postNewCategoryToServer(name,imageUrl);

    observable.subscribe((category:CategoryModel) => {
        this.categories = [...this.categories, category];
        this.saveLocaly();
    },
    error => console.log("Error trying  to  post a new list to the server ", + error)
    );
    return observable;
  }
  private postNewCategoryToServer(name, imageUrl): Observable<CategoryModel>{
      let observable = this.http.post(`${AppSettings.API_ENDPOINT}/categories`, {name,imageUrl})
                    .share()
                    .map(category => CategoryModel.fromJson(category));
      observable.subscribe(() => {},() => {});
      return observable;
  }
  public removeCategory(category: CategoryModel){
    this.deleteCategoryFromServer(category.id).subscribe(
      () => {
        let index = this.categories.indexOf(category);
        this.categories = [...this.categories.slice(0,index),
                           ...this.categories.slice(index+1)
                          ];
        this.saveLocaly();
      },
      error => console.log(`An error ocurred while trying to remove list: ${category.name}`)
    );
  }
  private deleteCategoryFromServer(id:number){
    let observable = this.http.delete(`${AppSettings.API_ENDPOINT}/categories/${id}`)
    .share();
    return observable;
  }



  public saveLocaly(){
    this.local.ready().then(() => {
      this.local.set('categories', this.categories);
    })
  }
}
