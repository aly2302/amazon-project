import {calculateCartQuantity, removeFromCart, updateDeliveryOption} from '../data/cart.js';
// Always get the latest cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
import {products} from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {deliveryOptions} from '../data/deliveryOptions.js'; 

hello();

const today = dayjs();
const deliveryDate = today.add(7, 'days');
deliveryDate.format('dddd, MMMM D');

let cartSummaryHTML = ''; // EveryTime we loop the cart we add the html up here so we combine it.

cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct;

    products.forEach((product) => {
        if(product.id === productId) {
            matchingProduct = product;
        }
    });

    //Now that we have the matchingProduct we have access to all it's information: (image, price... etc.)


    // Fix typo and get correct delivery option
    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = deliveryOptions.find(option => option.id === deliveryOptionId) || deliveryOptions[0];
    const today = dayjs();
    const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
    );

    const dateString = deliveryDate.format(
        'dddd, MMMM D'  
    );

    cartSummaryHTML += `
      <div class="cart-item-container 
      js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
                Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                src="${matchingProduct.image}">

                <div class="cart-item-details">
                <div class="product-name">
                    ${matchingProduct.name}
                </div>
                <div class="product-price">
                    ${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                    <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                    Update
                    </span>
                    <input class="quantity-input">
                    <span class="save-quantity-link link-primary"> Save </span> 

                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                    Delete
                    </span>
                </div>
                </div>

                <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
                </div>
                </div>
            </div>
        </div>
    `;
});

function deliveryOptionsHTML(matchingProduct, cartItem){
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {
        const today = dayjs();
        const deliveryDate = today.add(
            deliveryOption.deliveryDays,
            'days'
        );
        const dateString = deliveryDate.format('dddd, MMMM D');
        const priceString = deliveryOption.priceCents === 0
            ? 'FREE'
            : `$${formatCurrency(deliveryOption.priceCents)} -`;
        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
        html += `
        <div class="delivery-option">
            <input type="radio"
                value="${deliveryOption.id}"
                ${isChecked ? 'checked' : ''}
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
            <div>
                <div class="delivery-option-date">
                    ${dateString}
                </div>
                <div class="delivery-option-price">
                    ${priceString} Shipping
                </div>
            </div>
        </div>
        `;
    });
    return html;
}


function renderCartSummary() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartSummaryHTML = '';
    cart.forEach((cartItem) => {
        const productId = cartItem.productId;
        let matchingProduct = products.find(product => product.id === productId);
        const deliveryOptionId = cartItem.deliveryOptionId;
        const deliveryOption = deliveryOptions.find(option => option.id === deliveryOptionId) || deliveryOptions[0];
        const today = dayjs();
        const deliveryDate = today.add(
            deliveryOption.deliveryDays,
            'days'
        );
        const dateString = deliveryDate.format('dddd, MMMM D');
        cartSummaryHTML += `
          <div class="cart-item-container 
          js-cart-item-container-${matchingProduct.id}">
                <div class="delivery-date">
                    Delivery date: ${dateString}
                </div>
                <div class="cart-item-details-grid">
                    <img class="product-image"
                    src="${matchingProduct.image}">
                    <div class="cart-item-details">
                    <div class="product-name">
                        ${matchingProduct.name}
                    </div>
                    <div class="product-price">
                        ${formatCurrency(matchingProduct.priceCents)}
                    </div>
                    <div class="product-quantity">
                        <span>
                        Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                        </span>
                        <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                        Update
                        </span>
                        <input class="quantity-input">
                        <span class="save-quantity-link link-primary"> Save </span> 
                        <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                        Delete
                        </span>
                    </div>
                    </div>
                    <div class="delivery-options">
                    <div class="delivery-options-title">
                        Choose a delivery option:
                    </div>
                    ${deliveryOptionsHTML(matchingProduct, cartItem)}
                    </div>
                </div>
            </div>
        `;
    });
    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
    attachCartListeners();
}

function attachCartListeners() {
    document.querySelectorAll('.js-delete-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
                removeFromCart(productId);
                renderCartSummary();
                updateCartQuantity();
            });
        });
    document.querySelectorAll('.delivery-option-input').forEach((input) => {
        input.addEventListener('change', (e) => {
            const productId = input.name.replace('delivery-option-', '');
            const cartItem = cart.find(item => item.productId === productId);
            if (cartItem) {
                cartItem.deliveryOptionId = input.value;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCartSummary();
            }
        });
    });
}

renderCartSummary();

function updateCartQuantity(){
    const cartQuantity = calculateCartQuantity();

    document.querySelector('.js-return-to-home-link')
        .innerHTML = `${cartQuantity} items`
}

updateCartQuantity();
