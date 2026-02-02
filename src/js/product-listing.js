import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");

const dataSource = new ExternalServices();
const listElement = document.querySelector(".product-list");
const myList = new ProductList(category, dataSource, listElement);

myList.init();
