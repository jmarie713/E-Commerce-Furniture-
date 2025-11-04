// Sample product data
const products = [
    { id: 1, name: "Modern Furniture", price: 140.00, rating: 5, reviews: 50, category: "chair" },
    { id: 2, name: "Comfortable Sofa", price: 299.99, rating: 4, reviews: 32, category: "sofa" },
    { id: 3, name: "Wooden Table", price: 199.99, rating: 5, reviews: 45, category: "table" },
    { id: 4, name: "Office Chair", price: 149.99, rating: 4, reviews: 28, category: "chair" },
    { id: 5, name: "Corner Table", price: 89.99, rating: 5, reviews: 15, category: "corner" },
    { id: 6, name: "New Wardrobe", price: 399.99, rating: 4, reviews: 22, category: "wardrobe" },
    { id: 7, name: "Flexible Chair", price: 129.99, rating: 5, reviews: 38, category: "chair" },
    { id: 8, name: "Dining Set", price: 499.99, rating: 5, reviews: 19, category: "table" }
];

// User data and cart data
let users = [];
let cart = [];
let isLoggedIn = false;
let currentUser = null;
let currentSlide = 0;
let slideInterval;

// DOM Elements
const searchIcon = document.getElementById('search-icon');
const searchBar = document.getElementById('search-bar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const toggleMenu = document.getElementById('toggle-menu');
const toggleMenuOverlay = document.getElementById('toggle-menu-overlay');
const toggleMenuClose = document.getElementById('toggle-menu-close');
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const cartModalOverlay = document.getElementById('cart-modal-overlay');
const cartModalClose = document.getElementById('cart-modal-close');
const userIcon = document.getElementById('user-icon');
const loginModal = document.getElementById('login-modal');
const loginModalOverlay = document.getElementById('login-modal-overlay');
const loginModalClose = document.getElementById('login-modal-close');
const loginForm = document.getElementById('login-form');
const cartItems = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const cartCount = document.querySelector('.cart-count');
const slides = document.querySelector('.slides');
const sliderDots = document.querySelectorAll('.slider-dot');
const categoryItems = document.querySelectorAll('.category-list li');
const createAccountLink = document.getElementById('create-account');
const forgotPasswordLink = document.getElementById('forgot-password');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load users from localStorage
    loadUsers();
    
    // Generate product cards based on current page
    generateProductCards();
    
    // Initialize slider if on home page
    if (document.querySelector('.slider')) {
        initSlider();
    }
    
    // Initialize category filtering if on shop page
    if (document.querySelector('.category-list')) {
        initCategoryFilter();
    }
    
    // Load cart from localStorage
    loadCart();
    
    // Check login status
    checkLoginStatus();
    
    // Set up event listeners
    setupEventListeners();
}

// Load users from localStorage
function loadUsers() {
    const savedUsers = localStorage.getItem('furnishme-users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        // Create a default user for testing
        users = [
            {
                id: 1,
                email: 'demo@furnishme.com',
                password: 'password123',
                name: 'Demo User',
                createdAt: new Date().toISOString()
            }
        ];
        saveUsers();
    }
}

// Save users to localStorage
function saveUsers() {
    localStorage.setItem('furnishme-users', JSON.stringify(users));
}

