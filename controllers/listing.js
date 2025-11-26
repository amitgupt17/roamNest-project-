const Listing = require("../models/listing");
const maptilerClient = require("@maptiler/client");

const key =process.env.MAP_TOKEN;
maptilerClient.config.apiKey = key;

module.exports.indexform = async (req, res) => {

  const allListing = await Listing.find({});
  return res.render("./listings/index.ejs", { allListing });
};


module.exports.newListing =  (req, res) => {
  try{
    return res.render("./listings/new.ejs");
  } catch(e) {
    req.flash("error",e.message);
  }
  
};


module.exports.showform = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author",
    },
  })
  .populate('owner');

  if (!listing) {
    req.flash("error", "Listing doesn't exist");
    return res.redirect("/listings");
  }
  console.log(listing);
  return res.render("listings/show.ejs", { listing,key});
};

module.exports.createListing = async (req, res, next) => {
  try {
    const location = req.body.listing.location;
    const country = req.body.listing.country;
    let centerLocation = `${location}, ${+country}`;
    const forwardResult = await maptilerClient.geocoding.forward(centerLocation, { limit: 1 });

    if (!forwardResult.features || forwardResult.features.length === 0) {
      req.flash("error", "Could not find the location. Please enter a valid address.");
      return res.redirect("/listings/new");  // **return** here
    }

    const url = req.file.path;
    const filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = forwardResult.features[0].geometry;

    const savedListing = await newListing.save();
    console.log("Saved listing:", savedListing);

    // Always check if response is not already sent
    if (!res.headersSent) {
      req.flash("success", "New Listing is Created");
      return res.redirect("/listings");  // **return** here
    }
    // If headers already sent, do not try to redirect again
  } catch (err) {
    console.error("Geocoding error:", err);
    req.flash("error", "Could not fetch geolocation for provided address");
    return res.redirect("/listings/new");  // **return** here
  }
};

module.exports.editform = async (req, res) => { 
  let { id } = req.params; 
  const listing = await Listing.findById(id); 
  if (!listing) { 
    req.flash("error", "Listing you requested for does not exist"); 
    return res.redirect("/listings"); 
  } 
  let originalImageUrl = listing.image.url; 
  originalImageUrl = originalImageUrl.replace('/upload', '/upload/w_200,h_auto,c_fit');
  return res.render("./listings/edit.ejs", { listing, originalImageUrl}); 

};

module.exports.updateform = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image ={url,filename};
    await listing.save();
  }
 
  req.flash("success"," Listing is Updated");
  return res.redirect(`/listings/${id}`);
};

module.exports.destroy = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success","Listing is Delete");
  return res.redirect("/listings");
};