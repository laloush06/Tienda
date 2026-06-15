const express = require("express");

const router = express.Router();

const multer = require("multer");

const fs = require("fs");

const path = require("path");

const prisma = require("../prismaClient");

const cloudinary =
    require("../cloudinary");

const XLSX = require("xlsx");

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
   EDITAR PAGE
========================= */

router.get(
    "/editar/:id",
    async (req,res)=>{

        if(!req.session.admin){

            return res.redirect("/");
        }

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

            return res.redirect("/admin");
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

        try{

            if(!req.session.admin){

                return res.redirect("/");
            }

            const productoId =
                Number(req.params.id);

            const imagenesActuales =
                await prisma.producto.findUnique({

                    where:{
                        id:productoId
                    }

                });

            let imagenes =
                imagenesActuales.imagenes;

            if(
                req.files &&
                req.files.length > 0
            ){

                imagenes = [];

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

            await prisma.producto.update({

                where:{
                    id:productoId
                },

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
                        req.body.descripcion,

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

                await prisma.stock.updateMany({

                    where:{

                        productoId,

                        talle:item.talle

                    },

                    data:{

                        cantidad:item.cantidad

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

/* =========================
   IMPORTAR EXCEL
========================= */

router.post(
    "/importar",
    upload.single("excel"),
    async (req,res)=>{

        try{

            if(!req.session.admin){

                return res.redirect("/");
            }

            const workbook =
                XLSX.readFile(
                    req.file.path
                );

            const sheet =
                workbook.Sheets[
                    workbook.SheetNames[0]
                ];

            const productos =
                XLSX.utils.sheet_to_json(
                    sheet
                );

            for(const item of productos){

                // =========================
                // IMAGENES
                // =========================

                const imagenes = [];

                const imagenesExcel = [

                    item.imagen1,

                    item.imagen2,

                    item.imagen3

                ].filter(Boolean);

                for(const nombreImagen of imagenesExcel){

                    const rutaImagen =
                        path.join(

                            __dirname,

                            "..",

                            "imagenes",

                            nombreImagen

                        );

                    if(fs.existsSync(rutaImagen)){

                        const resultado =
                            await cloudinary.uploader.upload(

                                rutaImagen,

                                {
                                    folder:"tienda"
                                }

                            );

                        imagenes.push(
                            resultado.secure_url
                        );

                    }

                }

                // =========================
                // CREAR PRODUCTO
                // =========================

                const productoCreado =
                    await prisma.producto.create({

                        data:{

                            nombre:
                                item.nombre,

                            precio:
                                Number(item.precio),

                            precioOriginal:
                                Number(item.precio),

                            precioOferta:
                                Number(
                                    item.precioOferta || 0
                                ),

                            equipo:
                                item.equipo,

                            categoria:
                                item.categoria,

                            descripcion:
                                item.descripcion ||
                                "Sin descripción",

                            imagenes,

                            nuevo:
                                item.nuevo === "true" ||
                                item.nuevo === true,

                            oferta:
                                Number(
                                    item.precioOferta || 0
                                ) > 0,

                            destacado:
                                item.destacado === "true" ||
                                item.destacado === true

                        }

                    });

                // =========================
                // STOCK
                // =========================

                const talles = [

                    {
                        talle:"XS",
                        cantidad:Number(item.XS || 0)
                    },

                    {
                        talle:"S",
                        cantidad:Number(item.S || 0)
                    },

                    {
                        talle:"M",
                        cantidad:Number(item.M || 0)
                    },

                    {
                        talle:"L",
                        cantidad:Number(item.L || 0)
                    },

                    {
                        talle:"XL",
                        cantidad:Number(item.XL || 0)
                    },

                    {
                        talle:"XXL",
                        cantidad:Number(item.XXL || 0)
                    }

                ];

                for(const stock of talles){

                    await prisma.stock.create({

                        data:{

                            talle:
                                stock.talle,

                            cantidad:
                                stock.cantidad,

                            productoId:
                                productoCreado.id

                        }

                    });

                }

            }

            fs.unlinkSync(
                req.file.path
            );

            res.redirect("/admin");

        }

        catch(error){

            console.log(error);

            res.send(error.message);

        }

    }
);

module.exports = router;
