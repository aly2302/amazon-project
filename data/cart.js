export let cart = JSON.parse(localStorage.getItem('cart'));
// we also need to convert it back into an array with JSON.parse.
if(!cart) {
  cart = [{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '1'
  }, {
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionId: '2'
  }];
  localStorage.setItem('cart', JSON.stringify(cart));
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
        productId,
        quantity: 1,
        deliveryOptionId: '1'
      });
    }
    saveToStorage();
}

export function removeFromCart(productId){
  const index = cart.findIndex(item => item.productId === productId);
  if (index !== -1) {
    cart.splice(index, 1);
  }
  saveToStorage();
}

export function calculateCartQuantity(){
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}