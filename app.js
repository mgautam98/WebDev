var express                 =   require("express"),
    app                     =   express(),
    bodyParser              =   require("body-parser"),
    mongoose                =   require("mongoose"),
    passport                =   require("passport"),
    LocalStrategy           =   require("passport-local"),
    passportLocalMongoose   =   require("passport-local-mongoose"),
    Campground              =   require("./models/campground"),
    Comment                 =   require("./models/comment"),
    User                    =   require("./models/user"),
    seedDB                  =  require("./seeds");
    
var commentRoutes    = require("./routes/comment"),
    campgroundRoutes = require("./routes/campground"),
    indexRoutes      = require("./routes/index");
    
// seedDB();
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//Passport Setup
app.use(require("express-session")({
    secret: "Again Rusty is the cutest dog!",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//For passing user data
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has started!!");
});