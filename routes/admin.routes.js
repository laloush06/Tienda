const express = require("express");

const router = express.Router();

const fs = require("fs");

const path = require("path");

const multer = require("multer");

/* =========================
   MULTER
========================= */

const storage = multer.diskStorage({

    destination:(req,file,cb)=>{

        cb(null,"public/img");

    },

    filename:(req,file,cb)=>{

        cb(
            null,
            Date.now() +
            "-" +
            file.originalname
        );

    }

});

const upload = multer({
    storage
});

/* =========================
   JSON
========================= */

const productosPath =
    path.join(
        __dirname,
        "..",
        "data",
        "productos.json"
    );

/* =========================
   HELPERS
========================= */

function obtenerProductos(){

    return JSON.parse(
        fs.readFileSync(
            productosPath,
            "utf-8"
        )
    );

}

function guardarProductos(productos){

    fs.writeFileSync(
        productosPath,
        JSON.stringify(
            productos,
            null,
            2
        )
    );

}

/* =========================
   STOCK
========================= */

function crearStock(body){

    return {

        XS:Number(body.stockXS || 0),

        S:Number(body.stockS || 0),

        M:Number(body.stockM || 0),

        L:Number(body.stockL || 0),

        XL:Number(body.stockXL || 0),

        XXL:Number(body.stockXXL || 0)

    };

}

/* =========================
   ADMIN PAGE
========================= */

router.get("/", (req,res)=>{

    if(!req.session.admin){

        return res.redirect("/");

    }

    const productos =
        obtenerProductos();

    res.render(
        "pages/admin",
        {
            productos,
            productoEditar:null,
            admin:true
        }
    );

});

/* =========================
   CREAR
========================= */

router.post(
    "/crear",
    upload.array("imagenes",10),
    (req,res)=>{

        if(!req.session.admin){

            return res.redirect("/");

        }

        const productos =
            obtenerProductos();

        const stock =
            crearStock(req.body);

        const imagenes =
            req.files &&
            req.files.length > 0
                ? req.files.map(
                    file =>
                        "/img/" +
                        file.filename
                )
                : [];

        const precioOriginal =
            Number(
                req.body.precioOriginal
            );

        const precioOferta =
            Number(
                req.body.precioOferta || 0
            );

        const nuevoProducto = {

            id:
                productos.length > 0
                    ? productos[
                        productos.length - 1
                    ].id + 1
                    : 1,

            nombre:req.body.nombre,

            precio:
                precioOferta > 0
                    ? precioOferta
                    : precioOriginal,

            precioOriginal,

            precioOferta,

            stock,

            equipo:req.body.equipo,

            categoria:req.body.categoria,

            descripcion:req.body.descripcion,

            talles:[
                "XS",
                "S",
                "M",
                "L",
                "XL",
                "XXL"
            ],

            imagenes,

            nuevo:
                req.body.nuevo === "on",

            oferta:
                precioOferta > 0,

            destacado:
                req.body.destacado === "on"

        };

        productos.push(
            nuevoProducto
        );

        guardarProductos(
            productos
        );

        res.redirect("/admin");

    }
);

/* =========================
   EDITAR PAGE
========================= */

router.get(
    "/editar/:id",
    (req,res)=>{

        if(!req.session.admin){

            return res.redirect("/");

        }

        const productos =
            obtenerProductos();

        const productoEditar =
            productos.find(
                p =>
                    p.id ==
                    req.params.id
            );

        if(!productoEditar){

            return res.redirect(
                "/admin"
            );

        }

        res.render(
            "pages/admin",
            {
                productos,
                productoEditar,
                admin:true
            }
        );

    }
);

/* =========================
   EDITAR
========================= */

router.post(
    "/editar/:id",
    upload.array("imagenes",10),
    (req,res)=>{

        if(!req.session.admin){

            return res.redirect("/");

        }

        const productos =
            obtenerProductos();

        const producto =
            productos.find(
                p =>
                    p.id ==
                    req.params.id
            );

        if(!producto){

            return res.redirect(
                "/admin"
            );

        }

        const stock =
            crearStock(req.body);

        producto.nombre =
            req.body.nombre;

        producto.precioOriginal =
            Number(
                req.body.precioOriginal
            );

        producto.precioOferta =
            Number(
                req.body.precioOferta || 0
            );

        producto.precio =
            producto.precioOferta > 0
                ? producto.precioOferta
                : producto.precioOriginal;

        producto.stock =
            stock;

        producto.equipo =
            req.body.equipo;

        producto.categoria =
            req.body.categoria;

        producto.descripcion =
            req.body.descripcion;

        producto.nuevo =
            req.body.nuevo === "on";

        producto.destacado =
            req.body.destacado === "on";

        producto.oferta =
            producto.precioOferta > 0;

        if(
            req.files &&
            req.files.length > 0
        ){

            producto.imagenes =
                req.files.map(
                    file =>
                        "/img/" +
                        file.filename
                );

        }

        guardarProductos(
            productos
        );

        res.redirect("/admin");

    }
);

/* =========================
   ELIMINAR
========================= */

router.post(
    "/eliminar/:id",
    (req,res)=>{

        if(!req.session.admin){

            return res.redirect("/");

        }

        let productos =
            obtenerProductos();

        productos =
            productos.filter(
                p =>
                    p.id !=
                    req.params.id
            );

        guardarProductos(
            productos
        );

        res.redirect("/admin");

    }
);

module.exports = router;
