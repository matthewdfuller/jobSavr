function getUsersJobs() {
    $.ajax({
        url: "",
        dataType: 'json',
        data: data,
        success: function(json_data){
            var job_title = json_data.item[0].job_title;
        }
    });
}

//Call onClick when job on left is clicked

var currently_highlighted = "";

function updateJob(elem) {
    $(elem).toggleClass('left_listing_clicked');
    $(currently_highlighted).toggleClass('left_listing_clicked');
    currently_highlighted = elem;
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
}



//LINKED IN API CALLS
function getNumEmployees(company_name) {
    //MAKE API CALL AND RETURN NUM_EMPLOYEES
    var num_employees = "200-500";
    return num_employees;
}