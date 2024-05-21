document.addEventListener('DOMContentLoaded', () => {
    const btnComprar = document.getElementById("comprar");
    
    btnComprar.addEventListener("click", () => {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        
        fetch("/comprar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(carrito)
        })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                alert("Error al realizar la compra: " + result.message);
            } else {
                alert("Compra realizada con éxito");
                localStorage.removeItem("carrito");

            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Ocurrió un error al realizar la compra");
        });
    });

    window.decrementarCantidad = function(productId) {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const productoEnCarrito = carrito.find(item => item.id === productId);
        if (productoEnCarrito && productoEnCarrito.cantidad > 1) {
            productoEnCarrito.cantidad--;
            localStorage.setItem("carrito", JSON.stringify(carrito));
        }
    };

    window.incrementarCantidad = function(productId) {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const productoEnCarrito = carrito.find(item => item.id === productId);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
            localStorage.setItem("carrito", JSON.stringify(carrito));
        }
    };

    window.eliminarDelCarrito = function(productId) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito = carrito.filter(item => item.id !== productId);
        localStorage.setItem("carrito", JSON.stringify(carrito));
    };
});