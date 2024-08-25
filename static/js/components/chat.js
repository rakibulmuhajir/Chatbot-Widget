// At the top of your script, add this line to get the exit intent message
const exitIntentMessage = window.chatWidgetConfig?.exitIntentMessage || "Before you go! Here's a special offer just for you.";
const helpMessage = `Hello! I am Rambo, Security Pro USA's top chatbot. I can assist you with product searches, order status updates, and store policy questions. Looking for a discount 🤫? Just ask!`;
/**
 * scroll to the bottom of the chat after new message has been added to chat
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
    const user_response = `<div class="message-container user">
                             <img class="userAvatar" src='https://bot.aivolutive.com/static/img/userAvatar.jpg'>
                             <p class="userMsg">${message}</p>
                           </div>`;
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
    return `<div class="message-container bot">
              <img class="botAvatar" src="https://cdn.shopify.com/s/files/1/0003/4786/5124/files/Security-pro-logo.png?v=1723305472"/>
              <p class="botMsg">${text}</p>
            </div>`;
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
  
        const BotResponse = `<img class="botAvatar" src="https://cdn.shopify.com/s/files/1/0003/4786/5124/files/Security-pro-logo.png?v=1723305472"/><p class="botMsg">${fallbackMsg}</p><div class="clearfix"></div>`;
  
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
                //typeBotResponse(html);
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
                  botResponse = `<img class="botAvatar" src="https://cdn.shopify.com/s/files/1/0003/4786/5124/files/Security-pro-logo.png?v=1723305472"/><p class="botMsg">${response[i].text}</p><div class="clearfix"></div>`;
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
  
         if (Object.hasOwnProperty.call(response[i], "buttons")) {
    console.log("Button or add_to_cart response detected:", response[i]);
    
    if (response[i].buttons.length > 0) {
        addSuggestion(response[i].buttons);
    } else if (response[i].custom && response[i].custom.payload === "add_to_cart") {
        console.log("Add to cart action detected");
        const { variantId, quantity } = response[i].custom;
        handleAddToCart(variantId, quantity || 1);
    } else {
        console.log("Unexpected button or add_to_cart structure:", response[i]);
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
      // Re-enable the user input after setting the bot's response
        $(".usrInput").prop('disabled', false);
        $(".usrInput").focus();
    }, 500);
  }

function typeBotResponse(text) {
    const botResponseDiv = document.createElement("div");
    botResponseDiv.className = "botMsg";
    botResponseDiv.innerHTML = '<img class="botAvatar" src="https://cdn.shopify.com/s/files/1/0003/4786/5124/files/Security-pro-logo.png?v=1723305472"/>';
    document.querySelector(".chats").appendChild(botResponseDiv);

    let index = 0;
    function typeWriter() {
        if (index < text.length) {
            botResponseDiv.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, 50);
        } else {
            botResponseDiv.innerHTML += '<div class="clearfix"></div>';
            scrollToBottomOfResults();
        }
    }
    typeWriter();
}

/**
 * sends the user message to the rasa server,
 * @param {String} message user message
 */
async function send(message) {
    try {
        await new Promise((r) => setTimeout(r, 2000));
        await sendToRasa(message);
    } catch (error) {
        console.error('Error sending message to Rasa:', error);
        // Re-enable the user input in case of error
        $(".usrInput").prop('disabled', false);
    }
}

function sendToRasa(message) {
    const payload = {
        sender: sender_id,
        message: message
    };

    return fetch(RASA_SERVER_URL, {
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
            /* botResponse.forEach(response => {
                if (response.text) {
                    typeBotResponse(response.text);
                }
             });*/
        } else {
            // If no response, still re-enable the input
            $(".usrInput").prop('disabled', false);
        }
    })
    .catch(error => {
        console.error('Error sending message to Rasa:', error);
        setBotResponse("");
        // Re-enable the input in case of error
        $(".usrInput").prop('disabled', false);
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
         setImmediateBotResponse(helpMessage);
    } else if (/*page.includes('/collections/') && */page.includes('/products/')) {
        pageType = 'product';
        
        // Extracting product ID using ShopifyAnalytics object
        if (typeof ShopifyAnalytics !== 'undefined' && ShopifyAnalytics.meta && ShopifyAnalytics.meta.product) {
            const productId = ShopifyAnalytics.meta.product.id;
            pageData.productId = productId;
        } else {
            console.error("Product ID not found in ShopifyAnalytics object.");
            return;
        }

        const pathParts = page.split('/');
        pageData.collectionHandle = pathParts[pathParts.length - 3];
        pageData.productHandle = pathParts[pathParts.length - 1];
    } else if (page.includes('/collections/')) {
        pageType = 'collection';
        pageData.collectionHandle = page.split('/').pop();
    } else {
        pageType = 'other';
    }

    console.log(`Page changed: ${pageType}`, pageData);

    if (pageType === 'product') {
        sendEventToRasa('page_change', { page_type: pageType, ...pageData });
    }
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

function setImmediateBotResponse(message) {
    hideBotTyping();
    const botResponse = `<img class="botAvatar" src="https://cdn.shopify.com/s/files/1/0003/4786/5124/files/Security-pro-logo.png?v=1723305472"/>
        <p class="botMsg">${message}</p><div class="clearfix"></div>`;
    $(botResponse).appendTo(".chats").hide().fadeIn(1000);
    scrollToBottomOfResults();
}

// Function to check if exit intent message has been shown
function hasExitIntentMessageBeenShown() {
    return localStorage.getItem('exitIntentMessageShown') === 'true';
}

// Function to set exit intent message as shown
function setExitIntentMessageAsShown() {
    localStorage.setItem('exitIntentMessageShown', 'true');
}

// Function to reset exit intent message state
function resetExitIntentMessageState() {
    localStorage.removeItem('exitIntentMessageShown');
}

// Modified handleExitIntent function
function handleExitIntent(event) {
    if (event.clientY <= 0 && !hasExitIntentMessageBeenShown()) {
        console.log('Exit intent detected');
        
        // Show the exit intent message
        setImmediateBotResponse(exitIntentMessage);
        
        // Mark the exit intent message as shown
        setExitIntentMessageAsShown();
    }
}

// Add event listener for page unload
window.addEventListener('beforeunload', resetExitIntentMessageState);

// Existing event listener for mouseout
document.addEventListener('mouseout', handleExitIntent);

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
