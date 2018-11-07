export class ProductModel{
    constructor(
        public imageUrl: string = "",
        public name: string,
        public price: number = 1,
        public description: string,
        public id: number = 0,
        public categoryId: number,
        public inOffer = false,
        public offerPrice = 0,
    ){}
    static clone (product:ProductModel){
        return new  ProductModel(product.imageUrl, product.name, product.price , product.description, product.id, product.categoryId,product.inOffer, product.offerPrice);
    }
    static fromJson(data:any){
        if(!data.id || !data.name || !data.price || !data.categoryId){
            throw(new Error("Invalid argument: argument structure do not match with model fields"));
        }
        return new  ProductModel(data.imageUrl, data.name, parseInt(data.price, 10) , data.description, data.id, data.categoryId, data.inOffer, data.offerPrice);
    }
}