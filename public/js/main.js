// =========================
// FILTER ACCORDION
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

            span.textContent =
                content.classList.contains(
                    "active-filter"
                )
                    ? "-"
                    : "+";

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
        () => {

            const value =
                searchInput.value
                    .toLowerCase();

            const cards =
                document.querySelectorAll(
                    ".product-card"
                );

            let visibles = 0;

            cards.forEach(card => {

                const title =
                    card.querySelector("h3")
                        .textContent
                        .toLowerCase();

                if(
                    title.includes(value)
                ){

                    card.style.display =
                        "flex";

                    visibles++;

                } else {

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
    );

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

            location.reload();

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

    const cartText =
        document.querySelector(
            '.header-right a[href="/carrito"]'
        );

    if(cartText){

        cartText.textContent =
            `Carrito (${total})`;

    }

}

actualizarContador();