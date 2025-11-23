const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);
  
  let saverev = await newReview.save();
  let savelist = await listing.save();
  console.log(savelist);
  console.log(saverev);
  req.flash("success", "Review added successfully!");
  return res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req,res)=>{
  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId} });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review deleted");
  return res.redirect(`/listings/${id}`);
};