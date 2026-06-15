const express = require("express");

const router = express.Router();

const multer = require("multer");

const prisma = require("../prismaClient");

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
   STOCK
========================= */

function crearStock(body){

    return [

        {
            talle:"XS",
            cantidad:Number(body.stockXS || 0)
        },

        {
            talle:"S",
            cantidad:Number(body.stockS || 0)
        },

        {
            talle:"M",
            cantidad:Number(body.stockM || 0)
        },

        {
            talle:"L",
            cantidad:Number(body.stockL || 0)
        },

        {
            talle:"XL",
            cantidad:Number(body.stockXL || 0)
        },

        {
            talle:"XXL",
            cantidad:Number(body.stockXXL || 0)
        }

    ];

}

/* =========================
   ADMIN PAGE
========================= */

router.get("/", async (req,res)=>{

    if(!req.session.admin){

        return res.redirect("/");

    }

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
    async (req,res)=>{

        if(!req.session.admin){

            return res.redirect("/");

        }

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

        const stock =
            crearStock(req.body);

        await prisma.producto.create({

            data:{

                nombre:req.body.nombre,

                precio:
                    precioOferta > 0
                        ? precioOferta
                        : precioOriginal,

                precioOriginal,

                precioOferta,

                equipo:req.body.equipo,

                categoria:req.body.categoria,

                descripcion:req.body.descripcion,

                imagenes,

                nuevo:
                    req.body.nuevo === "on",

                oferta:
                    precioOferta > 0,

                destacado:
                    req.body.destacado === "on",

                stock:{
                    create:stock
                }

            }

        });

        res.redirect("/admin");

    }
);

/* =========================
   EDITAR PAGE
========================= */

router.get(
    "/editar/:id",
    async (req,res)=>{

        if(!req.session.admin){

            return res.redirect("/");

        }

        const productos =
            await prisma.producto.findMany({

                include:{
                    stock:true
                }

            });

        const productoEditar =
            await prisma.producto.findUnique({

                where:{
                    id:Number(req.params.id)
                },

                include:{
                    stock:true
                }

            });

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
    async (req,res)=>{

        if(!req.session.admin){

            return res.redirect("/");

        }

        const id =
            Number(req.params.id);

        const producto =
            await prisma.producto.findUnique({

                where:{ id },

                include:{
                    stock:true
                }

            });

        if(!producto){

            return res.redirect("/admin");

        }

        const precioOriginal =
            Number(
                req.body.precioOriginal
            );

        const precioOferta =
            Number(
                req.body.precioOferta || 0
            );

        const imagenes =
            req.files &&
            req.files.length > 0
                ? req.files.map(
                    file =>
                        "/img/" +
                        file.filename
                )
                : producto.imagenes;

        await prisma.stock.deleteMany({

            where:{
                productoId:id
            }

        });

        await prisma.producto.update({

            where:{ id },

            data:{

                nombre:req.body.nombre,

                precio:
                    precioOferta > 0
                        ? precioOferta
                        : precioOriginal,

                precioOriginal,

                precioOferta,

                equipo:req.body.equipo,

                categoria:req.body.categoria,

                descripcion:req.body.descripcion,

                imagenes,

                nuevo:
                    req.body.nuevo === "on",

                oferta:
                    precioOferta > 0,

                destacado:
                    req.body.destacado === "on",

                stock:{
                    create:
                        crearStock(req.body)
                }

            }

        });

        res.redirect("/admin");

    }
);

/* =========================
   ELIMINAR
========================= */

router.post(
    "/eliminar/:id",
    async (req,res)=>{

        if(!req.session.admin){

            return res.redirect("/");

        }

        await prisma.producto.delete({

            where:{
                id:Number(req.params.id)
            }

        });

        res.redirect("/admin");

    }
);

module.exports = router;
