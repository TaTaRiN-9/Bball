import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        secondName: {
            type: String,
        },
        numberTel: {
            type: Number,
        },
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        }],
    }, 
    {timestamps: true}
)

export default mongoose.model('User', UserSchema)