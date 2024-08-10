// Include the necessary CSS and Font links
/*const linkMaterialize = document.createElement('link');
linkMaterialize.rel = 'stylesheet';
linkMaterialize.type = 'text/css';
linkMaterialize.href = 'https://bot.aivolutive.com/static/css/materialize.min.css';
document.head.appendChild(linkMaterialize);*/

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
    <div class="widget">
      <div class="chat_header">
        <span class="chat_header_title">SecPro Bot</span>
        <span class="dropdown-trigger" id="close" href="#" data-target="dropdown1">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>
        </span>
        <!--
        <ul id="dropdown1" class="dropdown-content">
          <li><a href="#" id="clear">Clear</a></li>
          <li><a href="#" id="restart">Restart</a></li>
          <li><a href="#" id="close">Close</a></li>
        </ul>
        -->
      </div>
      <div class="chats" id="chats">
        <div class="clearfix"></div>
      </div>
     <div class="keypad">
  <input type="text" class="usrInput" placeholder="Start by saying hello/hi....">
  <button id="sendButton">
    <svg class="send-icon" viewBox="0 0 24 24">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
    </svg>
  </button>
</div>
    </div>
    <div class="profile_div" id="profile_div">
      <img class="imgProfile" src="https://cdn.shopify.com/s/files/1/0003/4786/5124/files/Security-pro-logo.png?v=1682665951" />
    </div>
  
  </div>
`;

document.getElementById('chatbot-widget-container').innerHTML = chatWidgetHTML;

// Include the necessary scripts
const scriptJQuery = document.createElement('script');
scriptJQuery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js';
document.body.appendChild(scriptJQuery);
/*
const scriptMaterialize = document.createElement('script');
scriptMaterialize.src = 'https://bot.aivolutive.com/static/js/lib/materialize.min.js';
document.body.appendChild(scriptMaterialize);
*/
const scriptUUID = document.createElement('script');
scriptUUID.src = 'https://bot.aivolutive.com/static/js/lib/uuid.min.js';
document.body.appendChild(scriptUUID);
/*
const scriptChart = document.createElement('script');
scriptChart.src = 'https://bot.aivolutive.com/static/js/lib/chart.min.js';
document.body.appendChild(scriptChart);
*/
const scriptShowdown = document.createElement('script');
scriptShowdown.src = 'https://bot.aivolutive.com/static/js/lib/showdown.min.js';
document.body.appendChild(scriptShowdown);

// Include the main script for the widget functionality
const scriptMain = document.createElement('script');
scriptMain.src = 'https://bot.aivolutive.com/static/js/script.js';
document.body.appendChild(scriptMain);
