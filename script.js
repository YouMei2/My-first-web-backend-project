// Product data example (you will connect your backend here)
const products = [
    {
        id: 1,
        name: 'Nike Air Max',
        category: 'sneakers',
        price: 120,
        image: 'placeholder-sneakers.jpg',
        description: 'Comfortable sneakers for everyday wear',
        sizes: ['38', '39', '40', '41', '42', '43'],
        details: {
            'Material': 'Leather, textile',
            'Sole': 'Rubber',
            'Color': 'Black',
            'Country of manufacture': 'Vietnam'
        }
    },
    {
        id: 2,
        name: 'Adidas Ultraboost',
        category: 'sneakers',
        price: 110,
        image: 'placeholder-sneakers.jpg',
        description: 'Running sneakers with Boost technology',
        sizes: ['38', '39', '40', '41', '42', '43'],
        details: {
            'Material': 'Textile',
            'Sole': 'Boost',
            'Color': 'White',
            'Country of manufacture': 'China'
        }
    },
    {
        id: 3,
        name: 'Basic Hoodie',
        category: 'hoodies',
        price: 30,
        image: 'placeholder-hoodie.jpg',
        description: 'Classic cotton hoodie',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        details: {
            'Material': '100% cotton',
            'Color': 'Black',
            'Care': 'Machine wash at 30°C',
            'Country of manufacture': 'Turkey'
        }
    },
    {
        id: 4,
        name: 'Oversized Sweatshirt',
        category: 'hoodies',
        price: 45,
        image: 'placeholder-hoodie.jpg',
        description: 'Oversized loose fit sweatshirt',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        details: {
            'Material': '80% cotton, 20% polyester',
            'Color': 'Gray',
            'Care': 'Machine wash at 30°C',
            'Country of manufacture': 'Turkey'
        }
    },
    {
        id: 5,
        name: 'Sports Pants',
        category: 'pants',
        price: 25,
        image: 'placeholder-pants.jpg',
        description: 'Comfortable sports pants',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        details: {
            'Material': '70% cotton, 30% polyester',
            'Color': 'Black',
            'Pockets': 'Yes',
            'Country of manufacture': 'Bangladesh'
        }
    },
    {
        id: 6,
        name: 'Cargo Pants',
        category: 'pants',
        price: 30,
        image: 'placeholder-pants.jpg',
        description: 'Stylish cargo pants with patch pockets',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        details: {
            'Material': '100% cotton',
            'Color': 'Khaki',
            'Pockets': '6 pockets',
            'Country of manufacture': 'China'
        }
    },
    {
        id: 7,
        name: 'Classic Jeans',
        category: 'jeans',
        price: 35,
        image: 'placeholder-jeans.jpg',
        description: 'Straight classic cut jeans',
        sizes: ['28', '30', '32', '34', '36'],
        details: {
            'Material': '98% cotton, 2% elastane',
            'Color': 'Blue',
            'Fit': 'Mid-rise',
            'Country of manufacture': 'Turkey'
        }
    },
    {
        id: 8,
        name: 'Skinny Jeans',
        category: 'jeans',
        price: 26,
        image: 'placeholder-jeans.jpg',
        description: 'Tapered jeans',
        sizes: ['28', '30', '32', '34', '36'],
        details: {
            'Material': '92% cotton, 6% polyester, 2% elastane',
            'Color': 'Black',
            'Fit': 'Low-rise',
            'Country of manufacture': 'Bangladesh'
        }
    },
    {
        id: 9,
        name: 'Basic Socks (3 pairs)',
        category: 'socks',
        price: 5,
        image: 'placeholder-socks.jpg',
        description: 'Set of 3 pairs of basic socks',
        sizes: ['36-38', '39-41', '42-44'],
        details: {
            'Material': '80% cotton, 18% polyamide, 2% elastane',
            'Color': 'Black, white, gray',
            'Length': 'Short',
            'Quantity per pack': '3 pairs'
        }
    },
    {
        id: 10,
        name: 'Sports Socks (5 pairs)',
        category: 'socks',
        price: 15,
        image: 'placeholder-socks.jpg',
        description: 'Set of 5 pairs of sports socks',
        sizes: ['36-38', '39-41', '42-44'],
        details: {
            'Material': '75% cotton, 20% polyamide, 5% elastane',
            'Color': 'Multicolored',
            'Length': 'Medium',
            'Quantity per pack': '5 pairs'
        }
    }
];

// Application state
let currentCategory = 'all';
let currentFilters = {
    sizes: [],
    priceMin: null,
    priceMax: null
};
let currentSort = 'default';
let cart = [];

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    initEventListeners();
    loadCartFromStorage();
    updateCartCount();
});

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    const noProducts = document.getElementById('no-products');
    
    let filteredProducts = filterProducts();
    filteredProducts = sortProducts(filteredProducts);
    
    if (filteredProducts.length === 0) {
        productsGrid.style.display = 'none';
        noProducts.style.display = 'block';
        return;
    }
    
    productsGrid.style.display = 'grid';
    noProducts.style.display = 'none';
    productsGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => openProductModal(product);
    
    card.innerHTML = `
        <div class="product-image">
            <div>[Product Image]</div>
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-category">${getCategoryName(product.category)}</p>
            <p class="product-price">€${product.price}</p>
        </div>
    `;
    
    return card;
}

