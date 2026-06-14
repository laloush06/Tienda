const express = require("express");

const router = express.Router();

const fs = require("fs");

const path = require("path");

const multer = require("multer");

// =========================
// MULTER
// =========================

const storage =
    multer.diskStorage({

        destination:(req,file,cb) => {

            cb(
                null,
                path.join(
                    __dirname,
                    "..",
                    "public",
                    "uploads"
                )
            );

        },

        filename:(req,file,cb) => {

            const uniqueName =
                Date.now() +
                "-" +
                file.originalname;

            cb(
                null,
                uniqueName
            );

        }

    });

const upload =
    multer({
        storage
    });

// =========================
// DATA
// =========================

const productosPath =
    path.join(
        __dirname,
        "..",
        "data",
        "productos.json"
    );

// =========================
// HELPERS
// =========================

function leerProductos(){

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
            4
        )
    );

}

// =========================
// ADMIN
// =========================

router.get("/", (req, res) => {

    const productos =
        leerProductos();

    res.render(
        "pages/admin",
        {
            productos
        }
    );

});

// =========================
// AGREGAR
// =========================

router.post(
    "/agregar",
    upload.array(
        "imagenes",
        10
    ),
    (req, res) => {

        const productos =
            leerProductos();

        const talles =
            Array.isArray(
                req.body.talles
            )
            ? req.body.talles
            : [req.body.talles];

        const imagenes =
            req.files.map(file =>
                "/uploads/" +
                file.filename
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

            tipo:req.body.tipo,

            categoria:req.body.categoria,

            talles,

            imagenes

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

// =========================
// EDITAR PAGE
// =========================

router.get(
    "/editar/:id",
    (req, res) => {

        const productos =
            leerProductos();

        const producto =
            productos.find(
                p =>
                    p.id ==
                    req.params.id
            );

        if(!producto){

            return res.send(
                "Producto no encontrado"
            );

        }

        res.render(
            "pages/editar-producto",
            {
                producto
            }
        );

    }
);

// =========================
// GUARDAR EDICION
// =========================

router.post(
    "/editar/:id",
    upload.array(
        "imagenes",
        10
    ),
    (req, res) => {

        const productos =
            leerProductos();

        const index =
            productos.findIndex(
                p =>
                    p.id ==
                    req.params.id
            );

        if(index === -1){

            return res.send(
                "Producto no encontrado"
            );

        }

        const talles =
            Array.isArray(
                req.body.talles
            )
            ? req.body.talles
            : [req.body.talles];

        let imagenes =
            productos[index].imagenes;

        if(req.files.length > 0){

            imagenes =
                req.files.map(file =>
                    "/uploads/" +
                    file.filename
                );

        }

        productos[index] = {

            ...productos[index],

            nombre:req.body.nombre,

            precio:Number(
                req.body.precio
            ),

            equipo:req.body.equipo,

            tipo:req.body.tipo,

            categoria:req.body.categoria,

            talles,

            imagenes

        };

        guardarProductos(
            productos
        );

        res.redirect("/admin");

    }
);

// =========================
// ELIMINAR
// =========================

router.post(
    "/eliminar/:id",
    (req, res) => {

        const productos =
            leerProductos();

        const nuevosProductos =
            productos.filter(
                p =>
                    p.id !=
                    req.params.id
            );

        guardarProductos(
            nuevosProductos
        );

        res.redirect("/admin");

    }
);

module.exports = router;