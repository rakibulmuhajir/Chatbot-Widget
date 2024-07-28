
const BASE_URL = "http://localhost"; // Change this to your actual base URL when deploying
const RASA_SERVER_URL = `${BASE_URL}:5005/webhooks/rest/webhook`;
const CUSTOM_ACTION_URL = `${BASE_URL}:5055/webhook/`;

/**
 * scroll to the bottom of the chats after new message has been added to chat
 */
const converter = new showdown.Converter();
function scrollToBottomOfResults() {
    const terminalResultsDiv = document.getElementById("chats");
    terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
}

/**
 * Set user response on the chat screen
 * @param {String} message user message
 */
function setUserResponse(message) {
    const user_response = `<img class="userAvatar" src='./static/img/userAvatar.jpg'><p class="userMsg">${message} </p><div class="clearfix"></div>`;
    $(user_response).appendTo(".chats").show("slow");

    $(".usrInput").val("");
    scrollToBottomOfResults();
    showBotTyping();
    $(".suggestions").remove();
}

/**
 * returns formatted bot response
 * @param {String} text bot message response's text
 */
function getBotResponse(text) {
    botResponse = `<img class="botAvatar" src="./static/img/sara_avatar.png"/><span class="botMsg">${text}</span><div class="clearfix"></div>`;
    return botResponse;
}

/**
 * renders bot response on to the chat screen
 * @param {Array} response json array containing different types of bot response
 */
