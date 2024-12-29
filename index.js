let productsList = document.querySelector(".products-list");
let cartIcon = document.querySelector(".cart-icon");
let cartText = document.querySelector(".cart-text");
let closeBtn = document.querySelector(".close-btn");
let overlay = document.querySelector(".overlay");
let navbar = document.querySelector(".navbar");
let navTogglers = document.querySelectorAll(".nav-toggler");
let cartList = document.querySelector(".cart-list");
let totalText = document.querySelector(".total-text");
let listProducts = [];
let carts = [];

function addEventOnElements(elements, eventType, callback) {
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    element.addEventListener(eventType, callback);
  }
}

function toggleNavbar() {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);

function initApp() {
  fetch("products.json")
    .then((res) => res.json())
    .then((data) => {
      listProducts = data;
      displayData();
      if (localStorage.getItem("cart")) {
        carts = JSON.parse(localStorage.getItem("cart"));
        addCartToHtml();
      }
    });
}

function displayData() {
  productsList.innerHTML = "";
  if (listProducts.length > 0) {
    listProducts.forEach((item) => {
      let product = document.createElement("div");
      product.classList.add("item");
      product.dataset.id = item.id;

      product.innerHTML = `
            <img src="${item.image}" />
            <h2>${item.category}</h2>
            <p>${item.name}</p>
            <span>$${item.price}</span>
            <button class="add-cart">Add To Cart</button>
       `;
      productsList.appendChild(product);
    });
  }
}

productsList.addEventListener("click", (e) => {
  let position = e.target;
  if (position.classList.contains("add-cart")) {
    addToCart(position.parentElement.dataset.id);
  }
});

cartList.addEventListener("click", (e) => {
  let position = e.target;
  if (
    position.classList.contains("decrement") ||
    position.classList.contains("increment")
  ) {
    let id = position.parentElement.parentElement.dataset.id;
    let type = position.classList[0];
    changeQuantity(type, id);
  }
});

function changeQuantity(type, id) {
  let position = carts.findIndex((item) => item.product_id == id);

  if (position >= 0) {
    switch (type) {
      case "increment":
        carts[position].quantity = carts[position].quantity + 1;
        break;
      default:
        let changeValue = (carts[position].quantity =
          carts[position].quantity - 1);
        if (changeValue <= 0) {
          carts.splice(position, 1);
        } else {
          carts[position].quantity = changeValue;
        }
        break;
    }
  }

  addCartToHtml();
  addCartToMemory();
}

function addCartToMemory() {
  localStorage.setItem("cart", JSON.stringify(carts));
}

function addToCart(productId) {
  let position = carts.findIndex((item) => item.product_id == productId);

  if (carts.length <= 0) {
    carts = [
      {
        product_id: productId,
        quantity: 1,
      },
    ];
  } else if (position < 0) {
    carts.push({
      product_id: productId,
      quantity: 1,
    });
  } else {
    carts[position].quantity = carts[position].quantity + 1;
  }
  addCartToHtml();
  addCartToMemory();
}

function addCartToHtml() {
  cartList.innerHTML =
    "<img src='illustration-empty-cart.svg' class='empty-icon' />";
  let totalQuantity = 0;
  let totalPrice = 0;
  if (carts.length > 0) {
    cartList.innerHTML = "";
    carts.forEach((cart) => {
      totalQuantity = totalQuantity + cart.quantity;

      let position = listProducts.findIndex(
        (item) => item.id == cart.product_id
      );
      let info = listProducts[position];
      totalPrice = (totalPrice + info.price) * cart.quantity;

      let product = document.createElement("div");
      product.dataset.id = cart.product_id;
      product.classList.add("cart-item");
      product.innerHTML = `
            <img src="${info.image}" />
            <h3>${info.category}</h3>
            <div class="quantity">
                <ion-icon name="remove-outline" class="decrement"></ion-icon>
                <span>${cart.quantity}</span>
                <ion-icon name="add-outline" class="increment"></ion-icon>
            </div>
            `;
      cartList.appendChild(product);
    });
  }
  cartText.innerHTML = totalQuantity;

  totalText.innerHTML = `$${totalPrice}`;
}

function startNewOrder() {
  cartText.innerHTML = "0";
  totalText.innerHTML = "$0.00";
  carts = [];
  addCartToHtml();
  addCartToMemory();
}

initApp();