// Filter products
function filterProducts() {
    let filtered = products;
    
    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    
    // Filter by size
    if (currentFilters.sizes.length > 0) {
        filtered = filtered.filter(p => 
            p.sizes.some(size => currentFilters.sizes.includes(size.toLowerCase()))
        );
    }
    
    // Filter by price
    if (currentFilters.priceMin !== null) {
        filtered = filtered.filter(p => p.price >= currentFilters.priceMin);
    }
    if (currentFilters.priceMax !== null) {
        filtered = filtered.filter(p => p.price <= currentFilters.priceMax);
    }
    
    return filtered;
}

// Sort products
function sortProducts(products) {
    let sorted = [...products];
    
    switch (currentSort) {
        case 'price-asc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    return sorted;
}

// Open product modal
function openProductModal(product) {
    const modal = document.getElementById('product-modal');
    
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-category').textContent = getCategoryName(product.category);
    document.getElementById('modal-price').textContent = `€${product.price}`;
    document.getElementById('modal-description').textContent = product.description;
    
    // Product details
    const detailsList = document.getElementById('modal-details');
    detailsList.innerHTML = '';
    for (let [key, value] of Object.entries(product.details)) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${key}:</strong> ${value}`;
        detailsList.appendChild(li);
    }
    
    // Sizes
    const sizeSelect = document.getElementById('modal-size-select');
    sizeSelect.innerHTML = '';
    product.sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
    });
    
    // Reset quantity
    document.getElementById('modal-quantity').value = 1;
    
    // Add to cart handler
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    addToCartBtn.onclick = () => addToCart(product);
    
    modal.style.display = 'block';
}

// Add to cart
function addToCart(product) {
    const size = document.getElementById('modal-size-select').value;
    const quantity = parseInt(document.getElementById('modal-quantity').value);
    
    const cartItem = {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        size: size,
        quantity: quantity,
        image: product.image
    };
    
    // Check if item already exists with same size
    const existingItem = cart.find(item => item.id === product.id && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push(cartItem);
    }
    
    saveCartToStorage();
    updateCartCount();
    closeModal('product-modal');
    
    alert('Product added to cart!');
}

// Open cart
function openCart() {
    const modal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    
    if (cart.length === 0) {
        cartItems.style.display = 'none';
        emptyCart.style.display = 'block';
    } else {
        cartItems.style.display = 'block';
        emptyCart.style.display = 'none';
        
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItemElement = createCartItem(item, index);
            cartItems.appendChild(cartItemElement);
        });
    }
    
    updateCartTotal();
    modal.style.display = 'block';
}

// Create cart item
function createCartItem(item, index) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    
    div.innerHTML = `
        <div class="cart-item-image">
            <div>[Image]</div>
        </div>
        <div class="cart-item-info">
            <h3>${item.name}</h3>
            <p>Category: ${getCategoryName(item.category)}</p>
            <p>Size: ${item.size}</p>
            <p>Price: €${item.price}</p>
            <div class="cart-item-controls">
                <button onclick="decreaseQuantity(${index})">-</button>
                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                <button onclick="increaseQuantity(${index})">+</button>
            </div>
        </div>
        <div>
            <p><strong>Total: €${item.price * item.quantity}</strong></p>
            <button class="cart-item-remove" onclick="removeFromCart(${index})">Remove</button>
        </div>
    `;
    
    return div;
}

// Manage item quantity
function increaseQuantity(index) {
    cart[index].quantity++;
    saveCartToStorage();
    openCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        saveCartToStorage();
        openCart();
    }
}

function updateQuantity(index, value) {
    const quantity = parseInt(value);
    if (quantity > 0) {
        cart[index].quantity = quantity;
        saveCartToStorage();
        openCart();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToStorage();
    updateCartCount();
    openCart();
}

// Update cart total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total').textContent = total;
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Get category name
function getCategoryName(category) {
    const categories = {
        'sneakers': 'Sneakers',
        'hoodies': 'Hoodies',
        'pants': 'Pants',
        'jeans': 'Jeans',
        'socks': 'Socks'
    };
    return categories[category] || category;
}

// Initialize event listeners
function initEventListeners() {
    // Category navigation
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentCategory = e.target.dataset.category;
            renderProducts();
        });
    });
    
    // Sorting
    document.getElementById('sort-select').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
    });
    
    // Apply filters
    document.getElementById('apply-filters').addEventListener('click', () => {
        const checkedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked'))
            .map(cb => cb.value);
        const priceMin = document.getElementById('price-min').value;
        const priceMax = document.getElementById('price-max').value;
        
        currentFilters = {
            sizes: checkedSizes,
            priceMin: priceMin ? parseInt(priceMin) : null,
            priceMax: priceMax ? parseInt(priceMax) : null
        };
        
        renderProducts();
    });
    
    // Reset filters
    document.getElementById('reset-filters').addEventListener('click', () => {
        document.querySelectorAll('input[name="size"]').forEach(cb => cb.checked = false);
        document.getElementById('price-min').value = '';
        document.getElementById('price-max').value = '';
        
        currentFilters = {
            sizes: [],
            priceMin: null,
            priceMax: null
        };
        
        renderProducts();
    });
    
    // Open cart
    document.getElementById('cart-btn').addEventListener('click', openCart);
    
    // Checkout
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Cart is empty!');
            return;
        }
        
        // Backend checkout logic will go here
        alert('Checkout functionality will be implemented on backend');
        console.log('Order:', cart);
    });
    
    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Export cart data (for backend use)
function getCartData() {
    return cart;
}

// Clear cart (after successful order)
function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartCount();
}