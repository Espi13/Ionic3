import { Pipe, PipeTransform } from '@angular/core';
import { ProductModel } from '../../shared/product-model';

/**
 * Generated class for the OfferProductsPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'offerProductsPipe',
})
export class OfferProductsPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(products: ProductModel[]) {
    return products.sort((a,b) =>(b.inOffer && !a.inOffer) ? 1 : -1);
  }
}
