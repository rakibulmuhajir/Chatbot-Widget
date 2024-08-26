/**
 *  adds vertically stacked buttons as a bot response
 * @param {Array} suggestions buttons json array
 */
function addSuggestion(suggestions) {
    setTimeout(() => {
        const suggLength = suggestions.length;
        $(
            ' <div class="singleCard"> <div class="suggestions"><div class="menu"></div></div></diV>',
        )
            .appendTo(".chats")
            .hide()
            .fadeIn(1000);
        // Loop through suggestions
        for (let i = 0; i < suggLength; i += 1) {
            const isAddToCart = suggestions[i].payload && suggestions[i].payload.startsWith('/add_to_cart');
            const buttonClass = isAddToCart ? 'menuChips add-to-cart-button' : 'menuChips';
            let variantId = '';
            if (isAddToCart) {
                variantId = suggestions[i].payload.split('=')[1].replace(/"/g, ''); 
            }
            $(
                `<div class="${buttonClass}" data-payload='${suggestions[i].payload}' ${isAddToCart ? `data-variant-id="${variantId}"` : ''}>${suggestions[i].title}</div>`,
            ).appendTo(".menu");
        }
        scrollToBottomOfResults();
    }, 1000);
}

// on click of suggestion's button, get the title value and send it to rasa
$(document).on("click", ".menu .menuChips", function (e) {
    const text = this.innerText;
    const payload = this.getAttribute("data-payload");
    console.log("payload: ", payload);
    
    if ($(this).hasClass('add-to-cart-button')) {
        e.preventDefault();
        const variantId = this.getAttribute("data-variant-id");
        handleAddToCart(variantId, 1);
    } else {
        setUserResponse(text);
        send(payload);
    }
    
    // delete the suggestions once user click on it.
    $(".suggestions").remove();
});
