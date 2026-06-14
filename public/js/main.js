// =========================
// CONTADOR CARRITO
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

    const cartCount =
        document.getElementById(
            "cartCount"
        );

    if(cartCount){

        cartCount.textContent =
            total;

    }

}

actualizarContador();

// =========================
// DOM
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // =========================
        // ACORDEONES
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

                    const icon =
                        toggle.querySelector(
                            ".toggle-icon"
                        );

                    if(
                        content.classList.contains(
                            "active-filter"
                        )
                    ){

                        icon.textContent = "−";

                    }else{

                        icon.textContent = "+";

                    }

                }
            );

        });

        // =========================
        // ELEMENTOS
        // =========================

        const productsGrid =
            document.getElementById(
                "productsGrid"
            );

        const productCards =
            document.querySelectorAll(
                ".product-card"
            );

        const searchInput =
            document.getElementById(
                "searchInput"
            );

        const sizeFilters =
            document.querySelectorAll(
                ".filter-size"
            );

        const typeFilters =
            document.querySelectorAll(
                ".filter-type"
            );

        const teamFilters =
            document.querySelectorAll(
                ".filter-team"
            );

        const clearFiltersBtn =
            document.getElementById(
                "clearFiltersBtn"
            );

        const noResults =
            document.getElementById(
                "noResults"
            );

        const sortSelect =
            document.getElementById(
                "sortSelect"
            );

        // =========================
        // HELPERS
        // =========================

        function getSelectedValues(elements){

            return Array.from(elements)
                .filter(el => el.checked)
                .map(el =>
                    el.value.toLowerCase()
                );

        }

        // =========================
        // FILTRAR
        // =========================

        function filtrarProductos(){

            const searchText =
                searchInput
                    ? searchInput.value
                        .toLowerCase()
                        .trim()
                    : "";

            const selectedSizes =
                getSelectedValues(
                    sizeFilters
                );

            const selectedTypes =
                getSelectedValues(
                    typeFilters
                );

            const selectedTeams =
                getSelectedValues(
                    teamFilters
                );

            let visibles = 0;

            productCards.forEach(card => {

                const nombre =
                    card.querySelector("h3")
                        .textContent
                        .toLowerCase();

                const categoria =
                    card.dataset.categoria
                        .toLowerCase();

                const equipo =
                    card.dataset.equipo
                        .toLowerCase();

                const talles =
                    card.dataset.talles
                        .toLowerCase();

                let visible = true;

                // BUSCADOR

                if(
                    searchText &&
                    !nombre.includes(
                        searchText
                    )
                ){

                    visible = false;

                }

                // CATEGORIA

                if(selectedTypes.length > 0){

                    const matchType =
                        selectedTypes.some(
                            type =>
                                categoria.includes(
                                    type
                                )
                        );

                    if(!matchType){

                        visible = false;

                    }

                }

                // EQUIPO

                if(selectedTeams.length > 0){

                    const matchTeam =
                        selectedTeams.some(
                            team =>
                                equipo.includes(
                                    team
                                )
                        );

                    if(!matchTeam){

                        visible = false;

                    }

                }

                // TALLES

                if(selectedSizes.length > 0){

                    const matchSize =
                        selectedSizes.some(
                            size =>
                                talles.includes(
                                    size
                                )
                        );

                    if(!matchSize){

                        visible = false;

                    }

                }

                // MOSTRAR

                if(visible){

                    card.style.display =
                        "block";

                    visibles++;

                }else{

                    card.style.display =
                        "none";

                }

            });

            // NO RESULTS

            if(visibles === 0){

                noResults.style.display =
                    "block";

            }else{

                noResults.style.display =
                    "none";

            }

        }

        // =========================
        // ORDENAR
        // =========================

        function ordenarProductos(){

            if(!sortSelect) return;

            const cards =
                Array.from(
                    document.querySelectorAll(
                        ".product-card"
                    )
                );

            const value =
                sortSelect.value;

            cards.sort((a,b)=>{

                if(value === "low"){

                    return (
                        Number(a.dataset.price)
                        -
                        Number(b.dataset.price)
                    );

                }

                if(value === "high"){

                    return (
                        Number(b.dataset.price)
                        -
                        Number(a.dataset.price)
                    );

                }

                if(value === "featured"){

                    return (
                        b.dataset.featured === "true"
                    ) - (
                        a.dataset.featured === "true"
                    );

                }

                return (
                    Number(b.dataset.id)
                    -
                    Number(a.dataset.id)
                );

            });

            cards.forEach(card => {

                productsGrid.appendChild(
                    card
                );

            });

        }

        // =========================
        // EVENTOS
        // =========================

        if(searchInput){

            searchInput.addEventListener(
                "input",
                filtrarProductos
            );

        }

        [
            ...sizeFilters,
            ...typeFilters,
            ...teamFilters
        ].forEach(filter => {

            filter.addEventListener(
                "change",
                filtrarProductos
            );

        });

        if(sortSelect){

            sortSelect.addEventListener(
                "change",
                ordenarProductos
            );

        }

        // =========================
        // LIMPIAR
        // =========================

        if(clearFiltersBtn){

            clearFiltersBtn
                .addEventListener(
                    "click",
                    () => {

                        if(searchInput){

                            searchInput.value =
                                "";

                        }

                        [
                            ...sizeFilters,
                            ...typeFilters,
                            ...teamFilters
                        ].forEach(filter => {

                            filter.checked =
                                false;

                        });

                        filtrarProductos();

                    }
                );

        }

        ordenarProductos();

    }
);