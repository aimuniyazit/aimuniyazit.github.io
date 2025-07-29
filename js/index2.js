// JavaScript for index2.html - Chrome 30 compatible

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

function initializePage() {
    // Set current year in footer
    setCurrentYear();
    
    // Initialize smooth scrolling for back to top button
    initializeBackToTop();
    
    // Add loading states for app icons
    initializeAppIcons();
    
    // Add keyboard navigation support
    initializeKeyboardNavigation();
}

// Set current year in footer
function setCurrentYear() {
    var currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

// Function to open links in new tab
function openLink(url) {
    try {
        window.open(url, '_blank');
    } catch (error) {
        // Fallback for older browsers
        var newWindow = window.open();
        if (newWindow) {
            newWindow.location = url;
        } else {
            // If popup is blocked, navigate in current window
            window.location.href = url;
        }
    }
}

// Smooth scroll to top function
function scrollToTop() {
    // Check if smooth scrolling is supported
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else {
        // Fallback for older browsers
        smoothScrollToTop();
    }
}

// Manual smooth scroll implementation for older browsers
function smoothScrollToTop() {
    var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
        window.requestAnimationFrame = window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            function(callback) { setTimeout(callback, 16); };
        
        window.requestAnimationFrame(function() {
            window.scrollTo(0, currentScroll - (currentScroll / 8));
            smoothScrollToTop();
        });
    }
}

// Initialize back to top button functionality
function initializeBackToTop() {
    var backToTopButton = document.querySelector('.back-to-top');
    if (!backToTopButton) return;
    
    // Show/hide back to top button based on scroll position
    function toggleBackToTopButton() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 300) {
            backToTopButton.style.display = 'flex';
            backToTopButton.style.opacity = '1';
        } else {
            backToTopButton.style.opacity = '0';
            setTimeout(function() {
                if (backToTopButton.style.opacity === '0') {
                    backToTopButton.style.display = 'none';
                }
            }, 300);
        }
    }
    
    // Initially hide the button
    backToTopButton.style.display = 'none';
    backToTopButton.style.opacity = '0';
    backToTopButton.style.transition = 'opacity 0.3s ease';
    
    // Add scroll event listener
    if (window.addEventListener) {
        window.addEventListener('scroll', toggleBackToTopButton);
    } else {
        // Fallback for IE8
        window.attachEvent('onscroll', toggleBackToTopButton);
    }
}

// Initialize app icons with loading states and error handling
function initializeAppIcons() {
    var appIcons = document.querySelectorAll('.app-icon');
    
    for (var i = 0; i < appIcons.length; i++) {
        var icon = appIcons[i];
        var img = icon.querySelector('.app-icon-img');
        
        if (img) {
            // Add loading class
            icon.classList.add('loading');
            
            // Handle image load
            img.onload = function() {
                this.parentNode.parentNode.classList.remove('loading');
            };
            
            // Handle image error
            img.onerror = function() {
                this.parentNode.parentNode.classList.remove('loading');
                this.style.display = 'none';
                
                // Create fallback text
                var fallback = document.createElement('div');
                fallback.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 0.875rem; color: #6b7280; text-align: center; padding: 1rem;';
                fallback.textContent = this.alt || 'Icon';
                this.parentNode.appendChild(fallback);
            };
        }
        
        // Add click feedback
        addClickFeedback(icon);
    }
}

// Add click feedback to elements
function addClickFeedback(element) {
    if (!element) return;
    
    function addActiveClass() {
        element.classList.add('active');
    }
    
    function removeActiveClass() {
        element.classList.remove('active');
    }
    
    // Mouse events
    if (element.addEventListener) {
        element.addEventListener('mousedown', addActiveClass);
        element.addEventListener('mouseup', removeActiveClass);
        element.addEventListener('mouseleave', removeActiveClass);
    } else {
        // Fallback for IE8
        element.attachEvent('onmousedown', addActiveClass);
        element.attachEvent('onmouseup', removeActiveClass);
        element.attachEvent('onmouseleave', removeActiveClass);
    }
    
    // Touch events for mobile
    if ('ontouchstart' in window) {
        element.addEventListener('touchstart', addActiveClass);
        element.addEventListener('touchend', removeActiveClass);
        element.addEventListener('touchcancel', removeActiveClass);
    }
}

