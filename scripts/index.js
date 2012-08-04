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


function formToJSON() {
    return JSON.stringify({
	"url": $('#add_form_url').val(),
	"title": $('#add_form_title').val(),
	"company_name": $('#add_form_company_name').val(),
	"description": $('#add_form_description').val()
    });
}

function addJob() {
    $.ajax({
	type: 'POST',
	contentType: 'application/json',
	url: rootURL,
	dataType: 'json',
	data: formToJSON(),
	success: function(data, textStatus, jqXHR){
		if (data[0] =='error') {
			alert('error:' + data[0].text);
		} else {
			alert('job added successfully.');
		}
	},
	error: function(jqXHR, textStatus, errorThrown){
		alert('add job error: ' + textStatus);
	}
    });
}


function updateJob() {
    $.ajax({
        type: 'PUT',
	contentType: 'application/json',
        url: rootURL,
        dataType: 'json',
        data: formToJSON(),
        success: function(data, textStatus, jqXHR){
		if (data[0] =='error') {
                        alert('error:' + data[0].text);
                } else {
                        alert('job updated successfully.');
                }
        },
        error: function(jqXHR, textStatus, errorThrown){
		alert('update job error: ' + textStatus);
        }
    });
}


function deleteJob() {
    $.ajax({
        type: 'DELETE',
	contentType: 'application/json',
        url: rootURL,
        dataType: 'json',
        data: id,  // pull job id here. 
        success: function(data, textStatus, jqXHR){
		if (data[0] =='error') {
                        alert('error:' + data[0].text);
                } else {
                        alert('job deleted successfully.');
                }
        },
        error: function(jqXHR, textStatus, errorThrown){
		alert('delete job error: ' + textStatus);
        }
    });
}


function getJobs() {
    $.ajax({
	    type: 'GET',
        dataType: 'json',
        url: backendURL,
        success: function(data){
            console.log(data);
            var list = data == null ? [] : (data.jobs instanceof Array ? data.jobs : [data.jobs]);
	        $.each(list, function(index, job) {
		        $("#left_inner").append("<div id=\"job_" + job['id'] + "\" class=\"left_listing\" onclick=\"updateRight(this)\"><div class=\"listing_title\">" + job['title'] + "</div><div class=\"listing_company\">" + job['company'] + "</div></div>");
                $("#job_" + job.id).data("job_info", {
                    job_title: job['title'],
                    company_name: job['company'],
                    url: job['url']
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

function updateRight(elem) {
    document.getElementById('none_selected').style.display="none";
    document.getElementById('posting_under').style.display="block";
    document.getElementById('job_top_headline').style.display="block";
    console.log($(elem));
    $(elem).toggleClass('left_listing_clicked');
    $(currently_highlighted).toggleClass('left_listing_clicked');
    currently_highlighted = elem;
    updateJobTitle($(elem).data("job_info").job_title, $(elem).data("job_info").company_name);
    updateURL($(elem).data("job_info").url);
    getCompanyInfo($(elem).data("job_info").company_name);
}

function updateJobTitle(job_title, company_name) {
    document.getElementById('posting_title').innerHTML=job_title + " // " + company_name;
}

function updateURL(url) {
    document.getElementById('posting_url').innerHTML= "<a href=\"" + url + "\">" + url + "</a>";
}

function updateDescription(desc) {
    document.getElementById('posting_description').innerHTML=desc;
}


//LINKED IN API CALLS

function getCompanyInfo(company_name) {
    IN.API.Raw('/company-search?keywords=' + encodeURIComponent(company_name))
    .result(function(value) {
        //alert(JSON.stringify(value));
        //alert(value.companies.values[0]["id"]);
        company_id = value.companies.values[0]["id"];
    })
    .error(function(error) {
        //alert(JSON.stringify(error));
    });
    
    var url = "/companies/" + company_id + ":(name,description,website-url,twitter-id,employee-count-range,founded-year,locations:(address:(city,state,postal-code)))";
    IN.API.Raw(url)
    .result(function(response) {
        alert(JSON.stringify(response));
        company_description = response.description;
        
        document.getElementById('num_employees').innerHTML= response.employeeCountRange["name"];
        document.getElementById('company_website').innerHTML=response.websiteUrl;
        document.getElementById('year_founded').innerHTML=response.foundedYear;
        document.getElementById('company_description').innerHTML=response.description;
        document.getElementById('company_location').innerHTML=response.locations.values[0]["address"]["city"] + ", " + response.locations.values[0]["address"]["state"] + " " + response.locations.values[0]["address"]["postalCode"];
        document.getElementById('company_twitter').innerHTML="@" + response.twitterId;
        document.getElementById('company_map').innerHTML="<img src=\"http://maps.googleapis.com/maps/api/staticmap?center=" + response.locations.values[0]["address"]["postalCode"] + "&zoom=13&size=350x300&maptype=roadmap&markers=color:red%7Ccolor:red%7Clabel:A%7C" + response.locations.values[0]["address"]["postalCode"] + "&sensor=false\"/>";
        //alert(num_employees);
    });
}