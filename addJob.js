var appURL = 'http://localhost/hackday';

var addPopup = window.open(appURL+'/addjob.html','addJob','height=200,width=150');
if (window.focus)
  addPopup.focus();
