const fs = require("fs");
const path = require("path");

function obtenerProductos() {

    const ruta = path.join(
        __dirname,
        "..",
        "data",
        "productos.json"
    );

    return JSON.parse(
        fs.readFileSync(
            ruta,
            "utf8"
        )
    );
}

const getProductos = (req, res) => {

    try {

        const productos =
            obtenerProductos();

        res.json(productos);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener productos"
        });

    }

};

const getProductoById = (req, res) => {

    try {

        const id =
            parseInt(req.params.id);

        const productos =
            obtenerProductos();

        const producto =
            productos.find(
                p => p.id === id
            );

        if (!producto) {

            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });

        }

        res.json(producto);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener producto"
        });

    }

};

module.exports = {
    getProductos,
    getProductoById
};