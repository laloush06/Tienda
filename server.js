const express = require("express");

const path = require("path");

const fs = require("fs");

const app = express();

/* =========================
   CONFIG
========================= */

app.set(
    "view engine",
    "ejs"
);

app.set(
    "views",
    path.join(__dirname, "views")
);

/* =========================
   MIDDLEWARE
========================= */

app.use(
    express.urlencoded({
        extended:true
    })
);

app.use(
    express.json()
);

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

/* =========================
   HELPERS
========================= */

function obtenerProductos(){

    const productosPath =
        path.join(
            __dirname,
            "data",
            "productos.json"
        );

    return JSON.parse(
        fs.readFileSync(
            productosPath,
            "utf-8"
        )
    );

}

/* =========================
   ROUTES
========================= */

const adminRoutes =
    require(
        "./routes/admin.routes"
    );

/* =========================
   HOME
========================= */

app.get("/", (req, res) => {

    const productos =
        obtenerProductos();

    res.render(
        "pages/index",
        {
            productos
        }
    );

});

/* =========================
   PRODUCTO
========================= */

app.get("/producto/:id", (req, res) => {

    const productos =
        obtenerProductos();

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
        "pages/producto",
        {
            producto,
            productos
        }
    );

});

/* =========================
   CARRITO
========================= */

app.get("/carrito", (req, res) => {

    res.render(
        "pages/carrito"
    );

});

/* =========================
   ADMIN
========================= */

app.use(
    "/admin",
    adminRoutes
);

/* =========================
   SERVER
========================= */

const PORT = 3000;

app.listen(PORT, () => {

    console.log(`
Servidor iniciado:
http://localhost:${PORT}
    `);

});