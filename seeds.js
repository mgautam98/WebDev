var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");

var data = [
            {
            name: "Cloud's Rest", 
            image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
            description: "blah blah blah"
        },
        {
            name: "Desert Mesa", 
            image: "https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg",
            description: "blah blah blah"
        },
        {
            name: "Canyon Floor", 
            image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
            description: "blah blah blah"
        }
    ]

function seedDB(){
        Campground.remove({}, function(err){
        if(err){
            console.log(err);
        } else{
            console.log("Campgrounds removed");
            data.forEach(function(seed){
               Campground.create(seed, function(err, campground){
                   if(err){
                       console.log(err);
                   } else {
                       console.log("Campground created");
                       Comment.create({
                           text:"Beautiful place, I wish there would be wifi",
                           author:"Homer"
                       }, function(err, comment){
                           if(err){
                               console.log(err);
                           } else{
                               campground.comments.push(comment);
                               campground.save();
                               console.log("comment created");
                           }
                       });
                   }
               }) 
            });
        }
    });
}



module.exports = seedDB;