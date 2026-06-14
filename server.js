const express = require("express");

const path = require("path");

const fs = require("fs");

const session = require("express-session");

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
   SESSION
========================= */

app.use(
    session({

        secret:"futbolstore_secret",

        resave:false,

        saveUninitialized:false

    })
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
   AUTH MIDDLEWARE
========================= */

function verificarAdmin(
    req,
    res,
    next
){

    if(req.session.admin){

        return next();

    }

    res.redirect("/login");

}

/* =========================
   ROUTES
========================= */

const adminRoutes =
    require(
        "./routes/admin.routes"
    );

/* =========================
   LOGIN
========================= */

app.get("/login", (req, res) => {

    res.render(
        "pages/login",
        {
            error:null
        }
    );

});

app.post("/login", (req, res) => {

    const {
        usuario,
        password
    } = req.body;

    // LOGIN SIMPLE

    if(
        usuario === "admin" &&
        password === "1234"
    ){

        req.session.admin = true;

        return res.redirect(
            "/admin"
        );

    }

    res.render(
        "pages/login",
        {
            error:"Usuario o contraseña incorrectos"
        }
    );

});

/* =========================
   LOGOUT
========================= */

app.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/login");

    });

});

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
    verificarAdmin,
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
