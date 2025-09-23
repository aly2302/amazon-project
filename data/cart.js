export let cart = JSON.parse(localStorage.getItem('cart')); //getItem gets 1 argument that is what we saved into setItem.
                                                            // we also need to convert it back into an array with JSON.parse.
if(!cart) {
  cart = [{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
  }, {
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1
  }];
}

function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart)); //local storage only saves strings -> 1st(name what we want to save) , 2nd(the data we want to save)
}

export function addToCart(productId){
  let matchingItem;
    cart.forEach((cartItem) => {
        if(productId === cartItem.productId){
            matchingItem = cartItem;
        }
    });

    if(matchingItem) {
        matchingItem.quantity += 1;
    } else {
      cart.push({
        /*
        productId: productId,
        quantity: quantity
        */
        productId,
        quantity: 1
      });
    }
    saveToStorage();
}

export function removeFromCart(productId){
  const newCart = [];

  cart.forEach((cartItem) => {
    if(cartItem.productId !== productId){
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToStorage();
}

export function calculateCartQuantity(){
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}