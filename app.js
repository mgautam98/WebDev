var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  =  require("./models/campground");

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");



// Campground.create({
//             name: "Dudhni, Silvassa", 
//             image:"https://farm8.staticflickr.com/7268/7121859753_e7f787dc42.jpg",
//             description:"This place is in the laps of nature covered by hills, river. No bathrooms. No electricity. Only beeautiful views"
// }, function(err, campground){
//     if(err){
//         console.log(err);
//     } else{
//         console.log(campground);
//     }
// });

// var campgrounds = [
//         {name: "Shimla", image:"https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg"},
//         {name: "Mount Abu", image:"https://farm5.staticflickr.com/4016/4369518024_0f64300987.jpg"},
//         {name: "Dudhni, Silvassa", image:"https://farm8.staticflickr.com/7268/7121859753_e7f787dc42.jpg"}
//         ];


// root route
app.get("/", function(req, res){
    res.render("landing");
});

//INDEX
app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
                res.render("campgrounds", {campgrounds:allCampgrounds});
        }
    })
});

//CREATE
app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image= req.body.image;
    var desc = req.body.description;
    var newCampground = {name:name, image:image, description:desc};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log("Error!");
        } else{
             res.redirect("/campgrounds");
        }
    })
});

//NEW
app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
});

//SHOW
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has started!!");
});