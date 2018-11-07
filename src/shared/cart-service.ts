import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from './app-settings';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { ProductModel } from './product-model';

@Injectable()
export class CartServiceProvider{
    public cartProducts: ProductModel[] = [];

    constructor(public http: HttpClient,
                public local: Storage){
        this.getCartProducts();
        
    }

    private getCartProducts(){
        this.getFromLocal()
            .then(() => { this.getFromServer()},
                  () => { this.getFromServer()});
                 
    }

    public getFromLocal(){
        return this.local.ready().then(() => {
            return this.local.get('cart').then(data => {
              let localCart: ProductModel[] = [];
              if(data){
                for (let cart of data){
                  localCart.push( new ProductModel(cart.imageUrl, cart.name,cart.price,cart.description,cart.id,cart.categoryId,cart.inOffer,cart.offerPrice));
                }
              }
              this.cartProducts = localCart;
            });
          });
    }
    private async getFromServer() {
        this.http.get(`${AppSettings.API_ENDPOINT}/cart`)
                .map((cartProduct: Object[]) => {
                return cartProduct.map( item => ProductModel.fromJson(item));
            })
            .subscribe((result: ProductModel[]) => {
                this.cartProducts = result;
                this.saveLocally();
      },
      error => {console.log("Error loading categories from server")}
    );

        // const result = await fetch(`${AppSettings.API_ENDPOINT}/cart`, { method: 'GET' });
        // const parsedResult = await result.json()
        // const productList = parsedResult.map((item) => ProductModel.fromJson(item))
        // this.cartProducts = productList;
        // this.saveLocally()
    }
    saveLocally(){
        this.local.ready().then(() => {
            this.local.set('cart', this.cartProducts);
        })
    }
    public addCategory(cartProduct: ProductModel){
        let observable =  this.postNewCartProductToServer(cartProduct);
    
        observable.subscribe(
            (cartProduct: any) => {
              this.cartProducts = [...this.cartProducts, cartProduct];
              this.saveLocally();
            },
            error => console.log("Error trying to post a product to the cart", error)
          );
          return observable;
      }
    private postNewCartProductToServer(cartProduct: ProductModel):Observable<ProductModel>{
        let observable = this.http.post(`${AppSettings.API_ENDPOINT}/cart`, {
            description: cartProduct.description,
            name: cartProduct.name,
            imageUrl: cartProduct.imageUrl,
            price: cartProduct.price,
            inOffer: cartProduct.inOffer,
            offerPrice: cartProduct.offerPrice,
            categoryId: cartProduct.categoryId,
        })
        .share()
        .map(cartProduct => ProductModel.fromJson(cartProduct));
        observable.subscribe(() => {},() => {});
        return observable;
    }
    public removeCartProduct(cartProduct:ProductModel){
        this.deleteCartProductFromServer(cartProduct.id).subscribe(
            () => {
                let index = this.cartProducts.indexOf(cartProduct);
                this.cartProducts = [...this.cartProducts.slice(0,index),
                                     ...this.cartProducts.slice(index+1)

                ];
                this.saveLocally();
            },
            error => console.log(`An error ocurred while trying to remove list: ${cartProduct.name}`)
        );
    }
    private deleteCartProductFromServer(id:number){
        let observable = this.http.delete(`${AppSettings.API_ENDPOINT}/cart/${id}`)
        .share();
        return observable;
    }
}