import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddProductModalPage } from './add-product-modal';

@NgModule({
  declarations: [
    AddProductModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddProductModalPage),
  ],
})
export class AddProductModalPageModule {}
