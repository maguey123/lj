< script >
    document.addEventListener('DOMContentLoaded', () => {
        // ── 1) Mobile‐menu toggle ──
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.querySelector('.nav__links');
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // ── 2) Fetch product data ──
        const productGrid = document.getElementById('product-grid');
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                data.products.forEach(product => {
                    const card = document.createElement('div');
                    card.classList.add('product-card');

                    const img = document.createElement('img');
                    img.src = product.image_url;
                    img.alt = product.name;

                    const title = document.createElement('h3');
                    title.textContent = product.name;

                    const price = document.createElement('p');
                    price.classList.add('price');
                    const discountedPrice = (product.price * (1 - product.discount / 100)).toFixed(2);
                    if (product.discount > 0) {
                        price.innerHTML = `
            <span style="text-decoration: line-through;">
              $${product.price.toFixed(2)}
            </span> 
            $${discountedPrice}
          `;
                    } else {
                        price.textContent = `$${product.price.toFixed(2)}`;
                    }

                    const desc = document.createElement('p');
                    desc.textContent = product.description;

                    const btn = document.createElement('button');
                    btn.classList.add('btn', 'add-to-cart');
                    btn.textContent = 'Add to Cart';
                    btn.addEventListener('click', () => {
                        alert(product.name + ' added to cart!');
                    });

                    card.appendChild(img);
                    card.appendChild(title);
                    card.appendChild(price);
                    card.appendChild(desc);
                    card.appendChild(btn);

                    productGrid.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error loading product data:', error);
            });

        // ── 3) Hero‐section slideshow on mobile ──
        const slides = document.querySelectorAll('.hero-images img');
        let current = 0;
        let intervalId;

        function showSlide(index) {
            slides.forEach((img, idx) => {
                img.classList.toggle('active', idx === index);
            });
        }

        function startSlideshow() {
            // If viewport is ≤768px, run the 5s‐interval slideshow
            if (window.innerWidth <= 768) {
                showSlide(current);
                intervalId = setInterval(() => {
                    current = (current + 1) % slides.length;
                    showSlide(current);
                }, 5000);
            } else {
                // On desktop, cancel any interval and make all images visible
                clearInterval(intervalId);
                slides.forEach(img => {
                    img.classList.remove('active');
                    img.style.display = '';
                });
            }
        }

        window.addEventListener('resize', () => {
            // Whenever the screen resizes, reset the slideshow logic
            clearInterval(intervalId);
            slides.forEach(img => {
                img.classList.remove('active');
                img.style.display = '';
            });
            startSlideshow();
        });

        startSlideshow();
    }); <
/script>