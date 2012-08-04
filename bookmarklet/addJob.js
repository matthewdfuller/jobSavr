var appURL = 'http://localhost/';
var backendURL = 'http://localhost/backend/';

var s=document.createElement('script');
s.setAttribute('type','text/javascript');
s.setAttribute('charset','UTF-8');
s.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js');
document.documentElement.appendChild(s);

var popupRequest = new XMLHttpRequest();
popupRequest.open('GET', appURL+'/bookmarklet/addjob.html', true);
popupRequest.addEventListener('load', popupRetrieved);
popupRequest.send();

function popupRetrieved() {
    console.log(popupRequest.responseText);

    var popup = document.createElement('div');
    popup.innerHTML = popupRequest.responseText;
    $("input[name='com_url']", popup).val(window.location);
    $('body').prepend(popup);
    $('#jobsavr_add_job').submit(function() {
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
        return false;
        $(popup).remove();
    });
};

function formToJSON() {
    return JSON.stringify({
	    "url": $('#add_form_url').val(),
	    "title": $('#add_form_title').val(),
	    "company": $('#add_form_company_name').val(),
	    "description": $('#add_form_description').val()
    });
}

function handleError(data) {
    if (data.error) {
        console.log(data.error);
        return true;
    }
    return false;
}

