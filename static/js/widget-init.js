// Include the necessary CSS and Font links
const linkMaterialize = document.createElement('link');
linkMaterialize.rel = 'stylesheet';
linkMaterialize.type = 'text/css';
linkMaterialize.href = 'https://bot.aivolutive.com/static/css/materialize.min.css';
document.head.appendChild(linkMaterialize);

const linkStyle = document.createElement('link');
linkStyle.rel = 'stylesheet';
linkStyle.type = 'text/css';
linkStyle.href = 'https://bot.aivolutive.com/static/css/style.css';
document.head.appendChild(linkStyle);

const linkFontAwesome = document.createElement('link');
linkFontAwesome.rel = 'stylesheet';
linkFontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
linkFontAwesome.integrity = 'sha256-eZrrJcwDc/3uDhsdt61sL2oOBY362qM3lon1gyExkL0=';
linkFontAwesome.crossOrigin = 'anonymous';
document.head.appendChild(linkFontAwesome);

// Create the HTML structure for the chat widget
const chatWidgetHTML = `
  <div class="container">
    <div id="modal1" class="modal">
      <canvas id="modal-chart"></canvas>
    </div>
    <div class="widget">
      <div class="chat_header">
        <span class="chat_header_title">Sara</span>
        <span class="dropdown-trigger" href="#" data-target="dropdown1">
          <i class="material-icons"> more_vert </i>
        </span>
        <ul id="dropdown1" class="dropdown-content">
          <li><a href="#" id="clear">Clear</a></li>
          <li><a href="#" id="restart">Restart</a></li>
          <li><a href="#" id="close">Close</a></li>
        </ul>
      </div>
      <div class="chats" id="chats">
        <div class="clearfix"></div>
      </div>
      <div class="keypad">
        <textarea id="userInput" placeholder="Type a message..." class="usrInput"></textarea>
        <div id="sendButton">
          <i class="fa fa-paper-plane" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <div class="profile_div" id="profile_div">
      <img class="imgProfile" src="https://cdn.shopify.com/s/files/1/0003/4786/5124/files/SP_Logo_copy_resize_150x_21811a66-dd74-4093-8973-93303b49e68e.webp?v=1699920602" />
    </div>
    <div class="tap-target" data-target="profile_div">
      <div class="tap-target-content">
        <h5 class="white-text">Hey there 👋</h5>
        <p class="white-text">I can help you get order status and search products for you.</p>
      </div>
    </div>
  </div>
`;

document.getElementById('chatbot-widget-container').innerHTML = chatWidgetHTML;

// Include the necessary scripts
const scriptJQuery = document.createElement('script');
scriptJQuery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js';
document.body.appendChild(scriptJQuery);

const scriptMaterialize = document.createElement('script');
scriptMaterialize.src = 'https://bot.aivolutive.com/static/js/lib/materialize.min.js';
document.body.appendChild(scriptMaterialize);

const scriptUUID = document.createElement('script');
scriptUUID.src = 'https://bot.aivolutive.com/static/js/lib/uuid.min.js';
document.body.appendChild(scriptUUID);

const scriptChart = document.createElement('script');
scriptChart.src = 'https://bot.aivolutive.com/static/js/lib/chart.min.js';
document.body.appendChild(scriptChart);

const scriptShowdown = document.createElement('script');
scriptShowdown.src = 'https://bot.aivolutive.com/static/js/lib/showdown.min.js';
document.body.appendChild(scriptShowdown);

// Include the main script for the widget functionality
const scriptMain = document.createElement('script');
scriptMain.src = 'https://bot.aivolutive.com/static/js/script.js';
document.body.appendChild(scriptMain);
