document.addEventListener('DOMContentLoaded', () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const carritoContainer = document.querySelector('.carrito');
    const contadorCarrito = document.getElementById('contador-carrito');

    function actualizarCarrito() {
        carritoContainer.innerHTML = '';

        if (carrito.length === 0) {
            carritoContainer.innerHTML = '<p>No hay productos en el carrito.</p>';
            return;
        }

        carrito.forEach(item => {
            const productoElement = document.createElement('div');
            productoElement.className = 'cart-item';
            productoElement.innerHTML = `
                <h2>${item.title}</h2>
                <p>Cantidad: ${item.cantidad}</p>
                <p>Precio: $ ${item.price.toFixed(2)}</p>
                <button onclick="removeFromCart(${item.id})">Eliminar</button>
            `;
            carritoContainer.appendChild(productoElement);
        });

        const comprarButton = document.createElement('button');
        comprarButton.textContent = 'Comprar';
        comprarButton.onclick = comprar;
        carritoContainer.appendChild(comprarButton);
    }

    window.removeFromCart = function(productId) {
        const index = carrito.findIndex(item => item.id === productId);
        if (index > -1) {
            carrito.splice(index, 1);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            actualizarCarrito();
            actualizarContadorCarrito();
        }
    };

    window.comprar = function() {
        fetch('/comprar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carrito),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Error al realizar la compra: ' + data.message);
            } else {
                alert('Compra realizada con éxito');
                localStorage.removeItem('carrito');
                actualizarCarrito();
                actualizarContadorCarrito();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    function actualizarContadorCarrito() {
        contadorCarrito.textContent = carrito.length;
        if (carrito.length > 0) {
            contadorCarrito.style.display = 'block';
        } else {
            contadorCarrito.style.display = 'none';
        }
    }

    actualizarCarrito();
    actualizarContadorCarrito();
});

function agregarAlCarrito() {
  contadorCarrito++;
  document.getElementById('contador-carrito').textContent = contadorCarrito;
  document.getElementById('contador-carrito').style.display = 'block';
}

function abrirCarrito() {
    window.location.href = "/carrito"; // Redirigir al usuario al archivo Pug de la página del carrito
  }