const prisma = require("./prismaClient");

async function migrar(){

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

        const stockArray = [];

        if(producto.stock){

            for(const talle in producto.stock){

                stockArray.push({

                    talle,

                    cantidad:
                        Number(
                            producto.stock[talle]
                        )

                });

            }

        }

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
                    producto.equipo || "",

                categoria:
                    producto.categoria || "",

                descripcion:
                    producto.descripcion || "",

                imagenes:
                    producto.imagenes || [],

                nuevo:
                    producto.nuevo || false,

                oferta:
                    producto.oferta || false,

                destacado:
                    producto.destacado || false,

                stock:{
                    create:stockArray
                }

            }

        });

    }

    console.log(
        "PRODUCTOS MIGRADOS"
    );

}

migrar()
.then(async()=>{

    await prisma.$disconnect();

})
.catch(async(error)=>{

    console.log(error);

    await prisma.$disconnect();

});