// Initialize keyboard navigation
function initializeKeyboardNavigation() {
    var appIcons = document.querySelectorAll('.app-icon');
    
    for (var i = 0; i < appIcons.length; i++) {
        var icon = appIcons[i];
        
        // Make icons focusable
        icon.setAttribute('tabindex', '0');
        icon.setAttribute('role', 'button');
        
        // Add keyboard event listeners
        if (icon.addEventListener) {
            icon.addEventListener('keydown', handleKeyDown);
        } else {
            // Fallback for IE8
            icon.attachEvent('onkeydown', handleKeyDown);
        }
    }
    
    // Handle back to top button keyboard navigation
    var backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        backToTopButton.setAttribute('tabindex', '0');
        if (backToTopButton.addEventListener) {
            backToTopButton.addEventListener('keydown', function(e) {
                if (e.keyCode === 13 || e.keyCode === 32) { // Enter or Space
                    e.preventDefault();
                    scrollToTop();
                }
            });
        } else {
            backToTopButton.attachEvent('onkeydown', function(e) {
                if (e.keyCode === 13 || e.keyCode === 32) {
                    e.preventDefault();
                    scrollToTop();
                }
            });
        }
    }
}

// Handle keyboard navigation for app icons
function handleKeyDown(e) {
    var keyCode = e.keyCode || e.which;
    
    if (keyCode === 13 || keyCode === 32) { // Enter or Space
        e.preventDefault();
        
        // Trigger click event
        if (this.onclick) {
            this.onclick();
        } else {
            // Fallback: look for onclick attribute
            var onclickAttr = this.getAttribute('onclick');
            if (onclickAttr) {
                try {
                    eval(onclickAttr);
                } catch (error) {
                    console.error('Error executing onclick:', error);
                }
            }
        }
    }
}

// Utility function to add CSS class (for older browser compatibility)
function addClass(element, className) {
    if (element.classList) {
        element.classList.add(className);
    } else {
        // Fallback for IE9 and below
        var classes = element.className.split(' ');
        if (classes.indexOf(className) === -1) {
            classes.push(className);
            element.className = classes.join(' ');
        }
    }
}

// Utility function to remove CSS class (for older browser compatibility)
function removeClass(element, className) {
    if (element.classList) {
        element.classList.remove(className);
    } else {
        // Fallback for IE9 and below
        var classes = element.className.split(' ');
        var index = classes.indexOf(className);
        if (index !== -1) {
            classes.splice(index, 1);
            element.className = classes.join(' ');
        }
    }
}

// Debounce function for performance optimization
function debounce(func, wait) {
    var timeout;
    return function executedFunction() {
        var context = this;
        var args = arguments;
        var later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll event with debouncing
if (window.addEventListener) {
    window.addEventListener('scroll', debounce(function() {
        // Additional scroll-based optimizations can be added here
    }, 100));
}

// Handle window resize for responsive adjustments
function handleResize() {
    // Force repaint for better responsive behavior
    var body = document.body;
    if (body) {
        body.style.display = 'none';
        body.offsetHeight; // Trigger reflow
        body.style.display = '';
    }
}

if (window.addEventListener) {
    window.addEventListener('resize', debounce(handleResize, 250));
} else {
    window.attachEvent('onresize', debounce(handleResize, 250));
}

// Error handling for global errors
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Global error:', {
        message: msg,
        source: url,
        line: lineNo,
        column: columnNo,
        error: error
    });
    
    // Don't show error to user, just log it
    return true;
};

// Performance optimization: Preload critical images
function preloadImages() {
    var criticalImages = [
        'images/logohsb.png'
    ];
    
    for (var i = 0; i < criticalImages.length; i++) {
        var img = new Image();
        img.src = criticalImages[i];
    }
}

// Initialize preloading after page load
if (window.addEventListener) {
    window.addEventListener('load', preloadImages);
} else {
    window.attachEvent('onload', preloadImages);
}

// Expose global functions for onclick handlers
window.openLink = openLink;
window.scrollToTop = scrollToTop;