// ==============================
//   js/cart-page.js
// ==============================

document.addEventListener('DOMContentLoaded', () => {
    const cart       = getCart();                       // from cart.js
    const container  = document.getElementById('cart-items');
    const summaryDiv = document.getElementById('cart-summary');
  
    // If cart is empty, show a message:
    if (cart.length === 0) {
      container.innerHTML = '<p>Your cart is empty.</p>';
      summaryDiv.innerHTML = '';
      return;
    }
  
    // 1) Build table structure
    const table = document.createElement('table');
    table.classList.add('cart-table');
  
    // Table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Product</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Subtotal</th>
        <th>Remove</th>
      </tr>`;
    table.appendChild(thead);
  
    // Table body
    const tbody = document.createElement('tbody');
  
    cart.forEach(item => {
      // Compute discounted price
      const unitPrice = +(item.price * (1 - item.discount / 100)).toFixed(2);
      const subtotal  = +(unitPrice * item.quantity).toFixed(2);
  
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="cart-product">
          <img src="${item.image_url}" alt="${item.name}" class="cart-image" />
          <span>${item.name}</span>
        </td>
        <td>$${unitPrice.toFixed(2)}</td>
        <td>
          <button class="decrement" data-id="${item.id}">−</button>
          <span class="qty">${item.quantity}</span>
          <button class="increment" data-id="${item.id}">+</button>
        </td>
        <td>$${subtotal.toFixed(2)}</td>
        <td><button class="remove-item" data-id="${item.id}">✕</button></td>
      `;
      tbody.appendChild(row);
    });
  
    table.appendChild(tbody);
    container.appendChild(table);
  
    // 2) Compute total price
    const total = cart.reduce((sum, item) => {
      const unitP = item.price * (1 - item.discount / 100);
      return sum + unitP * item.quantity;
    }, 0).toFixed(2);
  
    // 3) Show total + Checkout button
    summaryDiv.innerHTML = `
      <h3>Total: $${total}</h3>
      <button id="checkout" class="btn">Checkout</button>
    `;

    // Redirect to checkout.html when clicked:
    const checkoutBtn = document.getElementById('checkout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        window.location.href = 'checkout.html';
      });
    }

    
    // 4) Attach event listeners on <tbody> (event delegation)
    tbody.addEventListener('click', event => {
      const target = event.target;
      const id = parseInt(target.getAttribute('data-id'), 10);
  
      if (target.classList.contains('increment')) {
        updateQuantity(id, +1);
      } else if (target.classList.contains('decrement')) {
        updateQuantity(id, -1);
      } else if (target.classList.contains('remove-item')) {
        removeItem(id);
      }
    });
  });
  
  // Increase or decrease the quantity of a cart item.
  // If quantity falls below 1, remove the item entirely.
  function updateQuantity(id, change) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;
  
    item.quantity += change;
    if (item.quantity < 1) {
      removeItem(id);
      return;
    }
    saveCart(cart);
    // Reload the page so the table re-draws
    location.reload();
  }
  
  // Remove an item from the cart (entirely)
  function removeItem(id) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
    location.reload();
  }
  