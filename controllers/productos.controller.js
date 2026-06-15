const prisma = require("../prismaClient");

/* =========================
   HELPERS
========================= */

function formatearProducto(producto){

    const stockObj = {};

    producto.stock.forEach(s => {

        stockObj[s.talle] =
            s.cantidad;

    });

    return {

        ...producto,

        stock:stockObj

    };

}

/* =========================
   GET PRODUCTOS
========================= */

const getProductos = async (req, res) => {

    try {

        const productos =
            await prisma.producto.findMany({

                include:{
                    stock:true
                },

                orderBy:{
                    id:"desc"
                }

            });

        const productosFormateados =
            productos.map(
                formatearProducto
            );

        res.json(
            productosFormateados
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje:
                "Error al obtener productos"
        });

    }

};

/* =========================
   GET PRODUCTO BY ID
========================= */

const getProductoById = async (req, res) => {

    try {

        const id =
            parseInt(req.params.id);

        const producto =
            await prisma.producto.findUnique({

                where:{ id },

                include:{
                    stock:true
                }

            });

        if (!producto) {

            return res.status(404).json({
                mensaje:
                    "Producto no encontrado"
            });

        }

        res.json(
            formatearProducto(
                producto
            )
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje:
                "Error al obtener producto"
        });

    }

};

module.exports = {
    getProductos,
    getProductoById
};
