
const mongoose=require("mongoose");
var Schema=mongoose.Schema;

var myschema = new Schema({
    firstName:{type: String},
    lastName:{type: String},
    address:{type:String},
    gender: {type:String},
    hobbies :[{type:String}],
    interestArea : {type:String},
    pImg:{type: String},
});

module.exports = mongoose.model('jpro',myschema); 