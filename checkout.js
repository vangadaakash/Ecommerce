document.addEventListener("DOMContentLoaded", function () {
    const orderSummary = document.getElementById("orderSummary");
    const checkoutForm = document.getElementById("checkoutForm");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function displayOrderSummary() {
        if (cart.length === 0) {
            orderSummary.innerHTML = "<h4 class='text-center text-danger'>Your cart is empty! Redirecting to cart...</h4>";
            setTimeout(() => {
                window.location.href = "cart.html"; // Redirect to cart if empty
            }, 2000);
            checkoutForm.style.display = "none"; // Hide form
            return;
        }

        let totalPrice = 0;
        let summaryHTML = `<h4>Order Summary</h4><ul class="list-group">`;

        cart.forEach(item => {
            totalPrice += item.price;
            summaryHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${item.name} - $${item.price}
                </li>`;
        });

        summaryHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center fw-bold">
                Total: $${totalPrice.toFixed(2)}
            </li>
        </ul>`;

        orderSummary.innerHTML = summaryHTML;
    }

    // Handle Checkout Form Submission
    checkoutForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get Form Data
        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const address = document.getElementById("address").value.trim();
        const paymentMethod = document.getElementById("paymentMethod").value;

        if (!fullName || !email || !address || !paymentMethod) {
            alert("⚠️ Please fill out all fields before placing an order!");
            return;
        }

        // Simulate Order Processing
        setTimeout(() => {
            alert(`🎉 Thank you, ${fullName}! Your order has been placed successfully.`);
            localStorage.removeItem("cart"); // Clear Cart after checkout
            window.location.href = "index.html"; // Redirect to Home
        }, 1000);
    });

    displayOrderSummary();
});
