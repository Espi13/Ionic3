import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductModel } from './product-model';
import { AppSettings } from './app-settings';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the ProductServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProductServiceProvider {
  private products: ProductModel[] = [];

  constructor(public http: HttpClient,
              public local: Storage) {
    
  }
  loadFromCategory(id:number){
    this.getFromLocal(id).then( () => {
      this.loadFromServer(id);
    });
  }
  private getFromLocal(id:number){
    return this.local.ready().then(() => {
      return this.local.get(`category/${id}`).then( data => {
        if(!data){
          this.products = [];
          return;
        }
        let localProducts : ProductModel[] = [];
        for (let product of data) {
          localProducts.push(ProductModel.clone(product));
        }
        this.products = localProducts;
      });
    })
  }
  loadFromServer(id:number){
    this.http.get(`${AppSettings.API_ENDPOINT}/categories/${id}/products`)
    .map((products:Object[]) => {
        return products.map(item => ProductModel.fromJson(item));
    })
    .subscribe(
      (result: ProductModel[]) => {
         this.products = result;
         this.saveLocaly(id);
      },
      error => console.log("Error loading list from server", error)
    );
  }
  private postNewProdutToServer(product: ProductModel): Observable<ProductModel> {
    let observable = this.http.post(`${AppSettings.API_ENDPOINT}/categories/${product.categoryId}/products`, {
      description: product.description,
      name: product.name,
      imageUrl: product.imageUrl,
      price : product.price,
      inOffer: product.inOffer,
      offerPrice: product.offerPrice
    })
    .map( product => {
      return  ProductModel.fromJson(product)
    })
    .share();
    return observable;
  }
  private updateProductInServer(product: ProductModel) :Observable<ProductModel> {
    let observable = this.http.put(`${AppSettings.API_ENDPOINT}/products/${product.id}`, {
      description: product.description,
      name: product.name,
      imageUrl: product.imageUrl,
      price : product.price,
      categoryId: product.categoryId,
      inOffer: product.inOffer,
      offerPrice: product.offerPrice
    })
    .map( product => {
        return ProductModel.fromJson(product);
    })
    .share();
    return observable;
  }
  private deleteProductFromServer(id:number){
    let observable = this.http.delete(`${AppSettings.API_ENDPOINT}/products/${id}`)
    .share();
    return observable;
  }

  removeProduct(product: ProductModel){
    this.deleteProductFromServer(product.id).subscribe(
      () => {
        const index = this.products.indexOf(product);
        this.products = [...this.products.slice(0, index),
                         ...this.products.slice(index+1)
                        ];
        this.saveLocaly(product.categoryId);
      },
      error => console.log("An error ocurred while trying to remove  the product: "+ product)
    );
  }
  public saveLocaly(id: number){
      this.local.ready().then(
        () => {
          this.local.set(`category/${id}`, this.products);
        });
  }
  // toggleProduct(product: ProductModel){
  //    let observable = this.postNewProdutToServer(product);
  //    observable.subscribe(
  //      (product: any){

  //      }
  //    )
  // }
  addProduct(product: ProductModel){
    let observable = this.postNewProdutToServer(product);
    observable.subscribe(
      (product: any) => {
        this.products = [...this.products, product];
        this.saveLocaly(product.categoryId);
      },
      error => console.log("Error trying to post a new product", error)
    );
    return observable;
  }
  updateProduct(originalProduct: ProductModel, modifiedProduct: ProductModel):Observable<ProductModel> {
      let observable = this.updateProductInServer(modifiedProduct);
      observable.subscribe(
        (product:ProductModel) => {
          const index = this.products.indexOf(originalProduct);
          this.products = [...this.products.slice(0,index),
                              product,
                           ...this.products.slice(index+1)
                          ];
        },
        error => console.log("Error trying  to update  product item")
      );
      return observable;
  }
}
