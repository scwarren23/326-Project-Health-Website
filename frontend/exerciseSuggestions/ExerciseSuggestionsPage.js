document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const filterSelect = document.getElementById("filterSelect");

    function filterExercises() {
        let searchQuery = searchInput.value.toLowerCase();
        let selectedCategory = filterSelect.value;
        let cards = document.querySelectorAll(".exercise-card");

        if (!cards.length) {
            console.error("No exercise cards found!");
            return;
        }

        cards.forEach(card => {
            let title = card.querySelector("h2")?.textContent.toLowerCase() || "";
            let tags = card.querySelector(".tags")?.textContent.toLowerCase() || "";
            let category = card.getAttribute("data-category");

            //checks if search query is in title or tags
            let matchesSearch = title.includes(searchQuery) || tags.includes(searchQuery);
            //checks if the category matches the filter or "all" is selected
            let matchesFilter = selectedCategory === "all" || category === selectedCategory;

            //show the card if it matches BOTH the search and filter
            card.style.display = matchesSearch && matchesFilter ? "block" : "none";
        });
    }

    searchInput.addEventListener("keyup", filterExercises);
    filterSelect.addEventListener("change", filterExercises);
});