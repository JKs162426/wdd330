import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

console.log("main.js loaded");

const dataSource = new ProductData("tents");
const listElement = document.querySelector(".product-list");
console.log(listElement);

const productList = new ProductList("tents", dataSource, listElement);

productList.init();