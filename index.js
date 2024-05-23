const express = require("express");
const pug = require("pug");
const app = express();
const traductor = require("node-google-translate-skidz")
const fs = require("fs").promises;
const path = require('path');

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.join(__dirname, "vistas")));

app.set("view engine", "pug");
app.set("views", "./vistas");

async function traducir(texto) {
    const traduccion = await traductor({
        text: texto,
        source: 'en',
        target: 'es'
    });
    return traduccion.translation;
}

app.get('/', async (req, res) => {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const productos = await response.json();

        for (const producto of productos) {
            producto.title = await traducir(producto.title);
            producto.description = await traducir(producto.description);
            producto.category = await traducir(producto.category);
        }

        let descuentos = await fs.readFile("descuentos.json", "utf8");
        descuentos = JSON.parse(descuentos);
        let desc;
        for (const producto of productos) {
            desc = descuentos.filter(descuento => {
                return descuento.id === producto.id
            })
            if (desc.length > 0) {
                producto.descuento = desc[0].descuento;
                producto.precioDescontado = producto.price * (desc[0].descuento / 100);
            }
        }

        res.render('index', { productos: productos })
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Ocurrió un error al procesar su solicitud.');
    }
});

app.get('/carrito', (req, res) => {
    res.render('carrito', { productos: [] })
})

app.post('/comprar', async (req, res) => {
    try {
        const compra = req.body
        let compras = await fs.readFile("compras.json");
        compras = JSON.parse(compras);
        console.log(compras)
        const ids = compras.map((compra) => {
            return compra.id;
        })
        const id = Math.max(...ids) + 1;
        const nuevaCompra = {
            id: id,
            total: compra.total,
            productos: compra.productos
        };
        compras.push(nuevaCompra)
        await fs.writeFile('compras.json', JSON.stringify(compras));
        res.json({ error: false, message: "Su compra fue registrada" });
        console.log(compras)
    } catch (error) {
        res.json({ error: true, message: error.message });
    }
})

app.listen(3000, () => {
    console.log("servidor corriendo en el puerto 3000");

});