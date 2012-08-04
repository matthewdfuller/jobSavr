//var backendURL = 'https://secure.bluehost.com/~cranecon/jobsavr/index.php';
var backendURL = 'https://localhost/backend/index.php';


// 2. Runs when the JavaScript framework is loaded
function onLinkedInLoad() {
    IN.Event.on(IN, "auth", onLinkedInAuth);
}

// 2. Runs when the viewer has authenticated
function onLinkedInAuth() {
    IN.API.Profile("me").result(displayProfiles);
    getJobs();
}

// 2. Runs when the Profile() API call returns successfully
function displayProfiles(profiles) {
    member = profiles.values[0];
    document.getElementById("profiles").innerHTML = 
        "Welcome, " +  member.firstName + " " + member.lastName;
}


function handleError(data) {
    if (data.error) {
        console.log(data.error);
        return true;
    }
    return false;
}

function formToJSON() {
    return JSON.stringify({
	"url": $('#add_form_url').val(),
	"title": $('#add_form_title').val(),
	"company": $('#add_form_company_name').val(),
	"description": $('#add_form_description').val()
    });
}

function updateToJSON() {
    return JSON.stringify({
        "id": $('#hidden_id').val(),
	"title": $('#editable_post_title').val(),
	"company": $('#editable_post_company').val(),
	"description": $('#editable_description').val()
    });
}

function addJob() {
    $.ajax({
	type: 'POST',
	contentType: 'application/json;charset=UTF-8',
	url: backendURL,
	dataType: 'json',
	data: formToJSON(),
	success: function(data, textStatus, jqXHR){
        if (handleError(data)) return;
	},
	error: function(jqXHR, textStatus, errorThrown){
		//alert('add job error: ' + textStatus);
                document.getElementById('error_outer_box').innerHTML="";
	}
    });
    getJobs();
}


function updateJob() {
    $.ajax({
        type: 'PUT',
	contentType: 'application/json',
        url: backendURL,
        dataType: 'json',
        data: updateToJSON(),
        success: function(data, textStatus, jqXHR){
            if (handleError(data)) return;
        },
        error: function(jqXHR, textStatus, errorThrown){
		alert('update job error: ' + textStatus);
        }
    });
}


function deleteJob(id) {
    console.log(id);
    $.ajax({
        type: 'DELETE',
	    contentType: 'application/json',
        url: backendURL,
        dataType: 'json',
        data: JSON.stringify({"id":id}),  // put job id here. 
        success: function(data, textStatus, jqXHR){
            if (handleError(data)) return;
        },
        error: function(jqXHR, textStatus, errorThrown){
		    alert('delete job error: ' + textStatus);
        }
    });
}


function getJobs() {
    $("#left_inner").html("");
    $.ajax({
	    type: 'GET',
        dataType: 'json',
        url: backendURL,
        success: function(data){
            if (handleError(data)) return;

            var list = data == null ? [] : (data.jobs instanceof Array ? data.jobs : [data.jobs]);
	        $.each(list, function(index, job) {
		        $("#left_inner").append("<div id=\"job_" + job['id'] + "\" class=\"left_listing\" onclick=\"updateRight(this)\"><div class=\"listing_title\">" + job['title'] + "</div><div class=\"listing_company\">" + job['company'] + "</div></div>");
                $("#job_" + job.id).data("job_info", {
                    job_id: job['id'],
                    job_title: job['title'],
                    company_name: job['company'],
                    url: job['url'],
                    desc: job['description']
                });
                console.log($("#job_" + job.id).data());
            });
        },
        error: function(obj, text){
            console.log('ERROR: ' + text);
            //var job_title = json_data.item[0].job_title;
        }
    });
}

//Call onClick when job on left is clicked

var currently_highlighted = "";
var num_employees = "";
var company_id = "";
var founded_year = "";
var company_description = "";
var company_url = "";
var li_company_name = "";

