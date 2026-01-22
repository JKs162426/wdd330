import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const dataSource = new ProductData("tents");
const productListElement = document.querySelector(".product-list");

const productList = new ProductList("tents", dataSource, productListElement);
productList.init();
