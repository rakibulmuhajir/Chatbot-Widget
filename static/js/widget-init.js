document.addEventListener('DOMContentLoaded', function() {
  function loadScript(src, callback) {
    var script = document.createElement('script');
    script.src = src;
    script.async = false; // Ensures scripts load in order
    script.onload = callback;
    script.onerror = function() { console.error('Failed to load script: ' + src); };
    document.head.appendChild(script); // Append to head for better control
  }

  // Load the CSS
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'https://bot.aivolutive.com/static/css/style.css';
  document.head.appendChild(link);

  // Load scripts in order
  loadScript('https://bot.aivolutive.com/static/js/lib/materialize.min.js', function() {
    loadScript('https://bot.aivolutive.com/static/js/lib/uuid.min.js', function() {
      loadScript('https://bot.aivolutive.com/static/js/lib/chart.min.js', function() {
        loadScript('https://bot.aivolutive.com/static/js/lib/showdown.min.js', function() {
          loadScript('https://bot.aivolutive.com/static/js/script.js', function() {
            console.log('All scripts loaded successfully');
          });
        });
      });
    });
  });
});
