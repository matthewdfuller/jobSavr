//var backendURL = 'https://secure.bluehost.com/~cranecon/jobsavr/index.php';
var backendURL = 'https://localhost/backend/index.php';


// 2. Runs when the JavaScript framework is loaded
function onLinkedInLoad() {
    IN.Event.on(IN, "auth", onLinkedInAuth);
}

// 2. Runs when the viewer has authenticated
function onLinkedInAuth() {
    IN.API.Profile("me").result(displayProfiles);
    getUsersJobs();
}

// 2. Runs when the Profile() API call returns successfully
function displayProfiles(profiles) {
    member = profiles.values[0];
    document.getElementById("profiles").innerHTML = 
        "Welcome, " +  member.firstName + " " + member.lastName;
}

function getUsersJobs() {
    $.ajax({
        url: backendURL,
        type: 'GET',
        //dataType: 'json',
        //data: 'test',
        success: function(json_data){
            console.log(json_data);
            //var job_title = json_data.item[0].job_title;
        },
        error: function(obj, text){
            console.log('ERROR: ' + text);
            //var job_title = json_data.item[0].job_title;
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