const cartContainer =
    document.getElementById(
        "cartContainer"
    );

function obtenerCarrito() {

    const carritoGuardado =
        localStorage.getItem(
            "cart"
        );

    if (!carritoGuardado) {
        return [];
    }

    try {

        return JSON.parse(
            carritoGuardado
        );

    } catch (error) {

        console.error(
            "Error leyendo carrito:",
            error
        );

        return [];

    }

}

let carrito =
    obtenerCarrito();

function guardarCarrito() {

    localStorage.setItem(
        "cart",
        JSON.stringify(
            carrito
        )
    );

}

function renderizarCarrito() {

    cartContainer.innerHTML = "";

    if (
        carrito.length === 0
    ) {

        cartContainer.innerHTML = `
            <h2>
                El carrito está vacío
            </h2>
        `;

        return;
    }

    let totalCompra = 0;

    carrito.forEach(
        (producto, index) => {

            const subtotal =
                producto.precio *
                producto.cantidad;

            totalCompra += subtotal;

            cartContainer.innerHTML += `

                <div class="cart-item">

                    <div>

                        <h3>
                            ${producto.nombre}
                        </h3>

                        <p>
                            Talle:
                            ${producto.talle}
                        </p>

                        <p>
                            Cantidad:
                            ${producto.cantidad}
                        </p>

                        <p>
                            Subtotal:
                            $${subtotal.toLocaleString("es-AR")}
                        </p>

                    </div>

                    <button
                        class="remove-btn"
                        onclick="eliminarProducto(${index})">

                        Eliminar

                    </button>

                </div>

            `;

        }
    );

    cartContainer.innerHTML += `

        <div class="cart-total">

            <h2>
                TOTAL:
                $${totalCompra.toLocaleString("es-AR")}
            </h2>

        </div>

    `;

}

function eliminarProducto(index) {

    carrito.splice(index, 1);

    guardarCarrito();

    renderizarCarrito();

}

function vaciarCarrito() {

    carrito = [];

    guardarCarrito();

    renderizarCarrito();

}

function enviarWhatsApp() {

    if (
        carrito.length === 0
    ) {

        alert(
            "El carrito está vacío."
        );

        return;
    }

    let mensaje =
        "Hola, estoy interesado en:%0A%0A";

    let total = 0;

    carrito.forEach(
        producto => {

            const subtotal =
                producto.precio *
                producto.cantidad;

            total += subtotal;

            mensaje +=
                `• ${producto.nombre} - ${producto.talle} - Cantidad: ${producto.cantidad} - $${subtotal.toLocaleString("es-AR")}%0A`;

        }
    );

    mensaje +=
        `%0ATOTAL: $${total.toLocaleString("es-AR")}`;

    const numero =
        "5493510000000";

    window.open(
        `https://wa.me/${numero}?text=${mensaje}`,
        "_blank"
    );

}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderizarCarrito();

        document
            .getElementById(
                "clearCartBtn"
            )
            .addEventListener(
                "click",
                vaciarCarrito
            );

        document
            .getElementById(
                "whatsappBtn"
            )
            .addEventListener(
                "click",
                enviarWhatsApp
            );

    }
);