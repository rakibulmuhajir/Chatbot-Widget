document.addEventListener('DOMContentLoaded', function() {
  // Load the main script
  var script = document.createElement('script');
  script.src = 'https://bot.aivolutive.com/static/js/script.js';
  document.body.appendChild(script);

  // Load the CSS
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'https://bot.aivolutive.com/static/css/style.css';
  document.head.appendChild(link);

  // Load additional scripts as needed
  var materializeScript = document.createElement('script');
  materializeScript.src = 'https://bot.aivolutive.com/static/js/lib/materialize.min.js';
  document.body.appendChild(materializeScript);

  var uuidScript = document.createElement('script');
  uuidScript.src = 'https://bot.aivolutive.com/static/js/lib/uuid.min.js';
  document.body.appendChild(uuidScript);

  var chartScript = document.createElement('script');
  chartScript.src = 'https://bot.aivolutive.com/static/js/lib/chart.min.js';
  document.body.appendChild(chartScript);

  var showdownScript = document.createElement('script');
  showdownScript.src = 'https://bot.aivolutive.com/static/js/lib/showdown.min.js';
  document.body.appendChild(showdownScript);
});