function setBotResponse(response) {
    // renders bot response after 500 milliseconds
    setTimeout(() => {
      hideBotTyping();
      if (response.length < 1) {
        // if there is no response from Rasa, send  fallback message to the user
        const fallbackMsg = "I am facing some issues, please try again later!!!";
  
        const BotResponse = `<img class="botAvatar" src="./static/img/sara_avatar.png"/><p class="botMsg">${fallbackMsg}</p><div class="clearfix"></div>`;
  
        $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
        scrollToBottomOfResults();
      } else {
        // if we get response from Rasa
        for (let i = 0; i < response.length; i += 1) {
          // check if the response contains "text"
          if (Object.hasOwnProperty.call(response[i], "text")) {
            if (response[i].text != null) {
              // convert the text to mardown format using showdown.js(https://github.com/showdownjs/showdown);
              let botResponse;
              let html = converter.makeHtml(response[i].text);
              html = html
                .replaceAll("<p>", "")
                .replaceAll("</p>", "")
                .replaceAll("<strong>", "<b>")
                .replaceAll("</strong>", "</b>");
              html = html.replace(/(?:\r\n|\r|\n)/g, "<br>");
              console.log(html);
              // check for blockquotes
              if (html.includes("<blockquote>")) {
                html = html.replaceAll("<br>", "");
                botResponse = getBotResponse(html);
              }
              // check for image
              if (html.includes("<img")) {
                html = html.replaceAll("<img", '<img class="imgcard_mrkdwn" ');
                botResponse = getBotResponse(html);
              }
              // check for preformatted text
              if (html.includes("<pre") || html.includes("<code>")) {
                botResponse = getBotResponse(html);
              }
              // check for list text
              if (
                html.includes("<ul") ||
                html.includes("<ol") ||
                html.includes("<li") ||
                html.includes("<h3")
              ) {
                html = html.replaceAll("<br>", "");
                // botResponse = `<img class="botAvatar" src="./static/img/sara_avatar.png"/><span class="botMsg">${html}</span><div class="clearfix"></div>`;
                botResponse = getBotResponse(html);
              } else {
                // if no markdown formatting found, render the text as it is.
                if (!botResponse) {
                  botResponse = `<img class="botAvatar" src="./static/img/sara_avatar.png"/><p class="botMsg">${response[i].text}</p><div class="clearfix"></div>`;
                }
              }
              // append the bot response on to the chat screen
              $(botResponse).appendTo(".chats").hide().fadeIn(1000);
            }
          }
  
          // check if the response contains "images"
          if (Object.hasOwnProperty.call(response[i], "image")) {
            if (response[i].image !== null) {
              const BotResponse = `<div class="singleCard"><img class="imgcard" src="${response[i].image}"></div><div class="clearfix">`;
  
              $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
            }
          }
  
          // check if the response contains "buttons"
          if (Object.hasOwnProperty.call(response[i], "buttons")) {
            if (response[i].buttons.length > 0) {
              addSuggestion(response[i].buttons);
            }
          }
  
          // check if the response contains "attachment"
          if (Object.hasOwnProperty.call(response[i], "attachment")) {
            if (response[i].attachment != null) {
              if (response[i].attachment.type === "video") {
                // check if the attachment type is "video"
                const video_url = response[i].attachment.payload.src;
  
                const BotResponse = `<div class="video-container"> <iframe src="${video_url}" frameborder="0" allowfullscreen></iframe> </div>`;
                $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
              }
            }
          }
          // check if the response contains "custom" message
          if (Object.hasOwnProperty.call(response[i], "custom")) {
            const { payload } = response[i].custom;
            if (payload === "quickReplies") {
              // check if the custom payload type is "quickReplies"
              const quickRepliesData = response[i].custom.data;
              showQuickReplies(quickRepliesData);
              return;
            }
  
            // check if the custom payload type is "pdf_attachment"
            if (payload === "pdf_attachment") {
              renderPdfAttachment(response[i]);
              return;
            }
  
            // check if the custom payload type is "dropDown"
            if (payload === "dropDown") {
              const dropDownData = response[i].custom.data;
              renderDropDwon(dropDownData);
              return;
            }
  
            // check if the custom payload type is "location"
            if (payload === "location") {
              $("#userInput").prop("disabled", true);
              getLocation();
              scrollToBottomOfResults();
              return;
            }
  
            // check if the custom payload type is "cardsCarousel"
            if (payload === "cardsCarousel") {
              const restaurantsData = response[i].custom.data;
              showCardsCarousel(restaurantsData);
              return;
            }
  
            // check if the custom payload type is "chart"
            if (payload === "chart") {
              /**
               * sample format of the charts data:
               *  var chartData =  { "title": "Leaves", "labels": ["Sick Leave", "Casual Leave", "Earned Leave", "Flexi Leave"], "backgroundColor": ["#36a2eb", "#ffcd56", "#ff6384", "#009688", "#c45850"], "chartsData": [5, 10, 22, 3], "chartType": "pie", "displayLegend": "true" }
               */
  
              const chartData = response[i].custom.data;
              const {
                title,
                labels,
                backgroundColor,
                chartsData,
                chartType,
                displayLegend,
              } = chartData;
  
              // pass the above variable to createChart function
              createChart(
                title,
                labels,
                backgroundColor,
                chartsData,
                chartType,
                displayLegend
              );
  
              // on click of expand button, render the chart in the charts modal
              $(document).on("click", "#expand", () => {
                createChartinModal(
                  title,
                  labels,
                  backgroundColor,
                  chartsData,
                  chartType,
                  displayLegend
                );
              });
              return;
            }
  
            // check of the custom payload type is "collapsible"
            if (payload === "collapsible") {
              const { data } = response[i].custom;
              // pass the data variable to createCollapsible function
              createCollapsible(data);
            }
          }
        }
        scrollToBottomOfResults();
      }
      $(".usrInput").focus();
    }, 500);
  }

/**
 * sends the user message to the rasa server,
 * @param {String} message user message
 */
async function send(message) {
    await new Promise((r) => setTimeout(r, 2000));
    sendToRasa(message);
}

