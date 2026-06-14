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

        cb(
            null,
            "public/img"
        );

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
   JSON PATH
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
   ADMIN HOME
========================= */

router.get("/", (req,res)=>{

    const productos =
        obtenerProductos();

    res.render(
        "pages/admin",
        {
            productos,
            productoEditar:null
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

        const productos =
            obtenerProductos();

        const imagenes =
            req.files.map(file =>
                "/img/" + file.filename
            );

        const nuevoProducto = {

            id:
                productos.length > 0
                    ? productos[
                        productos.length - 1
                    ].id + 1
                    : 1,

            nombre:req.body.nombre,

            precio:Number(
                req.body.precio
            ),

            equipo:req.body.equipo,

            categoria:req.body.categoria,

            descripcion:req.body.descripcion,

            talles:
                Array.isArray(
                    req.body.talles
                )
                ? req.body.talles
                : [req.body.talles],

            imagenes,

            nuevo:
                req.body.nuevo === "on",

            oferta:
                req.body.oferta === "on",

            destacado:
                req.body.destacado === "on"

        };

        productos.push(
            nuevoProducto
        );

        guardarProductos(
            productos
        );

        res.redirect(
            "/admin"
        );

    }
);

/* =========================
   EDITAR PAGE
========================= */

router.get(
    "/editar/:id",
    (req,res)=>{

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
                productoEditar
            }
        );

    }
);

/* =========================
   GUARDAR EDICION
========================= */

router.post(
    "/editar/:id",
    upload.array("imagenes",10),
    (req,res)=>{

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

        // =========================
        // ACTUALIZAR CAMPOS
        // =========================

        producto.nombre =
            req.body.nombre;

        producto.precio =
            Number(
                req.body.precio
            );

        producto.equipo =
            req.body.equipo;

        producto.categoria =
            req.body.categoria;

        producto.descripcion =
            req.body.descripcion;

        producto.talles =
            Array.isArray(
                req.body.talles
            )
            ? req.body.talles
            : [req.body.talles];

        producto.nuevo =
            req.body.nuevo === "on";

        producto.oferta =
            req.body.oferta === "on";

        producto.destacado =
            req.body.destacado === "on";

        // =========================
        // NUEVAS IMAGENES
        // =========================

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

        // =========================
        // GUARDAR JSON
        // =========================

        guardarProductos(
            productos
        );

        res.redirect(
            "/admin"
        );

    }
);

/* =========================
   ELIMINAR
========================= */

router.post(
    "/eliminar/:id",
    (req,res)=>{

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

        res.redirect(
            "/admin"
        );

    }
);

module.exports = router;