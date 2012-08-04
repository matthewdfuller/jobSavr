var bookmarklet = "(function(){window.baseUrl='http://localhost';var s=document.createElement('script');s.setAttribute('type','text/javascript');s.setAttribute('charset','UTF-8');s.setAttribute('src',baseUrl+'/hackday/addJob.js');document.documentElement.appendChild(s);})();";

$('#bookmarklet').ready(function() {
  $('#bookmarklet').attr('href', 'javascript:' + encodeURIComponent(bookmarklet).replace(/\(/g, '%28').replace(/\)/g, '%29'));
});