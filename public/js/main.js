// =========================
// ACCORDION
// =========================

const toggles =
    document.querySelectorAll(
        ".filter-toggle"
    );

toggles.forEach(toggle => {

    toggle.addEventListener(
        "click",
        () => {

            const content =
                toggle.nextElementSibling;

            content.classList.toggle(
                "active-filter"
            );

            const span =
                toggle.querySelector("span");

            if(span){

                span.textContent =
                    content.classList.contains(
                        "active-filter"
                    )
                        ? "-"
                        : "+";

            }

        }
    );

});

// =========================
// SEARCH
// =========================

const searchInput =
    document.querySelector(
        ".search-input"
    );

if(searchInput){

    searchInput.addEventListener(
        "input",
        aplicarFiltros
    );

}

// =========================
// FILTERS
// =========================

const filterSizes =
    document.querySelectorAll(
        ".filter-size"
    );

const filterTypes =
    document.querySelectorAll(
        ".filter-type"
    );

const filterTeams =
    document.querySelectorAll(
        ".filter-team"
    );

[
    ...filterSizes,
    ...filterTypes,
    ...filterTeams
].forEach(filter => {

    filter.addEventListener(
        "change",
        aplicarFiltros
    );

});

// =========================
// FILTER FUNCTION
// =========================

function aplicarFiltros(){

    const search =
        searchInput
            ? searchInput.value.toLowerCase()
            : "";

    const tallesSeleccionados =
        [...filterSizes]
            .filter(cb => cb.checked)
            .map(cb => cb.value);

    const categoriasSeleccionadas =
        [...filterTypes]
            .filter(cb => cb.checked)
            .map(cb => cb.value);

    const equiposSeleccionados =
        [...filterTeams]
            .filter(cb => cb.checked)
            .map(cb => cb.value);

    const cards =
        document.querySelectorAll(
            ".product-card"
        );

    let visibles = 0;

    cards.forEach(card => {

        const nombre =
            card.querySelector("h3")
                .textContent
                .toLowerCase();

        const equipo =
            card.dataset.equipo;

        const categoria =
            card.dataset.categoria;

        const stock =
            JSON.parse(
                card.dataset.stock || "{}"
            );

        // =========================
        // SEARCH
        // =========================

        const coincideSearch =
            nombre.includes(search);

        // =========================
        // TALLES
        // =========================

        const coincideTalles =

            tallesSeleccionados.length === 0

            ||

            tallesSeleccionados.some(
                talle =>
                    Number(
                        stock[talle] || 0
                    ) > 0
            );

        // =========================
        // CATEGORY
        // =========================

        const coincideCategoria =

            categoriasSeleccionadas.length === 0

            ||

            categoriasSeleccionadas.includes(
                categoria
            );

        // =========================
        // TEAM
        // =========================

        const coincideEquipo =

            equiposSeleccionados.length === 0

            ||

            equiposSeleccionados.includes(
                equipo
            );

        // =========================
        // SHOW / HIDE
        // =========================

        const mostrar =

            coincideSearch
            &&
            coincideTalles
            &&
            coincideCategoria
            &&
            coincideEquipo;

        if(mostrar){

            card.style.display =
                "flex";

            visibles++;

        }

        else{

            card.style.display =
                "none";

        }

    });

    const noResults =
        document.getElementById(
            "noResults"
        );

    if(noResults){

        noResults.style.display =
            visibles === 0
                ? "block"
                : "none";

    }

}

// =========================
// CLEAR FILTERS
// =========================

const clearBtn =
    document.getElementById(
        "clearFiltersBtn"
    );

if(clearBtn){

    clearBtn.addEventListener(
        "click",
        () => {

            [
                ...filterSizes,
                ...filterTypes,
                ...filterTeams
            ].forEach(filter => {

                filter.checked = false;

            });

            if(searchInput){

                searchInput.value = "";

            }

            aplicarFiltros();

        }
    );

}

// =========================
// CART COUNTER
// =========================

function actualizarContador(){

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    const total =
        cart.reduce(
            (acc,item)=>
                acc + item.cantidad,
            0
        );

    const cartLink =
        document.querySelector(
            '.header-right a[href="/carrito"]'
        );

    if(cartLink){

        cartLink.textContent =
            `Carrito (${total})`;

    }

}

actualizarContador();