function sendToRasa(message) {
    const payload = {
        sender: sender_id,
        message: message
    };

    fetch(RASA_SERVER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(botResponse => {
        console.log('Response from Rasa:', botResponse);
        if (botResponse.length > 0) {
            setBotResponse(botResponse);
        }
    })
    .catch(error => {
        console.error('Error sending message to Rasa:', error);
        setBotResponse("");
    });
}

function sendEventToRasa(eventType, eventData) {
    console.log(`Attempting to send event to Rasa: ${eventType}`, eventData);
    const message = `/trigger_event{"event_type":"${eventType}", "event_data":${JSON.stringify(eventData)}}`;
    sendToRasa(message);
}

function customActionTrigger(actionName) {
    fetch(CUSTOM_ACTION_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            next_action: actionName,
            tracker: {
                sender_id: sender_id,
            },
        })
    })
    .then(response => response.json())
    .then(botResponse => {
        console.log('Response from custom action:', botResponse);
        if (botResponse.responses) {
            setBotResponse(botResponse.responses);
        }
    })
    .catch(error => {
        console.error('Error triggering custom action:', error);
    });
}

function handlePageChange() {
    const page = window.location.pathname;
    let pageType = 'unknown';
    let pageData = {};

    if (page === '/') {
        pageType = 'home';
    } else if (page.includes('/collections/')) {
        pageType = 'collection';
        pageData.collectionHandle = page.split('/').pop();
    } else if (page.includes('/products/')) {
        pageType = 'product';
        pageData.productHandle = page.split('/').pop();
    }

    console.log(`Page changed: ${pageType}`, pageData);
    sendEventToRasa('page_change', { page_type: pageType, ...pageData });
}

window.handleAddToCart = function(variantId) {
    console.log(`Adding variant ${variantId} to cart`);
    fetch('/cart/add.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            items: [{
                id: variantId,
                quantity: 1
            }]
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Product added to cart:', data);
        sendEventToRasa('cart_updated', { action: 'add', variantId: variantId });
    })
    .catch((error) => {
        console.error('Error:', error);
        sendEventToRasa('cart_error', { action: 'add', variantId: variantId, error: error.message });
    });
};

window.handleCheckout = function() {
    console.log('Initiating checkout');
    fetch('/cart', {
        method: 'GET',
    })
    .then(response => response.text())
    .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const checkoutButton = doc.querySelector('form[action="/cart"] [name="checkout"]');
        if (checkoutButton) {
            const checkoutUrl = checkoutButton.closest('form').action;
            window.location.href = checkoutUrl;
            sendEventToRasa('checkout_initiated', {});
        } else {
            console.error('Checkout button not found');
            sendEventToRasa('checkout_error', { error: 'Checkout button not found' });
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        sendEventToRasa('checkout_error', { error: error.message });
    });
};

// Event listeners
window.addEventListener('load', handlePageChange);
window.addEventListener('popstate', handlePageChange);

document.body.addEventListener('click', (event) => {
    if (event.target.matches('.add-to-cart, .checkout')) {
        const buttonType = event.target.classList.contains('add-to-cart') ? 'add_to_cart' : 'checkout';
        console.log(`Button clicked: ${buttonType}`);
        sendEventToRasa('button_click', { buttonType });
    }
});

document.addEventListener('mouseout', (event) => {
    if (event.clientY <= 0) {
        console.log('Exit intent detected');
        sendEventToRasa('exit_intent', {});
        // Optionally trigger a custom action for exit intent
        customActionTrigger('action_handle_exit_intent');
    }
});

window.addEventListener('beforeunload', (event) => {
    console.log('Page unload detected');
    sendEventToRasa('exit_intent', {});
});

// User input handling
$(".usrInput").on("keyup keypress", (e) => {
    const keyCode = e.keyCode || e.which;
    const text = $(".usrInput").val();
    if (keyCode === 13) {
        if (text === "" || $.trim(text) === "") {
            e.preventDefault();
            return false;
        }
        // Disable the input to prevent double submissions
        $(".usrInput").prop('disabled', true);
        setUserResponse(text);
        send(text);
        e.preventDefault();
        return false;
    }
});

$("#sendButton").on("click", (e) => {
    const text = $(".usrInput").val();
    if (text === "" || $.trim(text) === "") {
        e.preventDefault();
        return false;
    }
    // Disable the input to prevent double submissions
    $(".usrInput").prop('disabled', true);
    setUserResponse(text);
    send(text);
    e.preventDefault();
    return false;
});

// Initialize
console.log("Custom event handling for Rasa Chat initialized successfully");
