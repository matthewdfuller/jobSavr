var prod = false;

var backendURL;
if (prod)
    backendURL = 'https://rinon.info/jobsavr/backend/index.php';
else
    backendURL = 'https://localhost/backend/index.php';


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
        data: JSON.stringify(cur_job),
        success: function(data, textStatus, jqXHR){
            if (handleError(data)) return;
        },
        error: function(jqXHR, textStatus, errorThrown){
		    alert('update job error: ' + textStatus);
        }
    });
    
    getJobs();
}

function deleteJob() {
    $.ajax({
        type: 'DELETE',
	contentType: 'application/json',
        url: backendURL,
        dataType: 'json',
        data: JSON.stringify(cur_job),
        //data: JSON.stringify({
        //   "id": $('#hidden_id').val()}),  // put job id here.
        success: function(data, textStatus, jqXHR){
            if (handleError(data)) return;
        },
        error: function(jqXHR, textStatus, errorThrown){
		    //alert('delete job error: ' + textStatus);
        }
    });
    
    document.getElementById('posting_under').style.display="none";
    document.getElementById('job_top_headline').style.display="none";
    document.getElementById('posting_top_right').style.display="none";
    document.getElementById('none_selected').style.display="block";
    
    getJobs();
}


function getJobs() {
    //$("#left_inner").html("");
    //document.getElementById('left_inner').innerHTML="";
    $.ajax({
	    type: 'GET',
        dataType: 'json',
        url: backendURL,
        success: function(data){
            if (handleError(data)) return;

            var list = data == null ? [] : (data.jobs instanceof Array ? data.jobs : [data.jobs]);
	        $.each(list, function(index, job) {
		        $("#left_inner").append("<div id=\"job_" + job['id'] + "\" class=\"left_listing\" onclick=\"updateRight(this)\"><div class=\"listing_title\">" + job['title'] + "</div><div class=\"listing_company\">" + job['company'] + "</div></div>");
                $("#job_" + job.id).data("job_info", job);
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

var cur_job = null;

var currently_highlighted = "";
var cur_job_id;
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
    document.getElementById('posting_top_right').style.display="block";
    $(elem).toggleClass('left_listing_clicked');
    $(currently_highlighted).toggleClass('left_listing_clicked');
    currently_highlighted = elem;
    cur_job = $(elem).data('job_info');

    console.log(cur_job);
    document.getElementById('posting_title').innerHTML="<input id=\"editable_post_title\" class=\"editable\" onBlur=\"saveChanges()\" type=\"text\" value=\"" + cur_job.title + "\"/>" + " <br/><div id=\"posting_top_company_name\">" + "<input id=\"editable_post_company\"class=\"editable\" onBlur=\"saveChanges()\" type=\"text\" value=\"" + cur_job.company + "\"/></div>";
    document.getElementById('posting_url').innerHTML= "<a href=\"" + cur_job.url + "\">" + cur_job.url + "</a>";
    document.getElementById('posting_description').innerHTML="<input id=\"hidden_id\" type=\"hidden\" value=\"" + cur_job.job_id + "\"/><input id=\"company_id\" type=\"hidden\" value=\"" + cur_job.company_id + "\"/><textarea id=\"editable_description\" class=\"editable_textarea\" onBlur=\"saveChanges()\">" + cur_job.description + "</textarea>";

    if (!cur_job.company_id) {
        getCompanyInfo(cur_job.company);
    } else {
        getCompanyProfile(cur_job.company_id);
    }
    //getConnections(li_company_name);
}

//MakeEditable makes textboxes editable
function saveChanges() {
    cur_job = {
        "id": cur_job.id,
	    "title": $('#editable_post_title').val(),
	    "company": $('#editable_post_company').val(),
	    "company_id": cur_job.company_id,
	    "description": $('#editable_description').val()
    };
    updateJob();
}

//LINKED IN API CALLS
var zippy_code;

function getCompanyInfo(company_name) {
    IN.API.Raw('/company-search?keywords=' + encodeURIComponent(company_name))
    .result(function(value) {
        //alert(JSON.stringify(value));
        //alert(value.companies.values[0]["id"]);
        showCompanyResults(value.companies.values);
        // company_id = value.companies.values[0]["id"];
        // getCompanyProfile(value.companies.values[0]["id"]);
    })
    .error(function(error) {
        console.log(error);
    });
}

function showCompanyResults(companies) {
    var contents = '<div id="company_search_results"><ul>';
    companies.map(function(company) {
        contents += '<li id="company_search-' + company.id + '" onclick="selectCompany(' + company.id + ');">' + company.name + '</li>';
    });
    contents += '<li id="company_search-none">Not Here</li></div>';
    Shadowbox.open({
        content:    contents,
        player:     "html",
        title:      "Did you mean?",
        height:     600,
        width:      420
    });
}

function selectCompany(id) {
    Shadowbox.close();
    if (id !== 'none') {
        cur_job.company_id = id;
        updateJob();
        getCompanyProfile(id);
    }
}

function getCompanyProfile(c_id) {
    var url = "/companies/" + c_id + ":(name,description,website-url,twitter-id,employee-count-range,founded-year,locations:(address:(city,state,postal-code)))";
    IN.API.Raw(url)
    .result(function(response) {
        console.log(response);
        //alert(JSON.stringify(response));
        company_description = response.description;
        //li_company_name = response.name;
        
        document.getElementById('num_employees').innerHTML= response.employeeCountRange["name"];
        document.getElementById('company_website').innerHTML=response.websiteUrl;
        document.getElementById('year_founded').innerHTML=response.foundedYear;
        document.getElementById('company_description').innerHTML=response.description;
        if (response.locations.values) {
            document.getElementById('company_location').innerHTML=response.locations.values[0]["address"]["city"] + ", " + response.locations.values[0]["address"]["state"] + " " + response.locations.values[0]["address"]["postalCode"];
            document.getElementById('company_map').innerHTML="<img src=\"http://maps.googleapis.com/maps/api/staticmap?center=" + response.locations.values[0]["address"]["postalCode"] + "&zoom=13&size=350x300&maptype=roadmap&markers=color:red%7Ccolor:red%7Clabel:A%7C" + response.locations.values[0]["address"]["postalCode"] + "&sensor=false\"/>";
            zippy_code = response.locations.values[0]["address"]["postalCode"];
        }
        document.getElementById('company_twitter').innerHTML="@" + response.twitterId;
        cur_job.twitterId = response.twitterId;
        //alert(num_employees);
        getConnections(response.name);
    })
    .error(function(error) {
        console.log(error);
    });
}

function getConnections(company_name_in) {
    IN.API.Raw('/people-search:(people:(first-name,last-name,public-profile-url,picture-url))?company-name=' + company_name_in + '&facet=network,F')
    //IN.API.Raw('/people/~/connections:(first-name,last-name,positions)?company-name=mozilla-corporation')
    .result(function(value) {
        //alert(JSON.stringify(value));
        document.getElementById('you_know').innerHTML="";
        if (value.people.values) {
            $.each(value.people.values, function(index, person) {
                //alert(person.firstName);
                document.getElementById('you_know').innerHTML+= "<img src=\"" + person.pictureUrl + "\"/>" + person.firstName + " " + person.lastName + " - <a href=\"" + person.publicProfileUrl + "\">ask for a recommendation?</a><br/>";
            });
        }

        //document.getElementById('you_know').innerHTML=value.people.values[0].firstName + " " + value.people.values[0].lastName + " - <a href=\"" + value.people.values[0].publicProfileUrl + "\">ask for a recommendation?</a>";
        //alert(value.companies.values[0]["id"]);
        getSimilarJobs();
    });
}

function getSimilarJobs() {
    var in_job_title = cur_job.title;
    //IN.API.Raw('/job-search?job-title=' + encodeURIComponent(in_job_title))
    IN.API.Raw('/job-search?keywords=' + encodeURIComponent(in_job_title))
    .result(function(value) {
        //alert(JSON.stringify(value));
        document.getElementById('similar_jobs').innerHTML="";
        
        $(value.jobs.values).slice(0,3);
        $.each(value.jobs.values, function(index, job) {
                //alert(job.company["name"] + job.locationDescription);
                document.getElementById('similar_jobs').innerHTML+=job.company["name"] + " - " + job.locationDescription + "<br/>";
            });

        //document.getElementById('you_know').innerHTML=value.people.values[0].firstName + " " + value.people.values[0].lastName + " - <a href=\"" + value.people.values[0].publicProfileUrl + "\">ask for a recommendation?</a>";
        //alert(value.companies.values[0]["id"]);
        getTwitter();
    });
}

function getTwitter() {
    $("twitter_feed").append("<script>new TWTR.Widget({version: 2,type: 'search',search: '" + cur_job.twitterId + "',interval: 30000,title: '',subject: '',width: 350,height: 300,theme: {shell: {background: '#8ec1da',color: '#ffffff'},tweets: {background: '#ffffff',color: '#444444',links: '#1985b5'}},features: {scrollbar: true,loop: true,live: true,behavior: 'default'}}).render().start();</script>");
}
