import { countCartItems, getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();
        const addToCartButton = document.getElementById('addToCartButton');
        if (addToCartButton) {
            addToCartButton.addEventListener('click', this.addProductToCart.bind(this));
        }
    }

    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];
        const quantityInput = document.getElementById('productQuantity');
        const quantity = Math.max(1, parseInt(quantityInput?.value, 10) || 1);
        const existingItem = cartItems.find(item => item.Id === this.product.Id);
        if (existingItem) {
            existingItem.Quantity = (Number(existingItem.Quantity) || 1) + quantity;
        } else {
            cartItems.push({ ...this.product, Quantity: quantity });
        }
        setLocalStorage("so-cart", cartItems);
        countCartItems();
    }

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

function productDetailsTemplate(product) {
    document.querySelector('h2').textContent = product.Brand.Name;
    document.querySelector('h3').textContent = product.NameWithoutBrand;

    const productImage = document.getElementById('productImage');
    productImage.src = product.Images.PrimaryExtraLarge;
    productImage.alt = product.NameWithoutBrand;

    document.getElementById('productPrice').textContent = product.FinalPrice;
    document.getElementById('productColor').textContent = product.Colors[0].ColorName;
    document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;

    document.getElementById('addToCartButton').dataset.id = product.Id;
}