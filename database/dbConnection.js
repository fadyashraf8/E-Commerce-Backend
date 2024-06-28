import mongoose from "mongoose";




export const dbConnection=()=>{
    mongoose.connect(`mongodb+srv://fady123:fady123@cluster0.9mgd5e3.mongodb.net/e-commerce-backend`).then(()=>{
        console.log("Connect Success!");
    }).catch(()=>{
        console.log("Connect Fail!");
    })
}

//mongodb+srv://fady123:fady123@cluster0.9mgd5e3.mongodb.net/e-commerce-backend
//mongodb://127.0.0.1:27017/e-commerce