// ==============================
//   js/shop.js  (full file)
// ==============================

document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.querySelector('.nav__links');
    const categoryList = document.getElementById('category-list');
    const productGrid  = document.getElementById('product-grid');
  
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  
    fetch('products.json')
      .then(response => response.json())
      .then(data => {
        const products = data.products;
        const categories = ['All', ...new Set(products.map(p => p.category))];
  
        // Populate category list
        categories.forEach(cat => {
          const li = document.createElement('li');
          li.textContent = cat;
          li.addEventListener('click', () => {
            filterProducts(cat, products);
          });
          categoryList.appendChild(li);
        });
  
        // Initially display all products
        filterProducts('All', products);
      })
      .catch(error => console.error('Error loading product data:', error));
  
    function filterProducts(category, products) {
      productGrid.innerHTML = '';
      const filtered = (category === 'All')
        ? products
        : products.filter(p => p.category === category);
  
      filtered.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
  
        // Image
        const img = document.createElement('img');
        img.src = product.image_url;
        img.alt = product.name;
  
        // Title
        const title = document.createElement('h3');
        title.textContent = product.name;
  
        // Price (with discount logic)
        const priceP = document.createElement('p');
        priceP.classList.add('price');
        const discountedPrice = (product.price * (1 - product.discount / 100)).toFixed(2);
        if (product.discount > 0) {
          priceP.innerHTML = `<span style="text-decoration: line-through;">$${product.price.toFixed(2)}</span> $${discountedPrice}`;
        } else {
          priceP.textContent = `$${product.price.toFixed(2)}`;
        }
  
        // Description
        const desc = document.createElement('p');
        desc.classList.add('description');
        desc.textContent = product.description;
  
        // Add to Cart button
        const btn = document.createElement('button');
        btn.classList.add('btn', 'add-to-cart');
        btn.textContent = 'Add to Cart';
  
        // WHEN clicked, call addToCart(product)
        btn.addEventListener('click', () => {
          addToCart({
            id:         product.id,
            name:       product.name,
            price:      product.price,
            discount:   product.discount,
            image_url:  product.image_url
          });
          // Optional: a small confirmation
          alert(`${product.name} added to cart!`);
        });
  
        // Assemble card
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(priceP);
        card.appendChild(desc);
        card.appendChild(btn);
  
        productGrid.appendChild(card);
      });
    }
  });
  