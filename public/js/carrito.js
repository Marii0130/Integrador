const resumen = document.querySelector(".resumen");
const compra = document.querySelector(".finalizarCompra");
const acumulador = document.querySelector(".acumulador");
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const total = document.createElement("p");
total.classList.add("total");
compra.appendChild(total);


function actualizarAcumulador() {
    let nro = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    acumulador.textContent = nro;
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarAcumulador();
    renderizarCarrito();
});

function renderizarCarrito() {
    resumen.innerHTML = ''; // Limpiar el contenido previo del contenedor. esto me permite actualizar el contenido del html para que no me duplique los elementos
    if (carrito.length === 0) {
        const nuevoElemento = document.createElement("div");
        nuevoElemento.innerHTML = `
            <div class=elementoRes>
            <p>El carrito está vacío</p>
            </div>
        `;
        total.textContent = "";
        resumen.appendChild(nuevoElemento);
        btnComprar.style.display = 'none';
       
    } else {
        carrito.forEach(producto => {
            const nuevoElemento = document.createElement("div");
            nuevoElemento.innerHTML = `
            <div class=elementoRes>
            <p>${producto.titulo}</p>
            <p>Precio: $ ${producto.precio}</p>
            <div class= botones>
            <button class="btnRestar ${producto.cantidad === 1 ? 'disabled' : ''}" data-id="${producto.id}" ${producto.cantidad === 1 ? 'disabled' : ''}>-</button>
            <span>Cantidad: ${producto.cantidad}</span>
            <button class="btnSumar" data-id="${producto.id}">+</button>
            <br> <br>
            <button class="btnEliminar" data-id="${producto.id}"><i class="bi bi-trash3"></i> Eliminar</button>
            
            </div>
            </div>
        `;
            resumen.appendChild(nuevoElemento);
        });
        total.textContent = `Total: $ ${calcularPrecio(carrito)}`;
    }
    
}

const btnComprar = document.createElement("button");
btnComprar.textContent = "Comprar";
btnComprar.classList.add("btnComprar");
compra.appendChild(btnComprar);

resumen.addEventListener("click", (e) => {
    if (e.target.classList.contains("btnSumar")) {
        const productId = e.target.getAttribute("data-id");
        sumarCantidad(productId);
    } 
     if (e.target.classList.contains("btnRestar")) {
        const productId = e.target.getAttribute("data-id");
        restarCantidad(productId);
    }else if(e.target.classList.contains("btnEliminar")){
        const productId = e.target.getAttribute("data-id");
        eliminarProducto(productId)
    }
});

function sumarCantidad(productId) {
    const producto = carrito.find(producto => producto.id === productId);
    if (producto) {
        producto.cantidad++;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarAcumulador();
        renderizarCarrito();
    }
}

function restarCantidad(productId) {
    const indiceProducto = carrito.findIndex(producto => producto.id === productId);
    if (indiceProducto !== -1 && carrito[indiceProducto].cantidad > 1) {
        carrito[indiceProducto].cantidad--;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarAcumulador();
        renderizarCarrito();
    }
}

function eliminarProducto(productId){
    console.log("Intentando eliminar producto con ID:", productId);
    const indiceProducto = carrito.findIndex(producto => producto.id === productId);
    
        carrito.splice(indiceProducto, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarAcumulador();
        renderizarCarrito();
       
        console.log("Producto eliminado con éxito");   
}


function enviarCompra() {
    const carritoCompra = carrito.map(producto => ({
        id: producto.id,
        title: producto.titulo,
        cantidad: producto.cantidad,
        price: producto.precio
    }));
    const totalCompra = calcularPrecio(carrito);
    const compra = {
        total: totalCompra,
        productos: carritoCompra
    };
    fetch("/comprar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(compra)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud de compra');
        }
        return response.json();
    }).then(data => {
        console.log("Mensaje del servidor:", data.mensaje);
        localStorage.removeItem("carrito");
        carrito.length = 0;
        actualizarAcumulador();
        resumen.innerHTML = '';
        const nuevoElemento = document.createElement("div");
        nuevoElemento.innerHTML = `
            <div class=elementoRes>
            <p>Realizaste la compra con éxito!</p>
            </div>
        `;
        resumen.appendChild(nuevoElemento);
        total.textContent = '';
        btnComprar.style.display = 'none';
        //renderizarCarrito();
    }).catch(error => {
        console.log("Error", error);
    });
}
btnComprar.addEventListener("click", enviarCompra);

function calcularPrecio(carrito) {
    const precioTotal = carrito.reduce((total, producto) => {
        return total + (producto.precio * producto.cantidad);
    }, 0);
    return precioTotal.toFixed(2);
    
}

console.log("resultado precio y cantidad: "+ calcularPrecio(carrito));