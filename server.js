const express = require("express");

const app = express();

const path = require("path");

const fs = require("fs");

const session = require("express-session");

/* =========================
   CONFIG
========================= */

app.set(
    "view engine",
    "ejs"
);

app.set(
    "views",
    path.join(
        __dirname,
        "views"
    )
);

/* =========================
   MIDDLEWARES
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
        path.join(
            __dirname,
            "public"
        )
    )
);

app.use(
    session({
        secret:"tienda-secret",
        resave:false,
        saveUninitialized:true
    })
);

/* =========================
   JSON
========================= */

const productosPath =
    path.join(
        __dirname,
        "data",
        "productos.json"
    );

function obtenerProductos(){

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
    require("./routes/admin.routes");

app.use(
    "/admin",
    adminRoutes
);

/* =========================
   HOME
========================= */

app.get("/", (req,res)=>{

    const productos =
        obtenerProductos();

    res.render(
        "pages/index",
        {
            productos,
            admin:req.session.admin || false
        }
    );

});

/* =========================
   OFERTAS
========================= */

app.get("/ofertas",(req,res)=>{

    const productos =
        obtenerProductos();

    const ofertas =
        productos.filter(
            p => p.oferta
        );

    res.render(
        "pages/index",
        {
            productos:ofertas,
            admin:req.session.admin || false
        }
    );

});

/* =========================
   DESTACADOS
========================= */

app.get("/destacados",(req,res)=>{

    const productos =
        obtenerProductos();

    const destacados =
        productos.filter(
            p => p.destacado
        );

    res.render(
        "pages/index",
        {
            productos:destacados,
            admin:req.session.admin || false
        }
    );

});

/* =========================
   NUEVOS
========================= */

app.get("/nuevos",(req,res)=>{

    const productos =
        obtenerProductos();

    const nuevos =
        productos.filter(
            p => p.nuevo
        );

    res.render(
        "pages/index",
        {
            productos:nuevos,
            admin:req.session.admin || false
        }
    );

});

/* =========================
   PRODUCTO
========================= */

app.get(
    "/producto/:id",
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

            return res.redirect("/");
        }

        res.render(
            "pages/producto",
            {
                producto,
                admin:
                    req.session.admin
                    || false
            }
        );

    }
);

/* =========================
   CARRITO
========================= */

app.get(
    "/carrito",
    (req,res)=>{

        res.render(
            "pages/carrito",
            {
                admin:
                    req.session.admin
                    || false
            }
        );

    }
);

/* =========================
   LOGIN ADMIN
========================= */

app.get(
    "/login-admin",
    (req,res)=>{

        res.render(
            "pages/login",
            {
                error:null,
                admin:false
            }
        );

    }
);

app.post(
    "/login-admin",
    (req,res)=>{

        const {
            usuario,
            password
        } = req.body;

        // CAMBIAR DESPUES

        const ADMIN_USER =
            "admin";

        const ADMIN_PASS =
            "1234";

        if(
            usuario === ADMIN_USER
            &&
            password === ADMIN_PASS
        ){

            req.session.admin = true;

            return res.redirect(
                "/admin"
            );

        }

        res.render(
            "pages/login",
            {
                error:"Usuario o contraseña incorrectos",
                admin:false
            }
        );

    }
);


/* =========================
   LOGOUT
========================= */

app.get(
    "/logout",
    (req,res)=>{

        req.session.destroy(
            () => {

                res.redirect("/");
            }
        );

    }
);

/* =========================
   SERVER
========================= */

const PORT = 3000;

app.listen(
    PORT,
    () => {

        console.log(
            `Servidor corriendo en http://localhost:${PORT}`
        );

    }
);