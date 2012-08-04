var rootURL = "https://secure.bluehost.com/~cranecon/jobsavr/index.php/index";

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
        url: rootURL,
        dataType: 'json',
        success: function(data){
            var list = data == null ? [] : (json.data.jobs instanceof Array ? data.jobs : [data.jobs]);
	    $.each(list, function(index, job) {
		$("#left_inner").append("<div id=\"job_" + job['id'] + "\" class=\"left_listing\" onclick=\"updateRight(this)\"><div class=\"listing_title\">" + job['title'] + "</div><div class=\"listing_company\">" + job['company'] + "</div></div><script type=\"text/javascript\">$('#job_' + " + job['id'] + "').data(\"job_info\", { job_title:\"" + job['title'] + "\", company_name:\"" + job['company'] + "\", url:\"" + job['url'] + "\"});</script>");
            }); 
        }
    });
}

//Call onClick when job on left is clicked

var currently_highlighted = "";

function updateRight(elem) {
    $(elem).toggleClass('left_listing_clicked');
    $(currently_highlighted).toggleClass('left_listing_clicked');
    currently_highlighted = elem;
    updateJobTitle($(elem).data("job_info").job_title, $(elem).data("job_info").company_name);
    updateURL($(elem).data("job_info").url);
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

function updateProfile(company_name) {
    document.getElementById('num_employees').innerHTML=getNumEmployees(company_name);
    document.getElementById('company_website').innerHTML=getCompanyWebsite(company_name);
}



//LINKED IN API CALLS
function getCompanyInfo(company_name) {
    
}

function getNumEmployees(company_name) {
    //MAKE API CALL AND RETURN NUM_EMPLOYEES
    var num_employees = "200-500";
    return num_employees;
}



