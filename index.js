const express = require("express");
const pug = require("pug");
const app = express();
const traductor = require("node-google-translate-skidz")
const fs = require("fs").promises;

app.use(express.static("public"))

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
            }
        }

        res.render('index', { productos: productos })
    }catch (error) {
            console.error('Error:', error);
            res.status(500).send('Ocurrió un error al procesar su solicitud.');
        }
    });

app.listen(3000, () => {
    console.log("servidor corriendo en el puerto 3000");

});