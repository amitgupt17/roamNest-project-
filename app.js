if(process.env.NODE_ENV != "production"){

  require('dotenv').config();
}
// console.log(process.env.SECRET);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session =require("express-session");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//router
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js");


const dbURL = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("connected to db");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
};


// ===== MIDDLEWARE SETUP (MUST BE FIRST!) =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', engine);
// CRITICAL: These MUST come before routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const store = MongoStore.create({
  // mongoUrl: dbURL,
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  },
};
// ===== ROUTES =====
// app.get("/", (req, res) => {
//   res.send("Hi, I'm root");
// });


app.use(session(sessionOptions));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// passport.use(User.createStrategy()); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
  next();
});


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",users);
// app.use('/uploads', express.static('uploads'));

// ===== ERROR HANDLERS (MUST BE LAST!) =====
// 404 handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);  // don't send a second response if first was already sent
  }
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("./error.ejs", {
    message,
    statusCode,
  });
});

app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});
