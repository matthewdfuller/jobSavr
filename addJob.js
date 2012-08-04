var appURL = 'http://localhost/hackday';

var s=document.createElement('script');
s.setAttribute('type','text/javascript');
s.setAttribute('charset','UTF-8');
s.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js');
document.documentElement.appendChild(s);

s=document.createElement('script');
s.setAttribute('type','text/javascript');
s.setAttribute('charset','UTF-8');
s.setAttribute('src','http://platform.linkedin.com/in.js');
s.innerHTML = 'api_key: l3bpklmxvfcp\nauthorize: true';
document.documentElement.appendChild(s);

var popupRequest = new XMLHttpRequest();
popupRequest.open('GET', appURL+'/addjob.html', true);
popupRequest.addEventListener('load', popupRetrieved);
popupRequest.send();

function popupRetrieved() {
  console.log(popupRequest.responseText);

  var popup = document.createElement('div');
  popup.innerHTML = popupRequest.responseText;
  $("input[name='com_url']", popup).val(window.location);
  $('body').prepend(popup);
};
