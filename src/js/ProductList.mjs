import { renderListWithTemplate } from "./utils.mjs";

class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

async init() {
    const products = await this.dataSource.getData();
    console.log("products:", products);
    this.renderList(products);
  }

productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="product_pages/?product=${product.Id}">
        <img src="${product.Image}" alt="${product.Name}">
        <h3 class="card__brand">${product.Brand ?? ""}</h3>
        <h2 class="card__name">${product.NameWithoutBrand ?? product.Name}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
  `;
}

renderList(products, position = "afterbegin", clear = true) {
  renderListWithTemplate(
    this.productCardTemplate.bind(this),
    this.listElement,
    products,
    position,
    clear
  );
}
}
export default ProductList;