import {
  countCartItems,
  getLocalStorage,
  loadHeaderFooter,
  setLocalStorage,
} from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = combineDuplicateItems(getLocalStorage("so-cart") || []);
  setLocalStorage("so-cart", cartItems);
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const imageSrc =
    item.Images?.PrimaryMedium ||
    item.Images?.PrimaryLarge ||
    item.Image ||
    "/images/camping-products.jpg";
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${imageSrc}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty:
    <input type="number" value="${item.Quantity || 1}" min="1" class="cart-card__quantity-input" data-id="${item.Id}"/>
  <p class="cart-card__price">$${item.FinalPrice}</p>
    <span class="cart-card__remove" data-id="${item.Id}">❌</span>
</li>`;

  return newItem;
}

function removeFromCart(itemId) {
  /*
Remove an item from the cart by its ID
*/
  const cartItems = combineDuplicateItems(getLocalStorage("so-cart") || []);
  const updatedCart = cartItems.filter((item) => item.Id !== itemId);
  setLocalStorage("so-cart", updatedCart);
  renderCartContents();
  getCartTotal();
  countCartItems();
}
// Handle click event for removing items from the cart
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("cart-card__remove")) {
    const itemId = event.target.dataset.id;
    removeFromCart(itemId);
  }
});

function combineDuplicateItems(items) {
  /* Function to normalize cart items by combining quantities of identical items */
  const byId = new Map();
  items.forEach((item) => {
    const quantity = Number(item.Quantity) || 1;
    const existing = byId.get(item.Id);
    if (existing) {
      existing.Quantity += quantity;
    } else {
      byId.set(item.Id, { ...item, Quantity: quantity });
    }
  });
  return Array.from(byId.values());
}

function getCartTotal() {
  /* Function to calculate and display the total price of items in the cart */
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotal = document.querySelector(".cart-total");
  const cartItems = combineDuplicateItems(getLocalStorage("so-cart") || []);
  const finalTotal = cartItems.reduce(
    (total, item) => total + item.FinalPrice * (Number(item.Quantity) || 1),
    0,
  );
  cartTotal.textContent = `Total: $${finalTotal.toFixed(2)}`;
  if (finalTotal === 0) {
    cartFooter.classList.add("hide");
  } else {
    cartFooter.classList.remove("hide");
  }
  return finalTotal;
}

document.addEventListener("change", (event) => {
  /* Event listener for handling quantity input changes in the cart */
  if (event.target.classList.contains("cart-card__quantity-input")) {
    const itemId = event.target.dataset.id;
    const quantity = Math.max(1, parseInt(event.target.value, 10) || 1);
    const cartItems = combineDuplicateItems(getLocalStorage("so-cart") || []);
    const item = cartItems.find((cartItem) => cartItem.Id === itemId);
    if (item) {
      item.Quantity = quantity;
      setLocalStorage("so-cart", cartItems);
      renderCartContents();
      getCartTotal();
      countCartItems();
    }
  }
});

renderCartContents();
getCartTotal();
