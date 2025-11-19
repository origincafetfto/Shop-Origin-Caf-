// Global Variables
let cart = [];
let cartTotal = 0;

// Contact Information
const INSTAGRAM_USERNAME = "origin_tfto"; // Your Instagram username from the URL

// DOM Elements
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotalElement = document.getElementById('cartTotal');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeScrollAnimations();
    initializeParallaxEffects();
    loadCartFromStorage();
    updateCartUI();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll to products section
function scrollToProducts() {
    document.getElementById('productos').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Add to cart functionality
function addToCart(size, price) {
    const existingItem = cart.find(item => item.size === size);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            size: size,
            price: price,
            quantity: 1,
            name: `Café ORIGIN Finca Los Robles ${size}`
        });
    }
    
    updateCart();
    showAddToCartAnimation();
}

// Remove from cart
function removeFromCart(size) {
    cart = cart.filter(item => item.size !== size);
    updateCart();
}

// Update cart UI
function updateCart() {
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    updateCartCount();
    updateCartDisplay();
    saveCartToStorage();
}

// Update cart count in navigation
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (totalItems > 0) {
        cartCount.style.display = 'flex';
        // Add bounce animation
        cartCount.style.animation = 'bounce 0.5s ease-in-out';
        setTimeout(() => {
            cartCount.style.animation = '';
        }, 500);
    } else {
        cartCount.style.display = 'none';
    }
}

// Update cart display
function updateCartDisplay() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        cartTotalElement.textContent = '$0';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price} x ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.size}')">
                ×
            </button>
        </div>
    `).join('');
    
    cartTotalElement.textContent = `$${cartTotal}`;
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('originCafeCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('originCafeCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Update entire cart UI
function updateCartUI() {
    updateCartCount();
    updateCartDisplay();
}

// Generate WhatsApp message from cart
function generateWhatsAppMessage() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. ¡Agrega algunos cafés primero!');
        return null;
    }

    const timestamp = new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    let message = `☕ *PEDIDO ORIGIN CAFÉ* ☕\n\n`;
    message += `📅 *Fecha:* ${timestamp}\n\n`;
    message += `🛒 *Productos:*\n`;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   💰 Precio: $${item.price} x ${item.quantity} = $${item.price * item.quantity}\n\n`;
    });
    
    message += `💳 *TOTAL: $${cartTotal}*\n\n`;
    message += `🌱 *Origen:* Finca Los Robles, Yecuatla, Veracruz\n`;
    message += `🏔️ *Altitud:* 1200m sobre el nivel del mar\n`;
    message += `✅ *Certificado:* Orgánico\n\n`;
    message += `*The f*cking true origin*\n\n`;
    message += `¿Está correcto tu pedido? 😊`;
    
    return encodeURIComponent(message);
}

// Generate Instagram message (shorter version)
function generateInstagramMessage() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. ¡Agrega algunos cafés primero!');
        return null;
    }

    let message = `☕ Pedido ORIGIN CAFÉ!\n\n`;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   $${item.price} x ${item.quantity} = $${item.price * item.quantity}\n`;
    });
    
    message += `\n💳 Total: $${cartTotal}\n`;
    message += `Origen: Finca Los Robles, Veracruz\n`;
    message += `#OriginCafe #CafeOrganico #Mexico`;
    
    return encodeURIComponent(message);
}

// Open WhatsApp with cart message
function proceedToWhatsApp() {
    const message = generateWhatsAppMessage();
    if (!message) return;
    
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappURL, '_blank');
    
    // Clear cart after opening WhatsApp
    setTimeout(() => {
        cart = [];
        updateCart();
        closeCart();
        showOrderConfirmation('WhatsApp');
    }, 1000);
}

// Open Instagram with pre-filled message
function proceedToInstagram() {
    const message = generateInstagramMessage();
    if (!message) return;
    
    // Copy message to clipboard and open Instagram profile
    copyToClipboard(message);
    
    // Open Instagram profile directly
    window.open('https://www.instagram.com/origin_tfto?igsh=Y24ydTFiYWZ1N3Fi&utm_source=qr', '_blank');
    
    // Clear cart and show confirmation
    setTimeout(() => {
        cart = [];
        updateCart();
        closeCart();
        showOrderConfirmation('Instagram');
        showInstagramInstructions();
    }, 1500);
}

