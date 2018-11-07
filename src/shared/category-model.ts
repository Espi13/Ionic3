export class CategoryModel {

    constructor(
        public name: string,
        public id: number,
        public imageUrl: string
    ){}
    static fromJson(data:any){
        if (!data.name || !data.id){
            throw( new Error('Invalid argument: argument structure do not match with model'))
        }
        return  new CategoryModel(data.name, data.id, data.imageUrl);
    }
}