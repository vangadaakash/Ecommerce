document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.getElementById("cartItems");
    const clearCartBtn = document.getElementById("clearCartBtn");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const cartCountBadge = document.getElementById("cartCount");

    // ✅ Get the current logged-in user
    function getCurrentUser() {
        return localStorage.getItem("currentUser");
    }

    // ✅ Update the cart count in the navbar
    function updateCartCount() {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            cartCountBadge.textContent = "0"; // Default to 0
            cartCountBadge.style.display = "none"; // Hide badge when no user
            return;
        }

        let cart = JSON.parse(localStorage.getItem(`cart_${currentUser}`)) || [];
        let itemCount = cart.length;

        cartCountBadge.textContent = itemCount;
        cartCountBadge.style.display = itemCount > 0 ? "inline-block" : "none"; // Hide if empty
    }

    // ✅ Load cart items
    function loadCart() {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            cartItemsContainer.innerHTML = "<p class='text-center'>Please log in to view your cart.</p>";
            if (clearCartBtn) clearCartBtn.style.display = "none";
            updateCartCount(); // Ensure cart count updates
            return;
        }

        let cart = JSON.parse(localStorage.getItem(`cart_${currentUser}`)) || [];
        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p class='text-center'>Your cart is empty.</p>";
            if (clearCartBtn) clearCartBtn.style.display = "none";
        } else {
            if (clearCartBtn) clearCartBtn.style.display = "block";

            cart.forEach((item, index) => {
                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item", "d-flex", "justify-content-between", "align-items-center", "border", "p-2", "mb-2");
                cartItem.innerHTML = `
                    <p class="m-0">${item.name} - <strong>$${item.price}</strong></p>
                    <button class="btn btn-danger btn-sm remove-item" data-index="${index}">Remove</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }

        updateCartCount(); // ✅ Update cart count
    }

    // ✅ Show Toast Message
    function showToast(message) {
        const toastEl = document.getElementById("toastMessage");
        if (toastEl) {
            toastEl.querySelector(".toast-body").innerText = message;
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        }
    }

    // ✅ Add Items to Cart
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-to-cart")) {
            const productId = event.target.getAttribute("data-id");

            fetch("products.json")
                .then(response => response.json())
                .then(data => {
                    const product = data.find(p => p.id == productId);
                    if (product) addToCart(product);
                })
                .catch(error => console.error("Error loading products:", error));
        }
    });

    function addToCart(product) {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            alert("Please log in to add items to the cart.");
            return;
        }

        let cart = JSON.parse(localStorage.getItem(`cart_${currentUser}`)) || [];
        cart.push(product);
        localStorage.setItem(`cart_${currentUser}`, JSON.stringify(cart));

        updateCartCount(); // ✅ Update count after adding
        loadCart();
        showToast(`${product.name} added to cart!`);
    }

    // ✅ Remove Items from Cart
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-item")) {
            const index = event.target.getAttribute("data-index");
            const currentUser = getCurrentUser();
            if (!currentUser) return;

            let cart = JSON.parse(localStorage.getItem(`cart_${currentUser}`)) || [];
            const removedProduct = cart.splice(index, 1)[0];
            localStorage.setItem(`cart_${currentUser}`, JSON.stringify(cart));

            updateCartCount(); // ✅ Update count after removing
            loadCart();
            showToast(`${removedProduct.name} removed from cart!`);
        }
    });

    // ✅ Clear Cart
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", function () {
            const currentUser = getCurrentUser();
            if (!currentUser) return;

            localStorage.setItem(`cart_${currentUser}`, JSON.stringify([]));

            updateCartCount(); // ✅ Update count after clearing
            loadCart();
            showToast("Cart cleared!");
        });
    }

    // ✅ Checkout Handling
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function () {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                alert("Please log in before proceeding to checkout.");
                return;
            }

            let cart = JSON.parse(localStorage.getItem(`cart_${currentUser}`)) || [];
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            window.location.href = "checkout.html";
        });
    }

    // ✅ Initialize
    updateCartCount(); // ✅ Ensure cart count starts at 0
    loadCart();
});
