document.addEventListener('DOMContentLoaded', function() {
  var script = document.createElement('script');
  script.src = 'https://bot.aivolutive.com/js/script.js';
  document.body.appendChild(script);

  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'https://bot.aivolutive.com/css/style.css';
  document.head.appendChild(link);

  // You may need to add more initialization code here,
  // depending on how your widget is designed to be initialized
});
