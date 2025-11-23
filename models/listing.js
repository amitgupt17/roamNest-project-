const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { fileLoader } = require("ejs");
const User = require("./user.js");
const Review = require("./reviews.js");
const { required } = require("joi");


const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image: {
        url:String,
        filename:String,
    },

   
    price:{
        type:Number,
        required:true,
        min: [1, "Price must be greater than 0"],
    },
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
           

        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
        
    },
    geometry: {
        type: {
           type: String, // Don't do `{ location: { type: String } }`
           enum: ['Point'], // 'location.type' must be 'Point'
           required: true
        },
        coordinates: {
           type: [Number],
           required:true
            
        }
    },
    category:{
        type:String,
        enum:["mountains","domes","boats","arctic","farms","rooms","cities","castles","pools","camping","beach","trending"],
        lowercase: true
    },
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }

});
// listingSchema.index({ geometry: '2dsphere' });
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
