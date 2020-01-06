var current_page=1;
var crew={};
var people={};
var url="https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas?page="+current_page;
var ajax = $.ajax({

	type: "GET",
    url: url,
    success: function(datos){

    	try{
    		if (datos.results.length>0){

    			crew=datos.results;
    			$.each(crew, function(index,person){

    				drawPeople(person);
    				$("#crew").fadeIn(300);
    			});
    			//Height of image div
				$(".img_person").height($(".name_person").first().width()*9/16);
    		}
    		else{
				console.log("No hay datos");
				$("#container_body").html("No results");
				$("#crew").fadeIn(300);
    		}
    	}
    	catch(error){
    		console.log("ERROR");
    		console.error(error);
    		$("#container_body").html("Data error");
    		$("#crew").fadeIn(300);
    	}
    },
    error: function(objeto, quepaso, otroobj){
	    console.log(objeto, quepaso, otroobj);
	    $("#container_body").html("Database connection failed");
	    
    }
});


//Funcion del input de búsqueda de criterios
function myFunction() {

    var input, filter, ul, li, a, b, i, txtValue;

    input = $("#myInputSearch")[0];
    filter = input.value.toUpperCase();
    ul = $("#container_body");
    li = $(ul).find('.box_person');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = $(li[i]).find(".name_person")[0];

		b= $(li[i]).find(".profession_person")[0];

        txtValue = (a.textContent || a.innerText)+ (b.textContent || b.innerText);
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
        } else {
          li[i].style.display = "none";
        }
    }
}

var template='<div id="person_@id" class="box_person" onclick="askCrew(\'@id\')">'+
				'<div class="img_person"></div>'+
				'<div class="name_person bold">@first_name @last_name</div>'+
				'<div class="gender_person grey">@gender</div>'+
				'<div class="profession_person grey">@profession</div>'+
			'</div>';

var templateCrew='<div class="page_person">'+
	'<div class="img_person"></div>'+
	'<div class="name_person">@first_name @last_name</div>'+
	'<div class="gender_person grey">@gender</div>'+
	'<div class="profession_person grey">@profession</div>'+
'</div>';

function drawPeople(person){
	var toPaint=template;


	if (person.id){
		toPaint=toPaint.replace(/@id/g, person.id);
	}else{
		console.log("ERROR NEED ID");
	}

	if (person.first_name){
		toPaint=toPaint.replace("@first_name", person.first_name);
	}else{
		toPaint=toPaint.replace("@first_name", "");
	}

	if (person.first_name){
		toPaint=toPaint.replace("@last_name", person.last_name);
	}else{
		toPaint=toPaint.replace("@last_name", "");
	}

	switch(person.gender){
		case "M":case "m":
			toPaint=toPaint.replace("@gender", "Man");
		break;
		case "F":case "F":
			toPaint=toPaint.replace("@gender", "Woman");
		break;
		default:
			toPaint=toPaint.replace("@gender", "");
		break;
	}

	if (person.profession) {
		toPaint=toPaint.replace("@profession", person.profession);
	}else{
		toPaint=toPaint.replace("@profession", "");
	}

	$("#container_body").append(toPaint);

	$("#person_"+person.id+" .img_person").css("background-image","url("+person.image+")");
}

function askCrew(id){

	$("#crew").fadeOut("fast",function(){
		if (people[id]){
			console.log("exist");
			showInfo(id);
		}else{
			console.log("No exist, request info");
			requestInfo(id)
		}
	});
	
}

function requestInfo(id){

	var urlInfo="https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas/"+id;
	var ajaxInfo = $.ajax({

		type: "GET",
	    url: urlInfo,
	    success: function(datos){	
			people[id]=datos;
			showInfo(id);
	    },
	    error: function(objeto, quepaso, otroobj){
		    console.log(objeto, quepaso, otroobj);
		    $("#container_body").html("Database connection failed");
		    
	    }
	});
}


function showInfo(id){

    $("#detail_crew .detail_image").css("background-image","url("+people[id].image+")");

	$("#detail_crew .detail_name").html(people[id].first_name +" "+people[id].last_name);

	switch(people[id].gender){
		case "M":case "m":
			$("#detail_crew .detail_gender").html("Man");
		break;
		case "F":case "F":
			$("#detail_crew .detail_gender").html("Woman");
		break;
		default:
			$("#detail_crew .detail_gender").html("");
		break;
	}

	$("#detail_crew .detail_profession").html(people[id].profession);

	$("#detail_crew .detail_description").html(people[id].description);


	$("#detail_crew").fadeIn(300);
	$(".icon_header").css("cursor","pointer");

	$("#detail_crew .detail_image").height($("#detail_crew .detail_image").width()*9/16);

}

function hideInfo(){
	$("#detail_crew").fadeOut(300,function(){
		$("#crew").fadeIn(300);
	});
}


$(window).resize(function() {
	//Height of image div
	if ($("#crew").is(":visible")){
		$(".img_person").height($(".img_person").first().width()*9/16);
	}else{
		$("#detail_crew .detail_image").height($("#detail_crew .detail_image").width()*9/16);
	}
});


$(window).on("load",function(){

	var nav = $('.search_bar');

	$("#container_scroll").scroll(function () {        

		console.log($(this).scrollTop());
        if ($(this).scrollTop() > 50) {
            nav.addClass("fixed-search");
            $('.container').css('margin-top', '80px');
        } else {       
            nav.removeClass("fixed-search");
            $('.container').css('margin-top', '0px');
        }
    });


	$(".icon_header").on("click",function(){

		if ($("#detail_crew").is(":visible")){
			$(".icon_header").css("cursor","default");
			hideInfo();
		}
	});
});


