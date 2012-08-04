var appURL = 'https://rinon.info/jobsavr';
var backendURL = 'https://rinon.info/jobsavr/backend/index.php';

var s=document.createElement('script');
s.setAttribute('type','text/javascript');
s.setAttribute('charset','UTF-8');
s.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js');
document.documentElement.appendChild(s);

// var popupRequest = new XMLHttpRequest();
// popupRequest.open('GET', appURL+'/bookmarklet/addjob.html', true);
// popupRequest.addEventListener('load', popupRetrieved);
// popupRequest.send();

var popup = document.createElement('div');
popup.style.width = '30em';
popup.style['margin-left'] = 'auto';
popup.style['margin-right'] = 'auto';
popup.style['background-color'] = '#EDEDED';
popup.style['padding'] = '10px';
popup.style['text-align'] = 'center';
popup.style['-moz-box-shadow'] = '0 0 5px 5px #888';
popup.style['-webkit-box-shadow'] = '0 0 5px 5px#888';
popup.style['box-shadow'] = '0 0 5px 5px #888';
popup.style['font-family'] = '\'Ruda\', sans-serif';
popup.style['font-weight'] = '200';
popup.style['color'] = '#303030';
popup.style['line-height'] = '1.8';
var iframe = document.createElement('iframe');
iframe.src = appURL+'/bookmarklet/addjob.html';
iframe.style.width = '30em';
popup.appendChild(iframe);


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

