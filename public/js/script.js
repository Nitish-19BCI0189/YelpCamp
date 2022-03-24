$(".comment-form").submit(function(e){
	e.preventDefault();
	var currentUserId = $("#cuser").text();
	var comment = $(this).serialize();
	var deleteUrl = $(".delete-form").attr("action");
	var editUrl = $(".edit-form").attr("action");
	var actionUrl = $(this).attr("action");
	$.post(actionUrl,comment,function(data){
		$("h4.no-comments-yet").html(`Total comments : ${data.campground.comments.length}`);
		$("h4.no-comments").addClass("display");
		data.cid=$("#campid").text().trim();
		var equal = currentUserId.trim()==data.comment.author.id.trim();
		var isEqual = equal || (data.user.isAdmin);
		data.editUrl = editUrl;
		data.deleteUrl=deleteUrl;
		elements = `<div class="row">
					<div clsas="col-md-12">
						<strong>${data.comment.author.name}</strong>
						<span class="pull-right">10 days ago</span>
					</div>`;
		if(isEqual){
			elements= elements + `
<form action ="/campgrounds/${data.cid}/comments/${data.comment._id}" method = "POST" class="edit-form" style="display:none;margin-top:30px">
	<div class="well">
    	<h4>Update your comment <span class="glyphicon glyphicon-pencil"></span></h4>
    	
            <div class="form-group">
              <textarea class="form-control" rows="5"  name="text" >${data.comment.text}</textarea>
            </div>
            <div class="form-group">
              <button class="btn btn-success update">Update </button>
            </div>
            </div>
              </form>`;
		}
		
		elements = elements + `<p class="comment-text">
						  ${data.comment.text}
					</p>`;
		
		if(isEqual){
			elements = elements + ` <button class="btn btn-xs btn-warning edit">
						Edit
					</button>
					
					<form class="delete-form" action="/campgrounds/${data.cid}/comments/${data.comment._id}" class="delete-form">
					<button class="btn btn-xs btn-danger delete">Delete</button>
				</form>`;
		}
		
		elements = elements + `</div>`;
		$("#element").html(elements);
		console.log(elements);
		
		$(".comment-area").prepend(elements);
	});
});

$(".comment-area").on("submit",".edit-form",function(e){
	e.preventDefault();
	var comment = $(this).serialize();
	var actionUrl = $(this).attr("action");
	var $originalItem = $(this).siblings(".comment-text");
	$.ajax({
		url : actionUrl,
		data : comment,
		type : "PUT",
		originalItem : $originalItem,
		success: function(data){
			console.log(data);
			data.cid=$("#campid").text().trim();
			console.log(data);
			console.log(this.originalItem.html());
		this.originalItem.html(`${data.text}`);
		}
	});
});

$(".comment-area").on("submit",".delete-form",function(e){
	e.preventDefault();
	var confirmResponse = confirm("Are you sure");
	if(confirmResponse){
		var actionUrl = $(this).attr("action");
		var $originalItem = $(this).parent(".row");
		$.ajax({
			url: actionUrl,
			type : "DELETE",
			originalItem : $originalItem,
			success : function(data){
				console.log(data.campground.comments.length);
				if(data.campground.comments.length == 0){
					// $("h4.no-comments-yet").addClass("display");
					$("h4.no-comments-yet").html(`<em> No comments yet </em>`);
				}
				else{
					$("h4.no-comments-yet").html(`Total comments : ${data.campground.comments.length}`);
				}
				this.originalItem.remove();
				
				
			}
		})
	}
	else{
		$(this).find("button").blur();
	}
});

$(".like-form").submit(function(e){
	var currentUserId = $("#cuser").text();
	if(currentUserId==="false"){
		currentUserId = false;
	}
	e.preventDefault();
	var actionUrl = $(this).attr("action");
	var originalItem = $(this).children().children(".like-button");
	$.post(actionUrl,function(data){
		if(data.campground.likes.length !== 0){
			$("tr.no-likes-yet").addClass("display");
		}
		
		if(currentUserId && data.campground.likes.some(function(like){
								return like.trim()==currentUserId.trim();
							})){
			
			originalItem.html(`
										<button class="btn btn-primary">
						<i class="fa fa-thumbs-up" aria-hidden="true"></i>
							Liked(${data.campground.likes.length})
						</button>
									  `);
			
			$(".like-table").prepend(` <tr class="${data.uid}">
                            <td><span class="badge"><i class="fas fa-user"></i></span> ${data.likedBy} </td>
                        </tr>`);
			$(".modal-title").html(`Campground likes: ${data.campground.likes.length}`);
			console.log($(".total-likes-btn").children());
			$(".total-likes-btn").html(`Total likes: <i class="fas fa-thumbs-up"></i> ${data.campground.likes.length}`);
		}
		else{
		if(data.campground.likes.length === 0){
			$("tr.no-likes-yet").removeClass("display");}
			originalItem.html(`<button class="btn btn-secondary">
						<i class="fa fa-thumbs-up" aria-hidden="true"></i>
							Like(${data.campground.likes.length})
					</button>`);
			
			$(".modal-title").html(`Campground likes: ${data.campground.likes.length}`);
			$(".total-likes-btn").html(`Total likes: <i class="fas fa-thumbs-up"></i> ${data.campground.likes.length}`);
			$(".like-table tr").remove(`.${data.uid}`);
		}
		
	});
});

