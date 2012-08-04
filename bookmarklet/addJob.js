var prod = false;

if (prod) {
    var appURL = 'https://rinon.info/jobsavr';
    var backendURL = 'https://rinon.info/jobsavr/backend/index.php';
} else {
    var appURL = 'https://localhost';
    var backendURL = 'https://localhost/backend/index.php';
}

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
popup.id = 'jobsavr_popup';
popup.style.width = '30em';
popup.style.height = '15em';
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
iframe.id = 'jobsavr_iframe';
iframe.src = appURL+'/bookmarklet/addjob.html?' + encodeURIComponent(window.location);
iframe.style.width = '30em';
iframe.style.height = '15em';
iframe.style.border = '0';
iframe.scolling = 'no';
popup.appendChild(iframe);


$('body').prepend(popup);

window.onmessage = function(event) {
  if (event.data === "closed") {
      $('#jobsavr_popup').remove();
  }
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

