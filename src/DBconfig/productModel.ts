import { model, models, Schema  } from "mongoose";

const productSchema = new Schema({
    productName : {type: String, required: true},
    productDescription : {type: String, required: true},
    productPrice : {type: Number, required: true},
    productImage : {type: Array, required: true},
})
const Product = models.product || model('product', productSchema);
export default Product;