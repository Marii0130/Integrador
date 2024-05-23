let botonesAgregar = document.querySelectorAll(".boton-agregar");
let acumulador = document.querySelector(".acumulador");
let precio = document.querySelector(".precio");

document.addEventListener("DOMContentLoaded", actualizarAcumulador);

function actualizarAcumulador() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let nro = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    acumulador.textContent = nro;
}

botonesAgregar.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


        let productoId = e.target.id;
        let productoPrecio = parseFloat(e.target.parentElement.querySelector('.precio').getAttribute("data-precio"));
        let productoNombre = e.target.parentElement.querySelector('.titulo-producto').getAttribute("data-title");

        let buscarEnCarrito = carrito.find(producto => producto.id === productoId);

        if (buscarEnCarrito) {

            let indiceCarrito = carrito.findIndex(producto => producto.id === productoId);
            carrito[indiceCarrito].cantidad++;
        } else {

            carrito.push({ id: productoId, titulo: productoNombre, cantidad: 1, precio: productoPrecio });
        }


        localStorage.setItem("carrito", JSON.stringify(carrito));


        actualizarAcumulador();
    });
});

