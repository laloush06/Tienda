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
            (acc, item) =>
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
// FILTROS
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

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

        // =========================
        // OBTENER FILTROS
        // =========================

        function getSelectedValues(elements){

            return Array.from(elements)
                .filter(el => el.checked)
                .map(el => el.value.toLowerCase());

        }

        // =========================
        // FILTRAR PRODUCTOS
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

            productCards.forEach(card => {

                const textoCompleto =
                    card.textContent
                        .toLowerCase();

                let visible = true;

                // =========================
                // BUSCADOR
                // =========================

                if(
                    searchText &&
                    !textoCompleto.includes(
                        searchText
                    )
                ){

                    visible = false;

                }

                // =========================
                // TALLES
                // =========================

                if(
                    selectedSizes.length > 0
                ){

                    const matchSize =
                        selectedSizes.some(
                            size =>
                                textoCompleto.includes(
                                    size
                                )
                        );

                    if(!matchSize){

                        visible = false;

                    }

                }

                // =========================
                // TIPOS
                // =========================

                if(
                    selectedTypes.length > 0
                ){

                    const matchType =
                        selectedTypes.some(
                            type =>
                                textoCompleto.includes(
                                    type
                                )
                        );

                    if(!matchType){

                        visible = false;

                    }

                }

                // =========================
                // EQUIPOS
                // =========================

                if(
                    selectedTeams.length > 0
                ){

                    const matchTeam =
                        selectedTeams.some(
                            team =>
                                textoCompleto.includes(
                                    team
                                )
                        );

                    if(!matchTeam){

                        visible = false;

                    }

                }

                // =========================
                // SHOW / HIDE
                // =========================

                if(visible){

                    card.style.display =
                        "block";

                }else{

                    card.style.display =
                        "none";

                }

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

        // =========================
        // LIMPIAR FILTROS
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

    }
);