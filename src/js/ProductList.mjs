/*  
The ProductList class is responsible for rendering a list of products on the page from an array of product data.
*/

import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    return `
        <li class="product-card">
        <a href="product_pages/?product=${product.Id}">
            <img src="${product.Image}" alt="Image of ${product.NameWithoutBrand}">
            <h2 class="card__brand">${product.Brand.Name}</h2>
            <h3 class="card__name">${product.NameWithoutBrand}</h3>
            <p class="product-card__price">$${product.ListPrice}</p>
        </a>
    </li>`;
}



export default class ProductList {
    /*
    
    */
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        const list = await this.dataSource.getData();
        // Temporarily remove tents without a product page
        // =============================================
        const excludedIds = ["989CG", "880RT"];
        const filteredList = list.filter(product => !excludedIds.includes(product.Id));
        this.renderList(filteredList);
        // =============================================
    }

    renderList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }
}