const mongoose=require('mongoose');

const EventSchema=new mongoose.Schema({
    title:{ type:String, required:true},
    price:{ type:Number,required:true},
    imageUrl:{type:String,required:true},
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

const Events=mongoose.model('Event',EventSchema);

module.exports=Events;