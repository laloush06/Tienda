let productoActual = null;
let todosLosProductos = [];
let talleSeleccionado = null;

function actualizarContadorCarrito() {

    const carrito =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    const total =
        carrito.reduce(
            (acc, producto) =>
                acc + producto.cantidad,
            0
        );

    const cartCount =
        document.getElementById(
            "cartCount"
        );

    if (cartCount) {
        cartCount.textContent = total;
    }

}

function mostrarToast(mensaje) {

    const toast =
        document.getElementById(
            "toast"
        );

    toast.textContent =
        mensaje;

    toast.classList.add(
        "show-toast"
    );

    setTimeout(() => {

        toast.classList.remove(
            "show-toast"
        );

    }, 2500);

}

async function cargarProducto() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const id = params.get("id");

    if (!id) return;

    try {

        const response =
            await fetch(
                `/api/productos/${id}`
            );

        productoActual =
            await response.json();

        const responseTodos =
            await fetch(
                "/api/productos"
            );

        todosLosProductos =
            await responseTodos.json();

        renderizarProducto();

        renderizarRelacionados();

    } catch (error) {

        console.error(error);

    }

}

function cambiarImagen(src) {

    document.getElementById(
        "mainImage"
    ).src = src;

}

function renderizarProducto() {

    document.getElementById(
        "mainImage"
    ).src =
        productoActual.imagenes[0];

    document.getElementById(
        "productName"
    ).textContent =
        productoActual.nombre;

    document.getElementById(
        "productCategory"
    ).textContent =
        `${productoActual.categoria} • ${productoActual.equipo}`;

    document.getElementById(
        "productPrice"
    ).textContent =
        `$${productoActual.precio.toLocaleString("es-AR")}`;

    document.getElementById(
        "productDescription"
    ).textContent =
        `${productoActual.nombre} - Producto oficial importado.`;

    const thumbnailsContainer =
        document.getElementById(
            "thumbnailsContainer"
        );

    thumbnailsContainer.innerHTML = "";

    productoActual.imagenes.forEach(
        imagen => {

            thumbnailsContainer.innerHTML += `

                <img
                    src="${imagen}"
                    class="thumbnail-image"
                    onclick="cambiarImagen('${imagen}')">

            `;

        }
    );

    const sizesContainer =
        document.getElementById(
            "sizesContainer"
        );

    sizesContainer.innerHTML = "";

    productoActual.talles.forEach(
        talle => {

            const button =
                document.createElement(
                    "button"
                );

            button.textContent =
                talle;

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            "#sizesContainer button"
                        )
                        .forEach(
                            btn =>
                                btn.classList.remove(
                                    "active-size"
                                )
                        );

                    button.classList.add(
                        "active-size"
                    );

                    talleSeleccionado =
                        talle;

                }
            );

            sizesContainer.appendChild(
                button
            );

        }
    );

}

function renderizarRelacionados() {

    const relatedContainer =
        document.getElementById(
            "relatedProducts"
        );

    const relacionados =
        todosLosProductos.filter(
            producto =>
                producto.id !== productoActual.id &&
                (
                    producto.equipo === productoActual.equipo ||
                    producto.categoria === productoActual.categoria
                )
        ).slice(0, 4);

    relatedContainer.innerHTML = "";

    relacionados.forEach(
        producto => {

            relatedContainer.innerHTML += `

                <article class="product-card">

                    <a
                        href="/producto.html?id=${producto.id}"
                        class="product-link">

                        <img
                            src="${producto.imagenes[0]}"
                            alt="${producto.nombre}">

                        <div class="product-info-card">

                            <h3>
                                ${producto.nombre}
                            </h3>

                            <p class="price">
                                $${producto.precio.toLocaleString("es-AR")}
                            </p>

                        </div>

                    </a>

                </article>

            `;

        }
    );

}

function agregarAlCarrito() {

    if (!talleSeleccionado) {

        mostrarToast(
            "Seleccioná un talle"
        );

        return;
    }

    const cantidad =
        parseInt(
            document.getElementById(
                "quantityInput"
            ).value
        );

    let carrito =
        JSON.parse(
            localStorage.getItem(
                "cart"
            )
        ) || [];

    const productoExistente =
        carrito.find(
            item =>
                item.id === productoActual.id &&
                item.talle === talleSeleccionado
        );

    if (productoExistente) {

        productoExistente.cantidad += cantidad;

    } else {

        carrito.push({
            id: productoActual.id,
            nombre: productoActual.nombre,
            precio: productoActual.precio,
            talle: talleSeleccionado,
            cantidad
        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(
            carrito
        )
    );

    actualizarContadorCarrito();

    mostrarToast(
        "✓ Producto agregado al carrito"
    );

}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarProducto();

        actualizarContadorCarrito();

        document
            .getElementById(
                "addToCartBtn"
            )
            .addEventListener(
                "click",
                agregarAlCarrito
            );

    }
);