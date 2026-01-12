import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // This function adds a product to the shopping cart stored in local storage. We pass in a product object to be added to the cart. If you look at the product JSONs, each product has an id, name, price, and other details, each one is an object. So when we add a product to the cart, we are adding the entire product object and we don't need to extract individual properties.
  // Get current cart from local storage or start with an empty array. The getLocalStorage function handles parsing JSON. It was already implemented in utils.mjs but wasn't being used here before. With it, we can create a list to store cart items.
  let cartList = getLocalStorage("so-cart") || [];
  // Add the new product to the cart. The cartList array now holds all items in the cart, including the new product but hasn't been saved to local storage yet.
  cartList.push(product);
  // Now we save the updated cart back to local storage
  setLocalStorage("so-cart", cartList);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
