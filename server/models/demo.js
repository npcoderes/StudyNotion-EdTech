const mongoose=require('mongoose');

const demo=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    }
})

module.exports=mongoose.model('Demo',demo);

//insert record
