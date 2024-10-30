// Sample products data
const products = [
    {
        id: 1,
        name: "Smartphone X",
        price: 699.99,
        image: "https://via.placeholder.com/300",
        description: "Latest smartphone with amazing features"
    },
    {
        id: 2,
        name: "Laptop Pro",
        price: 1299.99,
        image: "https://via.placeholder.com/300",
        description: "Powerful laptop for professionals"
    },
    {
        id: 3,
        name: "Wireless Headphones",
        price: 199.99,
        image: "https://via.placeholder.com/300",
        description: "Premium sound quality headphones"
    },
    {
        id: 4,
        name: "Smartwatch",
        price: 299.99,
        image: "https://via.placeholder.com/300",
        description: "Feature-rich smartwatch"
    }
];

// Shopping cart
let cart = [];
// Recently viewed products
let recentlyViewed = [];
// Search history
let searchHistory = [];

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-bs-theme', newTheme);
    themeToggle.innerHTML = newTheme === 'light' ? '<i class="bi bi-moon-fill"></i>' : '<i class="bi bi-sun-fill"></i>';
});

// Display products
function displayProducts() {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Create product card
function createProductCard(product) {
    return `
        <div class="col">
            <div class="card h-100 product-card">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><strong>$${product.price}</strong></p>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Add to recently viewed
function addToRecentlyViewed(productId) {
    const product = products.find(p => p.id === productId);
    if (!recentlyViewed.find(p => p.id === productId)) {
        recentlyViewed.unshift(product);
        if (recentlyViewed.length > 4) {
            recentlyViewed.pop();
        }
        displayRecentlyViewed();
    }
}

// Display recently viewed products
function displayRecentlyViewed() {
    const container = document.getElementById('recentlyViewed');
    if (container) {
        container.innerHTML = recentlyViewed.map(product => createProductCard(product)).join('');
    }
}

// Display recommendations based on search history
function displayRecommendations() {
    const container = document.getElementById('recommendations');
    if (container) {
        // Simple recommendation logic: show different products than recently viewed
        const recommended = products.filter(p => !recentlyViewed.find(rv => rv.id === p.id)).slice(0, 4);
        container.innerHTML = recommended.map(product => createProductCard(product)).join('');
    }
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    addToRecentlyViewed(productId);
    updateCart();
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0">${item.name}</h6>
                    <small>$${item.price} x ${item.quantity}</small>
                </div>
                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Search functionality
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm.length > 2) {
        searchHistory.unshift(searchTerm);
        if (searchHistory.length > 5) {
            searchHistory.pop();
        }
        displayRecommendations();
    }
});

// Initialize the page
displayProducts();
displayRecentlyViewed();
displayRecommendations();
updateCart();