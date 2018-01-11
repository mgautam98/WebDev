var express     =   require("express");
var router  = express.Router();
var Campground  =   require("../models/campground");
var middleware  =   require("../middleware");

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
router.post("/", middleware.isLoggedIn,function(req, res){
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
            req.flash("error", err.message);
        } else{
             res.redirect("/campgrounds");
        }
    });
});

//NEW
router.get("/new", middleware.isLoggedIn,function(req, res) {
    res.render("campgrounds/new");
});

//SHOW
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
        if(err){
            console.log(err);
            req.flash("error", "Opps! something went wrong");
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//Edit Routes

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

router.put("/:id", middleware.checkCampgroundOwnership,function(req, res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           req.flash("error", "Opps! something went wrong");
           res.redirect("/campgrounds");
       } else {
           res.flash("success", "Successfuly edited your post");
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

router.delete("/:id", middleware.checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Opps! something went wrong");
            res.redirect("/campground");
        } else {
            res.flash("success", "Successfuly deleted your post");
            res.redirect("/campgrounds");
        }
    });
});


module.exports  =   router;