// Show Instagram contact options
function showInstagramOptions(message) {
    const modal = document.createElement('div');
    modal.className = 'instagram-modal';
    modal.innerHTML = `
        <div class="instagram-modal-content">
            <div class="instagram-modal-header">
                <h3>📱 Contactar por Instagram</h3>
                <button class="instagram-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="instagram-modal-body">
                <p>¡Tu pedido está listo! Elige cómo contactarnos:</p>
                <div class="instagram-options">
                    <button class="instagram-option" onclick="copyToClipboard('${message}')">
                        📋 Copiar mensaje
                    </button>
                    <a href="https://instagram.com/${INSTAGRAM_USERNAME}" target="_blank" class="instagram-option">
                        🔗 Ir a Instagram
                    </a>
                    <button class="instagram-option secondary" onclick="window.location.href='https://instagram.com/direct/inbox/';">
                        📨 Abrir DM
                    </button>
                </div>
                <p class="instagram-instructions">
                    1. Copia el mensaje<br>
                    2. Ve a Instagram<br>
                    3. Envíanos un DM con el mensaje pegado
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add animation
    setTimeout(() => modal.classList.add('active'), 10);
}

// Copy message to clipboard
function copyToClipboard(message) {
    const decodedMessage = decodeURIComponent(message);
    navigator.clipboard.writeText(decodedMessage).then(() => {
        showCopyConfirmation();
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = decodedMessage;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopyConfirmation();
    });
}

// Show copy confirmation
function showCopyConfirmation() {
    const confirmation = document.createElement('div');
    confirmation.className = 'copy-confirmation';
    confirmation.textContent = '¡Mensaje copiado!';
    document.body.appendChild(confirmation);
    
    setTimeout(() => confirmation.classList.add('show'), 10);
    setTimeout(() => {
        confirmation.remove();
    }, 2000);
}

// Show order confirmation
function showOrderConfirmation(platform) {
    const confirmation = document.createElement('div');
    confirmation.className = 'order-confirmation';
    confirmation.innerHTML = `
        <div class="order-confirmation-content">
            <span class="order-icon">✅</span>
            <p>¡Pedido enviado por ${platform}!</p>
            <small>Te contactaremos pronto para confirmar tu pedido</small>
        </div>
    `;
    
    document.body.appendChild(confirmation);
    
    setTimeout(() => confirmation.classList.add('show'), 10);
    setTimeout(() => {
        confirmation.remove();
    }, 4000);
}

// Show Instagram instructions
function showInstagramInstructions() {
    const instruction = document.createElement('div');
    instruction.className = 'instagram-instruction';
    instruction.innerHTML = `
        <div class="instagram-instruction-content">
            <span class="instruction-icon">📸</span>
            <div class="instruction-text">
                <h4>¡Instagram abierto!</h4>
                <p>1. Ve a la sección de mensajes (DM)<br>
                2. Busca "Origin Café" o usa la búsqueda<br>
                3. Pega el mensaje (ya está copiado)<br>
                4. ¡Envía tu pedido!</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(instruction);
    
    setTimeout(() => instruction.classList.add('show'), 10);
    setTimeout(() => {
        instruction.remove();
    }, 8000);
}

// Show cart modal
function showCart() {
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close cart modal
function closeCart() {
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Cart button click event
cartBtn.addEventListener('click', showCart);

// Close cart when clicking outside
cartModal.addEventListener('click', function(e) {
    if (e.target === cartModal) {
        closeCart();
    }
});

// Close cart with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cartModal.classList.contains('active')) {
        closeCart();
    }
});

// Add to cart animation
function showAddToCartAnimation() {
    // Create a temporary element to show the animation
    const animation = document.createElement('div');
    animation.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #28A745;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 9999;
        pointer-events: none;
        animation: fadeInScale 0.8s ease-out forwards;
    `;
    animation.textContent = '¡Añadido al carrito!';
    
    document.body.appendChild(animation);
    
    // Remove animation after delay
    setTimeout(() => {
        animation.remove();
    }, 800);
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Add animation class to elements
    const animateElements = document.querySelectorAll('.product-card, .origin-text, .origin-visual, .section-header');
    animateElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

// Initialize parallax effects
function initializeParallaxEffects() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero::before, .origin::before');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(244, 164, 146, 0.95)';
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.background = 'rgba(244, 164, 146, 0.9)';
        nav.style.boxShadow = 'none';
    }
});

// Product card hover effects
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
        if (this.classList.contains('featured')) {
            this.style.transform = 'translateY(-8px) scale(1.05)';
        } else {
            this.style.transform = 'translateY(0)';
        }
    });
});

// Button click animations
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Smooth reveal animation for hero elements
function animateHeroElements() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const ctaButton = document.querySelector('.cta-btn');
    
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroTitle.style.transition = 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);
    }
    
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroSubtitle.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 600);
    }
    
    if (heroDescription) {
        heroDescription.style.opacity = '0';
        heroDescription.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroDescription.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
            heroDescription.style.opacity = '1';
            heroDescription.style.transform = 'translateY(0)';
        }, 900);
    }
    
    if (ctaButton) {
        ctaButton.style.opacity = '0';
        ctaButton.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            ctaButton.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
            ctaButton.style.opacity = '1';
            ctaButton.style.transform = 'translateY(0)';
        }, 1200);
    }
}

// Initialize hero animations
setTimeout(animateHeroElements, 100);

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInScale {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
const throttledScroll = throttle(function() {
    const scrolled = window.pageYOffset;
    
    // Update navbar opacity
    const nav = document.querySelector('.nav');
    const opacity = Math.min(0.95, 0.9 + (scrolled / 1000) * 0.1);
    nav.style.background = `rgba(244, 164, 146, ${opacity})`;
    
    // Parallax effect for hero background
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
}, 16); // ~60fps

window.addEventListener('scroll', throttledScroll);

// Loading state management
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('.scroll-animate').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('in-view');
            }, index * 100);
        });
    }, 500);
});

// Error handling for localStorage
function safeLocalStorageSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.warn('LocalStorage is not available:', e);
    }
}

function safeLocalStorageGet(key) {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        console.warn('LocalStorage is not available:', e);
        return null;
    }
}

// Update storage functions to use safe methods
function saveCartToStorage() {
    safeLocalStorageSet('originCafeCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = safeLocalStorageGet('originCafeCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            console.warn('Error parsing cart data:', e);
            cart = [];
        }
    }
}

// Touch gesture support for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleGesture();
});

function handleGesture() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - could trigger scroll to next section
            console.log('Swiped up');
        } else {
            // Swipe down - could trigger scroll to previous section
            console.log('Swiped down');
        }
    }
}

// Accessibility improvements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Update add to cart to include accessibility announcement
function addToCart(size, price) {
    const existingItem = cart.find(item => item.size === size);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            size: size,
            price: price,
            quantity: 1,
            name: `Café ORIGIN Finca Los Robles ${size}`
        });
    }
    
    updateCart();
    showAddToCartAnimation();
    announceToScreenReader(`Añadido al carrito: Café ORIGIN Finca Los Robles ${size}`);
}
