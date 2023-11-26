import data from "./data.js";

var productEl = document.querySelector(".product-list");
var orderData = [];
var orderSummaryEl = document.querySelector(".order-summary");
var orderContentEl = document.querySelector(".order-content");

data.forEach((item) => {
  const { name, ingredients, price, emoji } = item;
  const ingredientsList = ingredients.join(", ");
  const listItem = document.createElement("li");
  listItem.classList.add("food-item");
  listItem.innerHTML = `
    <span class="food-emoji-wrapper">
       <span class="food-emoji">${emoji}</span>
    </span>
    <div>
        <h2 class="dish-name">${name}</h2>
        <p class="ingredients-list">${ingredientsList}</p>
        <span class="dish-price">₹ ${price}</span>
    </div>
    <div class="plus-icon" data-food-item="${name}" data-food-price="${price}" >+</div>
    `;

  productEl.append(listItem);
});

productEl.addEventListener("click", function (e) {
  if (e.target.dataset.foodItem && e.target.dataset.foodPrice) {
    const filteredData = orderData.filter(
      (item) => item.name === e.target.dataset.foodItem
    );
    if (filteredData.length > 0) {
      const [onlyItem] = filteredData;
      onlyItem.quantity = onlyItem.quantity + 1;
      renderOrderSummary();
    } else {
      orderData.push({
        name: e.target.dataset.foodItem,
        price: e.target.dataset.foodPrice,
        quantity: 1,
      });
      showOrderSummary();
    }
    if (!orderSummaryEl.classList.contains("show")) {
      orderSummaryEl.classList.remove("hide");
      orderSummaryEl.classList.add("show");
    }
    calculateTotalPrice();
  }
});

function showOrderSummary() {
  if (orderData.length > 0) {
    const { name, price, quantity } = orderData.at(-1);
    const listItem = document.createElement("li");
    listItem.classList.add("summary-item");
    listItem.innerHTML = `
        ${name}
        <span class="quantity"> * ${quantity}</span>
        <button class="remove-btn" data-name="${name}">Remove</button>
        <span class="dish-price-sum">₹ ${price}</span>
    `;
    orderContentEl.append(listItem);
  }
}

function renderOrderSummary() {
  if (orderData.length > 0) {
    let htmlContent = "";
    orderData.forEach((item) => {
      const { name, price, quantity } = item;
      htmlContent += `
        <li class="summary-item">
            ${name}
            <span class="quantity"> * ${quantity}</span>
            <button class="remove-btn" data-name="${name}">Remove</button>
            <span class="dish-price-sum">₹ ${price}</span>
         </li>
        `;
    });
    orderContentEl.innerHTML = htmlContent;
  } else {
    orderContentEl.innerHTML = "";
    orderSummaryEl.classList.remove("show");
    orderSummaryEl.classList.add("hide");
  }
}

orderSummaryEl.addEventListener("click", (e) => {
  if (e.target.dataset.name) {
    orderData.forEach((item, idx) => {
      const { name } = item;
      if (name === e.target.dataset.name) {
        orderData.splice(idx, 1);
        renderOrderSummary();
        calculateTotalPrice();
      }
    });
  }
});

function calculateTotalPrice() {
  const orderPrice = orderData.reduce((prev, item) => {
    const { quantity, price } = item;
    return prev + quantity * price;
  }, 0);
  document.querySelector(".total-price").textContent = `₹ ${orderPrice}`;
}
