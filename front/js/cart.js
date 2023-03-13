let firstName = document.querySelector("#firstname");
//firstName.addEventListener()

/*API call on 3000 port*/
function apiRecovery() {
    fetch("http://localhost:3000/api/products")
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (sofas) {

            console.table(sofas);

            //recovery of the array in the local storage
            let cartItems = JSON.parse(localStorage.getItem("cartArray"));

            console.table("contenu du local storage", cartItems);

            if (cartItems == null) {
                console.log("cartItems n'existe pas");

            } else {

                cartItems.sort(function (x, y) {
                    let a = x.shoppedSofaId.toUpperCase(),
                        b = y.shoppedSofaId.toUpperCase();
                    return a == b ? 0 : a > b ? 1 : -1;
                });

                let cartQuantities = [];
                let sumItems = 0;
                let cartSubtotals = [];
                let subTotals = 0;

                /*Creation of a loop to create as many elements in the DOM as sofas*/
                for (let i = 0; i < cartItems.length; i++) {

                    let itemId = cartItems[i].shoppedSofaId;
                    let itemColor = cartItems[i].shoppedSofaColor;
                    let itemQuantity = cartItems[i].shoppedSofaQuantity;

                    const itemsFromCart = sofas.find(elt => elt._id == cartItems[i].shoppedSofaId);
                    let itemsImg = itemsFromCart.imageUrl;
                    let itemsName = itemsFromCart.name;
                    let itemsPrice = itemsFromCart.price;

                    cartQuantities.push(cartItems[i].shoppedSofaQuantity);

                    //Creation of the elements DOM
                    const cartItem = document.createElement("article");
                    cartItem.setAttribute("class", "cart__item");
                    cartItem.setAttribute("data-id", itemId);
                    cartItem.setAttribute("data-color", itemColor);
                    document.getElementById('cart__items').appendChild(cartItem);

                    const cartItemImg = document.createElement("div");
                    cartItemImg.setAttribute("class", "cart__item__img");
                    cartItem.appendChild(cartItemImg);

                    const itemImg = document.createElement("img");
                    itemImg.setAttribute("src", itemsImg);
                    itemImg.setAttribute("alt", "Photographie d'un canapé");
                    cartItemImg.appendChild(itemImg);


                    const cartItemContent = document.createElement("div");
                    cartItemContent.setAttribute("class", "cart__item__content");
                    cartItem.appendChild(cartItemContent);

                    const cartItemContentDescription = document.createElement("div");
                    cartItemContentDescription.setAttribute("class", "cart__item__content__description");
                    cartItemContent.appendChild(cartItemContentDescription);

                    const itemName = document.createElement("h2");
                    itemName.textContent = itemsName;
                    cartItemContentDescription.appendChild(itemName);

                    const itemColorPTag = document.createElement("p");
                    itemColorPTag.textContent = itemColor;
                    cartItemContentDescription.appendChild(itemColorPTag);

                    const itemPricePTag = document.createElement("p");
                    itemPricePTag.textContent = itemsPrice + " €";
                    cartItemContentDescription.appendChild(itemPricePTag);

                    const cartItemContentSettings = document.createElement("div");
                    cartItemContentSettings.setAttribute("class", "cart__item__content__settings");
                    cartItemContent.appendChild(cartItemContentSettings);

                    const cartItemContentSettingsQuantity = document.createElement("div");
                    cartItemContentSettingsQuantity.setAttribute("class", "cart__item__content__settings__quantity");
                    cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);

                    const itemQuantityPTag = document.createElement("p");
                    itemQuantityPTag.textContent = "Qté : " + itemQuantity;
                    cartItemContentSettingsQuantity.appendChild(itemQuantityPTag);

                    const quantityInput = document.createElement("input");
                    quantityInput.setAttribute("type", "number");
                    quantityInput.setAttribute("class", "itemQuantity");
                    quantityInput.setAttribute("name", "itemQuantity");
                    quantityInput.setAttribute("min", "1");
                    quantityInput.setAttribute("max", "100");
                    quantityInput.setAttribute("value", itemQuantity);

                    //Check if the quantity for each item is between 1 and 100
                    let minItemQuantity = quantityInput.value < 1;
                    let maxItemQuantity = quantityInput.value > 100;
                    if (minItemQuantity) {
                        alert("la quantité minimum pour un article est 1. La quantité de " + itemsName + " a été mise à jour en conséquence. Merci de renseigner une quantité comprise entre 1 et 100");
                        cartItems[i].shoppedSofaQuantity = 1;
                        localStorage.setItem("cartArray", JSON.stringify(cartItems));
                        location.reload();
                    } else if (maxItemQuantity) {
                        alert("la quantité maximum pour un article est 100. La quantité de " + itemsName + " a été mise à jour en conséquence. Merci de renseigner une quantité comprise entre 1 et 100");
                        cartItems[i].shoppedSofaQuantity = 100;
                        localStorage.setItem("cartArray", JSON.stringify(cartItems));
                        location.reload();
                    } else {
                        quantityInput.addEventListener("change", function () {
                            console.log([i], quantityInput.value);
                            cartItems[i].shoppedSofaQuantity = Number(quantityInput.value);
                            localStorage.setItem("cartArray", JSON.stringify(cartItems));
                            location.reload();
                        });
                    }
                    cartItemContentSettingsQuantity.appendChild(quantityInput);

                    const cartItemContentSettingsDelete = document.createElement("div");
                    cartItemContentSettingsDelete.setAttribute("class", "cart__item,,content_settings__delete");
                    cartItemContentSettingsQuantity.appendChild(cartItemContentSettingsDelete);

                    const deletePTag = document.createElement("input");
                    deletePTag.setAttribute("class", "deleteItem");
                    deletePTag.setAttribute("type", "button");
                    deletePTag.setAttribute("value", "Supprimer");
                    cartItemContentSettingsDelete.appendChild(deletePTag);

                    //deletion of a sofa when the "supprimer" the user clicks on supprimer
                    deletePTag.addEventListener("click", function () {
                        cartItems.splice([i], 1);
                        localStorage.setItem("cartArray", JSON.stringify(cartItems));
                        JSON.parse(localStorage.getItem("cartArray"));
                        location.reload();
                    })

                    //calculates the subtotal for each kind of item
                    let itemSubtotalCalcul = (unitPrice, quantity) => {
                        return unitPrice * quantity;
                    }

                    let itemSubtotal = itemSubtotalCalcul(itemsFromCart.price, cartQuantities[i]);
                    cartSubtotals.push(itemSubtotal);

                }

                console.log("contenu du panier", cartItems);

                //calculates the total quantity of items in the cart
                for (let j = 0; j < cartQuantities.length; j++) {
                    cartQuantities
                    sumItems += cartQuantities[j];
                }

                document.getElementById('totalQuantity').textContent = sumItems;

                //calcultes the total in € of the items in the cart   
                for (let k = 0; k < cartSubtotals.length; k++) {
                    cartSubtotals
                    subTotals += cartSubtotals[k];
                }

                document.getElementById('totalPrice').textContent = subTotals;
            }
        })
        //Error message when the API has not been reached 
        .catch(function (err) {
            console.log("erreur connexion API");
            alert("Votre page web n'a pas pu charger correctement, merci de vérifier votre connexion et de réessayer plus tard");
        });
}

apiRecovery();