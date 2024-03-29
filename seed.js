var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment")

var data = [
	{
	 name:"Lakey Lake",
	 image : "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
	 description : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
	},
	{
	 name:"Cloud's Rest",
	 image : "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
	 description : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
	},
	{
	 name:"Canyon Floor",
	 image : "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
	 description : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
	}
];
function seedDB(){
	Campground.remove({},function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log("removed");
		data.forEach(function(seed){
			Campground.create(seed,function(err,campground){
				if(err){
					console.log(err);
				}
				else{
					console.log("campground added");
					Comment.create({
						text : "This is an amazing campground and according to me its a must visit",
						author : "Nitish Gupta"
					},function(err,comment){
						if(err){
							console.log(err);
						}
						else{
							campground.comments.push(comment);
							campground.save(function(err,campground){
								if(err){
									console.log(err);
								}
								else{
									console.log("comment added");
								}

								
							});
							
						}
					});
				}
			});
		});
	}
});

}


module.exports = seedDB ;
