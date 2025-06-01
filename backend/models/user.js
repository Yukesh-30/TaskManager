import { model, Schema } from 'mongoose'

const User = Schema({
    Name : {type : String,required : true},
    email : {type :String,required:true,unique:true},
    password : {type : String ,required : true},
    profileImageURL : {type : String,default:null},
    role : {type:String,enum:["admin","member"],default : "member"}
},{
    timestramp:true
})

const UserModel = model("User",User)

export default UserModel;