var express     =   require("express");
var router  = express.Router();
var Campground  =   require("../models/campground");

//INDEX
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
                res.render("campgrounds/campgrounds", {campgrounds:allCampgrounds});
        }
    });
});

//CREATE
router.post("/", isLoggedIn,function(req, res){
    var name = req.body.name;
    var image= req.body.image;
    var desc = req.body.description;
    var author = {
        id:req.user._id,
        username:req.user.username
    };
    var newCampground = {name:name, image:image, description:desc, author: author};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log("Error!");
        } else{
             res.redirect("/campgrounds");
        }
    });
});

//NEW
router.get("/new", isLoggedIn,function(req, res) {
    res.render("campgrounds/new");
});

//SHOW
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//Edit Routes

router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

router.put("/:id", checkCampgroundOwnership,function(req, res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

router.delete("/:id", checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campground");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

function checkCampgroundOwnership(req, res, next) {
 if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports  =   router;