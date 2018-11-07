import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, IonicPageModule } from 'ionic-angular';

import { MyApp } from './app.component';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CategoriesPage } from '../pages/categories/categories';
import { CategoryServiceProvider } from '../shared/category-service';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { ProductServiceProvider } from '../shared/product-service';
import { ProductsPage } from '../pages/products/products';
import { AddProductModalPage } from '../pages/add-product-modal/add-product-modal';
import { PipesModule } from '../pipes/pipes.module';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { CartPage } from '../pages/cart/cart';
import { CartServiceProvider } from '../shared/cart-service';


@NgModule({
  declarations: [
    MyApp,
    CategoriesPage,
    ProductsPage,
    AddProductModalPage,
    ContactUsPage,
    CartPage
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot(),
    PipesModule,
    IonicPageModule.forChild(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CategoriesPage,
    ProductsPage,
    AddProductModalPage,
    ContactUsPage,
    CartPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CategoryServiceProvider,
    ProductServiceProvider,
    CartServiceProvider
    
  ]
})
export class AppModule {}
