const express = require("express");

const router = express.Router();

const multer = require("multer");

const fs = require("fs");

const prisma = require("../prismaClient");

const cloudinary =
    require("../cloudinary");

/* =========================
   MULTER TEMP
========================= */

const storage =
    multer.diskStorage({

        destination:
            (req,file,cb)=>{

                cb(null,"temp");

            },

        filename:
            (req,file,cb)=>{

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
   ADMIN
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

        try{

            if(!req.session.admin){

                return res.redirect("/");
            }

            const imagenes = [];

            if(req.files){

                for(const file of req.files){

                    const resultado =
                        await cloudinary.uploader.upload(
                            file.path,
                            {
                                folder:"tienda"
                            }
                        );

                    imagenes.push(
                        resultado.secure_url
                    );

                    fs.unlinkSync(
                        file.path
                    );

                }

            }

            const precioOriginal =
                Number(
                    req.body.precioOriginal
                );

            const precioOferta =
                Number(
                    req.body.precioOferta || 0
                );

            const productoCreado =
                await prisma.producto.create({

                    data:{

                        nombre:
                            req.body.nombre,

                        precio:
                            precioOferta > 0
                                ? precioOferta
                                : precioOriginal,

                        precioOriginal,

                        precioOferta,

                        equipo:
                            req.body.equipo,

                        categoria:
                            req.body.categoria,

                        descripcion:
                            req.body.descripcion ||
                            "Sin descripción",

                        imagenes,

                        nuevo:
                            req.body.nuevo === "on",

                        oferta:
                            precioOferta > 0,

                        destacado:
                            req.body.destacado === "on"

                    }

                });

            const stock =
                crearStock(req.body);

            for(const item of stock){

                await prisma.stock.create({

                    data:{

                        talle:item.talle,

                        cantidad:item.cantidad,

                        productoId:
                            productoCreado.id

                    }

                });

            }

            res.redirect("/admin");

        }

        catch(error){

            console.log(error);

            res.send(error.message);

        }

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

        await prisma.stock.deleteMany({

            where:{
                productoId:Number(req.params.id)
            }

        });

        await prisma.producto.delete({

            where:{
                id:Number(req.params.id)
            }

        });

        res.redirect("/admin");

    }
);

module.exports = router;
