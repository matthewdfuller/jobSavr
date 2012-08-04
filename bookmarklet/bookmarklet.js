var bookmarklet = "(function(){var url='http://localhost/hackday';var s=document.createElement('script');s.setAttribute('type','text/javascript');s.setAttribute('charset','UTF-8');s.setAttribute('src',url+'/bookmarklet/addJob.js');document.documentElement.appendChild(s);})();";

$('#bookmarklet').ready(function() {
  $('#bookmarklet').attr('href', 'javascript:' + encodeURIComponent(bookmarklet).replace(/\(/g, '%28').replace(/\)/g, '%29'));
});