function updateRight(elem) {
    document.getElementById('none_selected').style.display="none";
    document.getElementById('posting_under').style.display="block";
    document.getElementById('job_top_headline').style.display="block";
    $(elem).toggleClass('left_listing_clicked');
    $(currently_highlighted).toggleClass('left_listing_clicked');
    currently_highlighted = elem;
    
    document.getElementById('posting_title').innerHTML="<input id=\"editable_post_title\" class=\"editable\" onBlur=\"saveChanges()\" type=\"text\" value=\"" + $(elem).data("job_info").job_title + "\"/>" + " <br/><div id=\"posting_top_company_name\">" + "<input id=\"editable_post_company\"class=\"editable\" onBlur=\"saveChanges()\" type=\"text\" value=\"" + $(elem).data("job_info").company_name + "\"/></div>";
    document.getElementById('posting_url').innerHTML= "<a href=\"" + $(elem).data("job_info").url + "\">" + $(elem).data("job_info").url + "</a>";
    document.getElementById('posting_description').innerHTML="<input id=\"hidden_id\" type=\"hidden\" value=\"" + $(elem).data("job_info").job_id + "\"/><textarea id=\"editable_description\" class=\"editable_textarea\" onBlur=\"saveChanges()\">" + $(elem).data("job_info").desc + "</textarea>";
    
    getCompanyInfo($(elem).data("job_info").company_name);
    //getConnections(li_company_name);
}

//MakeEditable makes textboxes editable
var editing = false;
function makeEditable() {
    editing = true;
}

function saveChanges() {
    updateJob();
}

//LINKED IN API CALLS

function getCompanyInfo(company_name) {
    IN.API.Raw('/company-search?keywords=' + encodeURIComponent(company_name))
    .result(function(value) {
        //alert(JSON.stringify(value));
        //alert(value.companies.values[0]["id"]);
        company_id = value.companies.values[0]["id"];
        getCompanyProfile(value.companies.values[0]["id"]);
    })
}

function getCompanyProfile(c_id) {
    var url = "/companies/" + c_id + ":(name,description,website-url,twitter-id,employee-count-range,founded-year,locations:(address:(city,state,postal-code)))";
    IN.API.Raw(url)
    .result(function(response) {
        //alert(JSON.stringify(response));
        company_description = response.description;
        //li_company_name = response.name;
        
        document.getElementById('num_employees').innerHTML= response.employeeCountRange["name"];
        document.getElementById('company_website').innerHTML=response.websiteUrl;
        document.getElementById('year_founded').innerHTML=response.foundedYear;
        document.getElementById('company_description').innerHTML=response.description;
        document.getElementById('company_location').innerHTML=response.locations.values[0]["address"]["city"] + ", " + response.locations.values[0]["address"]["state"] + " " + response.locations.values[0]["address"]["postalCode"];
        document.getElementById('company_twitter').innerHTML="@" + response.twitterId;
        document.getElementById('company_map').innerHTML="<img src=\"http://maps.googleapis.com/maps/api/staticmap?center=" + response.locations.values[0]["address"]["postalCode"] + "&zoom=13&size=350x300&maptype=roadmap&markers=color:red%7Ccolor:red%7Clabel:A%7C" + response.locations.values[0]["address"]["postalCode"] + "&sensor=false\"/>";
        //alert(num_employees);
        getConnections(response.name);
    });
}

function getConnections(company_name_in) {
    IN.API.Raw('/people-search:(people:(first-name,last-name,public-profile-url))?company-name=' + company_name_in + '&facet=network,F')
    //IN.API.Raw('/people/~/connections:(first-name,last-name,positions)?company-name=mozilla-corporation')
    .result(function(value) {
        //alert(JSON.stringify(value));
        document.getElementById('you_know').innerHTML="";
        $.each(value.people.values, function(index, person) {
                //alert(person.firstName);
                document.getElementById('you_know').innerHTML+=person.firstName + " " + person.lastName + " - <a href=\"" + person.publicProfileUrl + "\">ask for a recommendation?</a><br/>";
            })

        //document.getElementById('you_know').innerHTML=value.people.values[0].firstName + " " + value.people.values[0].lastName + " - <a href=\"" + value.people.values[0].publicProfileUrl + "\">ask for a recommendation?</a>";
        //alert(value.companies.values[0]["id"]);
        
    })
}

