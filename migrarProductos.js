require("dotenv").config();

const fs = require("fs");

const path = require("path");

const prisma = require("./prismaClient");

async function importar(){

    try{

        const ruta =
            path.join(
                __dirname,
                "data",
                "productos.json"
            );

        const productos =
            JSON.parse(
                fs.readFileSync(
                    ruta,
                    "utf-8"
                )
            );

        for(const producto of productos){

            const productoCreado =
                await prisma.producto.create({

                    data:{

                        nombre:
                            producto.nombre,

                        precio:
                            producto.precio,

                        precioOriginal:
                            producto.precioOriginal || producto.precio,

                        precioOferta:
                            producto.precioOferta || 0,

                        equipo:
                            producto.equipo,

                        categoria:
                            producto.categoria,

                        descripcion:
                            producto.descripcion ||
                            "Sin descripción",

                        imagenes:
                            producto.imagenes || [],

                        nuevo:
                            producto.nuevo || false,

                        oferta:
                            producto.oferta || false,

                        destacado:
                            producto.destacado || false

                    }

                });

            if(producto.stock){

                const stockArray =
                    Object.entries(
                        producto.stock
                    );

                for(const [
                    talle,
                    cantidad
                ] of stockArray){

                    await prisma.stock.create({

                        data:{

                            talle,

                            cantidad:
                                Number(cantidad),

                            productoId:
                                productoCreado.id

                        }

                    });

                }

            }

        }

        console.log(
            "PRODUCTOS IMPORTADOS ✅"
        );

    }

    catch(error){

        console.log(error);

    }

    finally{

        await prisma.$disconnect();

    }

}

importar();
