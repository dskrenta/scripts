'use strict';

const vending = [];

function addProduct({
  name, 
  quantity, 
  price
}) {
  vending.push({
    name, 
    quantity,
    price
  });
}

function printChoices() {
  for (let i = 0; i < vending.length; i++) {
    console.log(`Code: ${i}, Name: ${vending[i].name}, Quantity: ${vending[i].quantity}, Price: $${vending[i].price}.`);
  }
}

function buyProduct(code) {
  if (vending[code].quantity > 0) {
    vending[code].quantity -= 1;
    console.log(`Purchased a ${vending[code].name} for $${vending[code].price}.`);
    console.log(`There are ${vending[code].quantity} ${vending[code].name} left.`);
  }
  else {
    console.log(`Failed to purchase ${vending[code].name}, that item is out of stock. Sorry for the inconvenience.`);
  }
  printChoices();
}

addProduct({
  name: 'Snickers',
  quantity: 1,
  price: 5.00
});

addProduct({
  name: 'Milky Way',
  quantity: 20,
  price: 6.00
});

addProduct({
  name: 'Sour Patch Kids',
  quantity: 20,
  price: 3.00
});

addProduct({
  name: 'Chips Ahoy',
  quantity: 20,
  price: 10.00
});

addProduct({
  name: 'Hot Chocolate',
  quantity: 20,
  price: 6.00
});

printChoices();
buyProduct(0);
buyProduct(0);
buyProduct(4);
