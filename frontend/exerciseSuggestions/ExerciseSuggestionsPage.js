function filterExercises() {
    const searchText = document.getElementById("searchInput").value.toLowerCase();
    const filterCategory = document.getElementById("filterSelect").value;
    const exercises = document.querySelectorAll(".exercise-card");

    exercises.forEach(exercise => {
        const name = exercise.querySelector("h2").textContent.toLowerCase();
        const category = exercise.getAttribute("data-category");

        // Check if the exercise matches the search text and category
        const matchesSearch = name.includes(searchText);
        const matchesCategory = filterCategory === "all" || category === filterCategory;

        if (matchesSearch && matchesCategory) {
            exercise.classList.remove("hidden");
        } else {
            exercise.classList.add("hidden");
        }
    });
}

// Add event listeners for search input and filter dropdown
document.getElementById("searchInput").addEventListener("input", filterExercises);
document.getElementById("filterSelect").addEventListener("change", filterExercises);

// Call the filter function initially to display all exercises
filterExercises();