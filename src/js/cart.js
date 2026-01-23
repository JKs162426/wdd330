import { countCartItems, getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const cartFooter = document.querySelector(".cart-footer");
const cartTotalEl = document.querySelector(".cart-total");

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  if (cartItems.length > 0) {
    cartFooter.classList.remove("hide");
    const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
    cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
  } else {
    cartFooter.classList.add("hide");
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
    <span class="cart-card__remove" data-id="${item.Id}">❌</span>
</li>`;

  return newItem;
}

function removeFromCart(itemId) {
  /*
Remove an item from the cart by its ID
*/
  const cartItems = getLocalStorage("so-cart") || [];
  const updatedCart = cartItems.filter((item) => item.Id !== itemId);
  localStorage.setItem("so-cart", JSON.stringify(updatedCart));
  renderCartContents();
  countCartItems();
}
// Handle click event for removing items from the cart
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("cart-card__remove")) {
    const itemId = event.target.dataset.id;
    removeFromCart(itemId);
  }
});

countCartItems();
renderCartContents();
