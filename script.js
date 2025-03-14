document.addEventListener("DOMContentLoaded", function () {
    const productList = document.getElementById("productList");
    const searchInput = document.getElementById("search");
    const categoryList = document.getElementById("categoryList");
    const sortSelect = document.getElementById("sortOptions");
    const cartCount = document.getElementById("cartCount");

    let products = [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let filteredProducts = [];

    // Fetch and Load Products
    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            products = data;
            filteredProducts = products;
            displayCategories(products);
            displayProducts(products);
            updateCartCount();
        });

    // Display Product Categories
    function displayCategories(items) {
        const categories = [...new Set(items.map(product => product.category))];
        categoryList.innerHTML = `<li><a class="dropdown-item category-btn" data-category="All" href="#">All</a></li>`;
        categories.forEach(category => {
            categoryList.innerHTML += `<li><a class="dropdown-item category-btn" data-category="${category}" href="#">${category}</a></li>`;
        });
    }

    // ✅ Updated Grid Layout for Responsive Product Display
    function displayProducts(items) {
        productList.innerHTML = "";
        if (items.length === 0) {
            productList.innerHTML = "<h4 class='text-center'>No products found</h4>";
            return;
        }

        productList.innerHTML = items.map(product => `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card h-100">
                    <img src="assets/${product.image}" class="card-img-top" alt="${product.name}" 
                    onerror="this.onerror=null; this.src='assets/default.jpg';">
                    <div class="card-body text-center">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">$${product.price}</p>
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `).join("");
    }

    // ✅ Optimized Search with Debounce (Improves Performance)
    let debounceTimer;
    searchInput.addEventListener("input", function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const searchTerm = searchInput.value.toLowerCase();
            filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm));
            applySorting();
        }, 300);
    });

    // ✅ Sort Products
    sortSelect.addEventListener("change", applySorting);

    function applySorting() {
        const criteria = sortSelect.value;
        if (criteria === "low-to-high") {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (criteria === "high-to-low") {
            filteredProducts.sort((a, b) => b.price - a.price);
        }
        displayProducts(filteredProducts);
    }

    // ✅ Filter by Category
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("category-btn")) {
            event.preventDefault();
            const category = event.target.getAttribute("data-category");
            filteredProducts = category === "All" ? products : products.filter(product => product.category === category);
            applySorting();
        }
    });

    // ✅ Add to Cart
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-to-cart")) {
            const productId = event.target.getAttribute("data-id");
            const product = products.find(p => p.id == productId);

            if (!cart.some(item => item.id === product.id)) {
                cart.push(product);
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                showToast(`${product.name} added to cart!`);
            } else {
                showToast(`${product.name} is already in the cart!`);
            }
        }
    });

    // ✅ Update Cart Count
    function updateCartCount() {
        cartCount.innerText = cart.length;
    }

    // ✅ Show Toast Notification
    function showToast(message) {
        let toastContainer = document.getElementById("toastContainer");
        if (!toastContainer) {
            toastContainer = document.createElement("div");
            toastContainer.id = "toastContainer";
            toastContainer.classList.add("toast-container", "position-fixed", "top-0", "end-0", "p-3");
            toastContainer.style.zIndex = "1050";
            document.body.appendChild(toastContainer);
        }

        const toastEl = document.createElement("div");
        toastEl.classList.add("toast", "show", "fade", "mb-2");
        toastEl.innerHTML = `
            <div class="toast-body bg-success text-white rounded">
                ${message}
                <button type="button" class="btn-close btn-close-white float-end" data-bs-dismiss="toast"></button>
            </div>`;

        toastContainer.appendChild(toastEl);
        setTimeout(() => toastEl.remove(), 3000);
    }

    updateCartCount();
});