// Generate product cards
function generateProductCards() {
    const productGrids = document.querySelectorAll('.product-grid');
    
    productGrids.forEach(grid => {
        // Clear existing content
        grid.innerHTML = '';
        
        // Get filtered products if on shop page
        let productsToShow = products;
        if (grid.id === 'shop-products') {
            const activeCategory = document.querySelector('.category-list li.active');
            if (activeCategory && activeCategory.dataset.category !== 'all') {
                productsToShow = products.filter(product => product.category === activeCategory.dataset.category);
            }
        } else {
            // Show only 4 products on home page
            productsToShow = products.slice(0, 4);
        }
        
        // Generate product cards
        productsToShow.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <div class="product-hover-icons">
                        <div class="hover-icon" title="Quick View">
                            <i class="bi bi-eye"></i>
                        </div>
                        <div class="hover-icon" title="Add to Wishlist">
                            <i class="bi bi-heart"></i>
                        </div>
                        <div class="hover-icon add-to-cart-btn" data-id="${product.id}" title="Add to Cart">
                            <i class="bi bi-cart-plus"></i>
                        </div>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-rating">
                        ${'<i class="bi bi-star-fill"></i>'.repeat(product.rating)}
                        ${'<i class="bi bi-star"></i>'.repeat(5 - product.rating)}
                        <span>(${product.reviews})</span>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            grid.appendChild(productCard);
        });
        
        // Add event listeners to add-to-cart buttons
        const addToCartButtons = grid.querySelectorAll('.add-to-cart, .add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    });
}

// Initialize slider
function initSlider() {
    const totalSlides = document.querySelectorAll('.slide').length;
    
    // Auto slide
    slideInterval = setInterval(() => {
        nextSlide();
    }, 5000);
    
    // Dot navigation
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
            resetSlideInterval();
        });
    });
    
    updateSlider();
}

function nextSlide() {
    const totalSlides = document.querySelectorAll('.slide').length;
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

function updateSlider() {
    const totalSlides = document.querySelectorAll('.slide').length;
    
    if (slides) {
        slides.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    sliderDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function resetSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

// Initialize category filtering
function initCategoryFilter() {
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            categoryItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Regenerate products
            generateProductCards();
        });
    });
}

// Cart functionality
function addToCart(productId) {
    // Check if user is logged in
    if (!isLoggedIn) {
        showNotification('Please login first to add items to cart', 'error');
        showLoginModal();
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${product.name} added to cart`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Item removed from cart', 'error');
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
    }
}

function updateCart() {
    // Update cart items display
    if (cartItems) {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="text-center">Your cart is empty</p>';
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                `;
                cartItems.appendChild(cartItem);
            });
            
            // Add event listeners to quantity buttons
            const decreaseButtons = cartItems.querySelectorAll('.decrease-btn');
            const increaseButtons = cartItems.querySelectorAll('.increase-btn');
            
            decreaseButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    updateCartQuantity(productId, -1);
                });
            });
            
            increaseButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    updateCartQuantity(productId, 1);
                });
            });
        }
    }
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotalPrice) {
        cartTotalPrice.textContent = `$${total.toFixed(2)}`;
    }
    
    // Update cart count
    const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = itemCount;
        cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
    }
    
    // Save cart to localStorage
    saveCart();
}

function loadCart() {
    const savedCart = localStorage.getItem('furnishme-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

function saveCart() {
    localStorage.setItem('furnishme-cart', JSON.stringify(cart));
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    if (!isLoggedIn) {
        showNotification('Please login to checkout', 'error');
        showLoginModal();
        return;
    }
    
    // Generate receipt
    const receipt = generateReceipt();
    
    // Show receipt in a modal
    showReceiptModal(receipt);
    
    // Clear cart after successful checkout
    cart = [];
    updateCart();
}

function generateReceipt() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = total * 0.08; // 8% tax
    const grandTotal = total + tax;
    const orderId = Math.floor(100000 + Math.random() * 900000);
    
    let receipt = {
        orderId: orderId,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity
        })),
        subtotal: total,
        tax: tax,
        grandTotal: grandTotal,
        customer: currentUser ? currentUser.name : 'Guest'
    };
    
    return receipt;
}

