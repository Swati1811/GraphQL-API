const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    email:{type:String,required:true},
    password:{type:String,required:true},
    createdEvents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ]
});

const User=mongoose.model('User',UserSchema);

module.exports=User;