import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => (convertedJSON[key] = value));
  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.Quantity,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.services = new ExternalServices();
    this.list = [];
    this.subtotal = 0;
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSubTotal();
    this.displaySubtotal();

    const zipInput = document.querySelector("#customer-zip");
    zipInput.addEventListener("change", () => {
      this.calculateOrderTotal();
    });

    const form = document.querySelector("form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.checkout(form);
      });
    }
  }

  calculateItemSubTotal() {
    // calculate and display the total dollar amount of the items in the cart, and the number of items.
    this.subtotal = this.list.reduce(
      (total, item) => total + item.FinalPrice * item.Quantity,
      0,
    );

    this.itemTotal = this.list.reduce(
      (count, item) => count + item.Quantity,
      0,
    );

    console.log(this.list);
    console.table(this.list);
  }

  displaySubtotal() {
    const root = document.querySelector(this.outputSelector);
    root.querySelector("#subtotal").innerText = `$${this.subtotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    // calculate the tax and shipping amounts. Add those to the cart total to figure out the order total
    this.tax = this.subtotal * 0.06;
    this.shipping = this.itemTotal > 0 ? 10 + (this.itemTotal - 1) * 2 : 0;
    this.orderTotal = this.subtotal + this.tax + this.shipping;

    // display the totals.
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // once the totals are all calculated display them in the order summary page
    const root = document.querySelector(this.outputSelector);
    if (!root) return;

    root.querySelector("#subtotal").innerText = `$${this.subtotal.toFixed(2)}`;
    root.querySelector("#tax").innerText = `$${this.tax.toFixed(2)}`;
    root.querySelector("#shipping").innerText = `$${this.shipping.toFixed(2)}`;
    root.querySelector("#orderTotal").innerText =
      `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    // 1) convierte form -> objeto usando los name=""
    const order = formDataToJSON(form);

    // 2) agrega lo que el server requiere
    order.orderDate = new Date().toISOString();
    order.items = packageItems(this.list);
    order.shipping = this.shipping; // número
    order.tax = this.tax.toFixed(2); // string como en ejemplo
    order.orderTotal = this.orderTotal.toFixed(2); // string como en ejemplo

    // 3) POST al server
    const response = await this.services.checkout(order);
    console.log("✅ Server response:", response);

    return response;
  }
}
