const express = require("express");

const app = express();

const path = require("path");

const session = require("express-session");

const prisma = require("./prismaClient");

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
   HELPERS
========================= */

function formatearProductos(productos){

    return productos.map(producto => {

        const stockObj = {};

        producto.stock.forEach(s => {

            stockObj[s.talle] =
                s.cantidad;

        });

        return {

            ...producto,

            stock:stockObj

        };

    });

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

app.get("/", async (req,res)=>{

    const productos =
        await prisma.producto.findMany({

            include:{
                stock:true
            },

            orderBy:{
                id:"desc"
            }

        });

    res.render(
        "pages/index",
        {
            productos:
                formatearProductos(
                    productos
                ),

            admin:
                req.session.admin || false
        }
    );

});

/* =========================
   OFERTAS
========================= */

app.get("/ofertas", async (req,res)=>{

    const productos =
        await prisma.producto.findMany({

            where:{
                oferta:true
            },

            include:{
                stock:true
            }

        });

    res.render(
        "pages/index",
        {
            productos:
                formatearProductos(
                    productos
                ),

            admin:
                req.session.admin || false
        }
    );

});

/* =========================
   DESTACADOS
========================= */

app.get("/destacados", async (req,res)=>{

    const productos =
        await prisma.producto.findMany({

            where:{
                destacado:true
            },

            include:{
                stock:true
            }

        });

    res.render(
        "pages/index",
        {
            productos:
                formatearProductos(
                    productos
                ),

            admin:
                req.session.admin || false
        }
    );

});

/* =========================
   NUEVOS
========================= */

app.get("/nuevos", async (req,res)=>{

    const productos =
        await prisma.producto.findMany({

            where:{
                nuevo:true
            },

            include:{
                stock:true
            }

        });

    res.render(
        "pages/index",
        {
            productos:
                formatearProductos(
                    productos
                ),

            admin:
                req.session.admin || false
        }
    );

});

/* =========================
   PRODUCTO
========================= */

app.get(
    "/producto/:id",
    async (req,res)=>{

        const producto =
            await prisma.producto.findUnique({

                where:{
                    id:Number(req.params.id)
                },

                include:{
                    stock:true
                }

            });

        if(!producto){

            return res.redirect("/");
        }

        const stockObj = {};

        producto.stock.forEach(s => {

            stockObj[s.talle] =
                s.cantidad;

        });

        producto.stock = stockObj;

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

