document.addEventListener('DOMContentLoaded', function() {
  // Ensure the widget container exists
  var widgetContainer = document.getElementById('chat-widget-container');
  if (!widgetContainer) {
    console.error('Chat widget container not found');
    return;
  }

  // Create the HTML structure for the widget
  widgetContainer.innerHTML = `
    <div class="chat-widget">
      <div class="chat-header">
        <img id="profile_div" class="imgProfile" src="https://bot.aivolutive.com/static/img/botAvatar.png" alt="Bot Avatar">
        <span>Chat with us</span>
      </div>
      <div class="chat-body">
        <div class="chats"></div>
        <div class="tap-target"></div>
      </div>
      <div class="chat-footer">
        <input type="text" id="userInput" placeholder="Type a message...">
        <button id="sendButton">Send</button>
      </div>
      <div class="profile_div"></div>
      <div class="widget"></div>
    </div>
  `;

  // Load the CSS
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'https://bot.aivolutive.com/static/css/style.css';
  document.head.appendChild(link);

  // Function to load scripts in order
  function loadScript(src, callback) {
    var script = document.createElement('script');
    script.src = src;
    script.async = false; // Ensures scripts load in order
    script.onload = callback;
    script.onerror = function() { console.error('Failed to load script: ' + src); };
    document.head.appendChild(script); // Append to head for better control
  }

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