function showReceiptModal(receipt) {
    // Create receipt modal HTML
    const receiptHTML = `
        <div class="receipt-modal" id="receipt-modal">
            <div class="receipt-content">
                <div class="receipt-header">
                    <h3>Order Confirmation</h3>
                    <i class="bi bi-x receipt-close" id="receipt-close"></i>
                </div>
                <div class="receipt-body">
                    <div class="receipt-info">
                        <p><strong>Order ID:</strong> #${receipt.orderId}</p>
                        <p><strong>Date:</strong> ${receipt.date}</p>
                        <p><strong>Time:</strong> ${receipt.time}</p>
                        <p><strong>Customer:</strong> ${receipt.customer}</p>
                    </div>
                    <div class="receipt-items">
                        <h4>Order Items:</h4>
                        ${receipt.items.map(item => `
                            <div class="receipt-item">
                                <span>${item.name} x${item.quantity}</span>
                                <span>$${item.total.toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="receipt-totals">
                        <div class="receipt-total-line">
                            <span>Subtotal:</span>
                            <span>$${receipt.subtotal.toFixed(2)}</span>
                        </div>
                        <div class="receipt-total-line">
                            <span>Tax (8%):</span>
                            <span>$${receipt.tax.toFixed(2)}</span>
                        </div>
                        <div class="receipt-total-line grand-total">
                            <span>Grand Total:</span>
                            <span>$${receipt.grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="receipt-thankyou">
                        <p>Thank you for your purchase!</p>
                        <p>Your order will be processed shortly.</p>
                    </div>
                </div>
                <div class="receipt-footer">
                    <button class="btn-primary" id="receipt-ok-btn">OK</button>
                </div>
            </div>
        </div>
        <div class="receipt-modal-overlay" id="receipt-modal-overlay"></div>
    `;
    
    // Add receipt modal to page
    document.body.insertAdjacentHTML('beforeend', receiptHTML);
    
    // Show receipt modal
    const receiptModal = document.getElementById('receipt-modal');
    const receiptOverlay = document.getElementById('receipt-modal-overlay');
    
    setTimeout(() => {
        receiptModal.classList.add('active');
        receiptOverlay.classList.add('active');
    }, 100);
    
    // Add event listeners for receipt modal
    document.getElementById('receipt-close').addEventListener('click', closeReceiptModal);
    document.getElementById('receipt-ok-btn').addEventListener('click', closeReceiptModal);
    receiptOverlay.addEventListener('click', closeReceiptModal);
    
    function closeReceiptModal() {
        receiptModal.classList.remove('active');
        receiptOverlay.classList.remove('active');
        setTimeout(() => {
            receiptModal.remove();
            receiptOverlay.remove();
        }, 300);
    }
}

// User Registration and Login functionality
function showLoginModal() {
    loginModal.classList.add('active');
    loginModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function checkLoginStatus() {
    const savedLogin = localStorage.getItem('furnishme-login');
    const savedUser = localStorage.getItem('furnishme-current-user');
    
    if (savedLogin && savedUser) {
        isLoggedIn = JSON.parse(savedLogin);
        currentUser = JSON.parse(savedUser);
        updateUserIcon();
    }
}

function updateUserIcon() {
    if (isLoggedIn && currentUser) {
        userIcon.className = 'bi bi-box-arrow-right';
        userIcon.title = `Logout (${currentUser.name})`;
        enableCartFeatures();
    } else {
        userIcon.className = 'bi bi-person';
        userIcon.title = 'Login';
        disableCartFeatures();
    }
}

function enableCartFeatures() {
    // Enable all add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart, .add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.disabled = false;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
    });
    
    // Enable checkout button
    if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';
        checkoutBtn.style.cursor = 'pointer';
    }
}

function disableCartFeatures() {
    // Disable all add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart, .add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.6';
        button.style.cursor = 'not-allowed';
    });
    
    // Disable checkout button
    if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.6';
        checkoutBtn.style.cursor = 'not-allowed';
    }
}

function login(email, password) {
    // Find user by email
    const user = users.find(u => u.email === email);
    
    if (!user) {
        showNotification('User not found. Please check your email or register.', 'error');
        return false;
    }
    
    // Check password (in real app, this would be hashed)
    if (user.password !== password) {
        showNotification('Invalid password. Please try again.', 'error');
        return false;
    }
    
    // Login successful
    isLoggedIn = true;
    currentUser = user;
    
    // Save login state
    localStorage.setItem('furnishme-login', JSON.stringify(isLoggedIn));
    localStorage.setItem('furnishme-current-user', JSON.stringify(currentUser));
    
    updateUserIcon();
    closeLoginModal();
    showNotification(`Welcome back, ${user.name}!`, 'success');
    
    return true;
}

function register(name, email, password, confirmPassword) {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return false;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return false;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return false;
    }
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        showNotification('Email already registered. Please login instead.', 'error');
        return false;
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        password: password, // In real app, this would be hashed
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers();
    
    // Auto-login after registration
    isLoggedIn = true;
    currentUser = newUser;
    
    // Save login state
    localStorage.setItem('furnishme-login', JSON.stringify(isLoggedIn));
    localStorage.setItem('furnishme-current-user', JSON.stringify(currentUser));
    
    updateUserIcon();
    closeLoginModal();
    showNotification(`Account created successfully! Welcome, ${name}!`, 'success');
    
    return true;
}

function logout() {
    isLoggedIn = false;
    currentUser = null;
    
    // Clear login state
    localStorage.removeItem('furnishme-login');
    localStorage.removeItem('furnishme-current-user');
    
    // Clear cart when logging out
    cart = [];
    updateCart();
    
    updateUserIcon();
    showNotification('You have been logged out', 'error');
}

function closeLoginModal() {
    loginModal.classList.remove('active');
    loginModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear form
    if (loginForm) {
        loginForm.reset();
    }
}

function showRegistrationModal() {
    closeLoginModal();
    
    // Create registration modal
    const registrationHTML = `
        <div class="login-modal" id="registration-modal">
            <div class="login-modal-header">
                <h3>Create Account</h3>
                <i class="bi bi-x login-modal-close" id="registration-close"></i>
            </div>
            
            <form id="registration-form">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" class="form-control" id="reg-name" required>
                </div>
                
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" class="form-control" id="reg-email" required>
                </div>
                
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" class="form-control" id="reg-password" required minlength="6">
                </div>
                
                <div class="form-group">
                    <label>Confirm Password</label>
                    <input type="password" class="form-control" id="reg-confirm-password" required>
                </div>
                
                <button type="submit" class="btn-primary" style="width: 100%;">Create Account</button>
                
                <div class="login-links">
                    <a href="#" id="back-to-login">Already have an account? Login here</a>
                </div>
            </form>
        </div>
        <div class="login-modal-overlay" id="registration-overlay"></div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', registrationHTML);
    
    const registrationModal = document.getElementById('registration-modal');
    const registrationOverlay = document.getElementById('registration-overlay');
    
    setTimeout(() => {
        registrationModal.classList.add('active');
        registrationOverlay.classList.add('active');
    }, 100);
    
    // Add event listeners for registration modal
    document.getElementById('registration-close').addEventListener('click', closeRegistrationModal);
    document.getElementById('registration-overlay').addEventListener('click', closeRegistrationModal);
    document.getElementById('back-to-login').addEventListener('click', function(e) {
        e.preventDefault();
        closeRegistrationModal();
        showLoginModal();
    });
    
    document.getElementById('registration-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        
        if (register(name, email, password, confirmPassword)) {
            closeRegistrationModal();
        }
    });
    
    function closeRegistrationModal() {
        registrationModal.classList.remove('active');
        registrationOverlay.classList.remove('active');
        setTimeout(() => {
            registrationModal.remove();
            registrationOverlay.remove();
        }, 300);
    }
}

function showForgotPasswordModal() {
    closeLoginModal();
    
    // Create forgot password modal
    const forgotPasswordHTML = `
        <div class="login-modal" id="forgot-password-modal">
            <div class="login-modal-header">
                <h3>Reset Password</h3>
                <i class="bi bi-x login-modal-close" id="forgot-password-close"></i>
            </div>
            
            <form id="forgot-password-form">
                <div class="form-group">
                    <label>Enter your email address</label>
                    <input type="email" class="form-control" id="reset-email" required>
                </div>
                
                <p style="margin-bottom: 1.5rem; color: var(--text-color); font-size: 0.9rem;">
                    We'll send you a link to reset your password.
                </p>
                
                <button type="submit" class="btn-primary" style="width: 100%;">Send Reset Link</button>
                
                <div class="login-links">
                    <a href="#" id="back-to-login-from-forgot">Back to Login</a>
                </div>
            </form>
        </div>
        <div class="login-modal-overlay" id="forgot-password-overlay"></div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', forgotPasswordHTML);
    
    const forgotModal = document.getElementById('forgot-password-modal');
    const forgotOverlay = document.getElementById('forgot-password-overlay');
    
    setTimeout(() => {
        forgotModal.classList.add('active');
        forgotOverlay.classList.add('active');
    }, 100);
    
    // Add event listeners for forgot password modal
    document.getElementById('forgot-password-close').addEventListener('click', closeForgotPasswordModal);
    document.getElementById('forgot-password-overlay').addEventListener('click', closeForgotPasswordModal);
    document.getElementById('back-to-login-from-forgot').addEventListener('click', function(e) {
        e.preventDefault();
        closeForgotPasswordModal();
        showLoginModal();
    });
    
    document.getElementById('forgot-password-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('reset-email').value;
        
        // Simulate sending reset email
        showNotification(`Password reset link sent to ${email}`, 'success');
        closeForgotPasswordModal();
        showLoginModal();
    });
    
    function closeForgotPasswordModal() {
        forgotModal.classList.remove('active');
        forgotOverlay.classList.remove('active');
        setTimeout(() => {
            forgotModal.remove();
            forgotOverlay.remove();
        }, 300);
    }
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Event listeners setup
function setupEventListeners() {
    // Search functionality
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            searchBar.classList.toggle('active');
        });
    }
    
    // Mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            toggleMenu.classList.add('active');
            toggleMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (toggleMenuClose) {
        toggleMenuClose.addEventListener('click', function() {
            toggleMenu.classList.remove('active');
            toggleMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (toggleMenuOverlay) {
        toggleMenuOverlay.addEventListener('click', function() {
            toggleMenu.classList.remove('active');
            toggleMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Cart functionality
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            if (!isLoggedIn) {
                showNotification('Please login first to view your cart', 'error');
                showLoginModal();
                return;
            }
            cartModal.classList.add('active');
            cartModalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (cartModalClose) {
        cartModalClose.addEventListener('click', function() {
            cartModal.classList.remove('active');
            cartModalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (cartModalOverlay) {
        cartModalOverlay.addEventListener('click', function() {
            cartModal.classList.remove('active');
            cartModalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // User functionality
    if (userIcon) {
        userIcon.addEventListener('click', function() {
            if (isLoggedIn) {
                logout();
            } else {
                showLoginModal();
            }
        });
    }
    
    if (loginModalClose) {
        loginModalClose.addEventListener('click', function() {
            closeLoginModal();
        });
    }
    
    if (loginModalOverlay) {
        loginModalOverlay.addEventListener('click', function() {
            closeLoginModal();
        });
    }
    
    // Login form
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.querySelector('#login-form input[type="email"]').value;
            const password = document.querySelector('#login-form input[type="password"]').value;
            login(email, password);
        });
    }
    
    // Create account link
    if (createAccountLink) {
        createAccountLink.addEventListener('click', function(e) {
            e.preventDefault();
            showRegistrationModal();
        });
    }
    
    // Forgot password link
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            showForgotPasswordModal();
        });
    }
    
    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            checkout();
        });
    }
    
    // Close search bar when clicking outside
    document.addEventListener('click', function(e) {
        if (searchIcon && searchBar && !searchIcon.contains(e.target) && !searchBar.contains(e.target)) {
            searchBar.classList.remove('active');
        }
    });
    
    // Read more buttons
    const readMoreButtons = document.querySelectorAll('#read-more-btn, .service-read-more');
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            showNotification('Read more functionality would show more details here', 'success');
        });
    });
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Message sent successfully! We will get back to you soon.', 'success');
            this.reset();
        });
    }
    
    // Newsletter form
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input[type="email"]');
            if (input.value) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                input.value = '';
            }
        });
    });
}

// Handle page navigation
document.addEventListener('DOMContentLoaded', function() {
    // Update active navigation links
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});