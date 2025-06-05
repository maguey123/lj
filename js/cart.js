// ==============================
//   js/cart.js
// ==============================

/**
 * Read the cart from localStorage. If none exists, return [].
 * A cart item has these fields: { id, name, price, discount, image_url, quantity }
 */
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }
  
  /**
   * Write the cart array back to localStorage.
   */
  function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  /**
   * Add one unit of the given product to the cart. If it already exists, increment quantity.
   * productObj must include at least: { id, name, price, discount, image_url }
   */
  function addToCart(productObj) {
    const cart = getCart();
    const existing = cart.find(item => item.id === productObj.id);
  
    if (existing) {
      existing.quantity += 1;
    } else {
      // Add as a new item with quantity = 1
      cart.push({
        id: productObj.id,
        name: productObj.name,
        price: productObj.price,
        discount: productObj.discount,
        image_url: productObj.image_url,
        quantity: 1
      });
    }
  
    saveCart(cart);
    updateCartCount();
  }
  
  /**
   * Calculate total item count (sum of all quantities) and write into <span id="cart-count">
   */
  function updateCartCount() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countElem = document.getElementById('cart-count');
    if (countElem) {
      countElem.textContent = `(${totalCount})`;
    }
  }
  
  // On every page load, immediately update the cart count in the header
  document.addEventListener('DOMContentLoaded', updateCartCount);
  