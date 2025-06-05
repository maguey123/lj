// ==============================
//   js/checkout.js
// ==============================

document.addEventListener('DOMContentLoaded', () => {
    const summaryDiv   = document.getElementById('order-summary');
    const hiddenInput  = document.getElementById('cart-contents');
    const formElem     = document.getElementById('checkout-form');
    const cart         = getCart();               // from cart.js
    const container    = summaryDiv;
  
    // If the cart is empty, show a message + disable the form
    if (cart.length === 0) {
      container.innerHTML = '<p>Your cart is empty. Please add items before checking out.</p>';
      formElem.style.display = 'none';
      return;
    }
  
    // 1) Build a simple order‐summary table
    const table = document.createElement('table');
    table.classList.add('cart-table');
  
    // Header row
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Product</th>
        <th>Unit Price</th>
        <th>Quantity</th>
        <th>Subtotal</th>
      </tr>`;
    table.appendChild(thead);
  
    // Body rows
    const tbody = document.createElement('tbody');
    let total = 0;
  
    cart.forEach(item => {
      // Calculate discounted unit price
      const unitPrice = +(item.price * (1 - item.discount / 100)).toFixed(2);
      const subtotal  = +(unitPrice * item.quantity).toFixed(2);
      total += subtotal;
  
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="cart-product">
          <img src="${item.image_url}" alt="${item.name}" class="cart-image" />
          <span>${item.name}</span>
        </td>
        <td>$${unitPrice.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>$${subtotal.toFixed(2)}</td>
      `;
      tbody.appendChild(row);
    });
  
    table.appendChild(tbody);
  
    // 2) Show grand total below the table
    const footer = document.createElement('div');
    footer.innerHTML = `
      <div style="text-align: right; margin-top: 10px;">
        <strong>Total: $${total.toFixed(2)}</strong>
      </div>
    `;
  
    container.appendChild(table);
    container.appendChild(footer);
  
    // 3) Populate hidden field with the entire cart (JSON)
    hiddenInput.value = JSON.stringify(cart);
  
    // 4) When the user submits, clear the cart from localStorage
    formElem.addEventListener('submit', () => {
      // Clear cart so that after redirection, cart is empty
      localStorage.removeItem('cart');
      updateCartCount(); // update header badge to (0)
      // Then let the form actually submit to Formspree
    });
  });
  