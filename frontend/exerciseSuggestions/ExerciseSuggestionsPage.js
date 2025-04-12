function convertToEmbedURL(url) {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/);
    if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    return url;
}

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const filterSelect = document.getElementById("filterSelect");
    const addBtn = document.getElementById("addCardBtn");
    const modal = document.getElementById("addCardModal");
    const closeModal = document.getElementById("closeModal");
    const form = document.getElementById("addCardForm");
    const exerciseGrid = document.getElementById("exerciseGrid");

    let db;

    const request = indexedDB.open("ExerciseDB", 1);

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains("exercises")) {
            const objectStore = db.createObjectStore("exercises", { keyPath: "id", autoIncrement: true });
            objectStore.createIndex("category", "category", { unique: false });
            objectStore.createIndex("difficulty", "difficulty", { unique: false });
            objectStore.createIndex("tags", "tags", { unique: false });
            objectStore.createIndex("videoURL", "videoURL", { unique: false });
        }
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log("IndexedDB opened successfully");
        loadExercisesFromDB(); // Load all exercises on page load
    };

    request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
    };

    function addExerciseToDB(exercise) {
        const transaction = db.transaction(["exercises"], "readwrite");
        const store = transaction.objectStore("exercises");
        const request = store.add(exercise);

        request.onsuccess = function (e) {
            exercise.id = e.target.result;
            addExerciseCardToDOM(exercise);
        };

        transaction.onerror = function (event) {
            console.error("Error adding exercise:", event.target.error);
        };
    }

    function deleteExerciseFromDB(id) {
        const transaction = db.transaction(["exercises"], "readwrite");
        const store = transaction.objectStore("exercises");
        const request = store.delete(id);

        request.onsuccess = function () {
            console.log("Exercise deleted from IndexedDB.");
        };

        request.onerror = function (event) {
            console.error("Error deleting exercise:", event.target.error);
        };
    }

    function loadExercisesFromDB() {
        const transaction = db.transaction(["exercises"], "readonly");
        const store = transaction.objectStore("exercises");
        const request = store.openCursor();

        request.onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
                const exercise = cursor.value;
                addExerciseCardToDOM(exercise);
                cursor.continue();
            }
        };

        request.onerror = function (event) {
            console.error("Error reading from IndexedDB:", event.target.error);
        };
    }

    function addExerciseCardToDOM(exercise) {
        const card = document.createElement("div");
        card.className = "exercise-card";
        card.setAttribute("data-id", exercise.id);
        card.setAttribute("data-category", exercise.category);
        card.setAttribute("data-video", exercise.videoURL);
    
        const categoryTag = exercise.category || "Unknown";
        const difficultyTag = exercise.difficulty || "Unknown";
        const goalTag = (exercise.tags && exercise.tags[2]) ? exercise.tags[2] : "Goal";
    
        card.innerHTML = `
            <h2>${exercise.name}</h2>
            <button class="delete-btn">x</button>
            <div class="tags">
                <span class="tag target">${categoryTag.charAt(0).toUpperCase() + categoryTag.slice(1)}</span>
                <span class="tag ${difficultyTag}">${difficultyTag.charAt(0).toUpperCase() + difficultyTag.slice(1)}</span>
                <span class="tag goal">${goalTag}</span>
            </div>
            <button class="view-btn">View</button>
            <button class="watch-video-btn">Form Video</button>
        `;
        exerciseGrid.appendChild(card);
    }
    

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

            let matchesSearch = title.includes(searchQuery) || tags.includes(searchQuery);
            let matchesFilter = selectedCategory === "all" || category === selectedCategory;

            card.style.display = matchesSearch && matchesFilter ? "block" : "none";
        });
    }

    addBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });

    closeModal.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("exerciseName").value;
        const category = document.getElementById("exerciseCategory").value;
        const difficulty = document.getElementById("exerciseDifficulty").value;
        const goal = document.getElementById("exerciseGoal").value;
        const rawVideoLink = document.getElementById("exerciseVideo").value;
        const videoLink = convertToEmbedURL(rawVideoLink);

        const exercise = {
            name,
            category,
            difficulty,
            tags: [category, difficulty, goal],
            videoURL: videoLink
        };

        addExerciseToDB(exercise);
        modal.classList.add("hidden");
        form.reset();
    });

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-btn')) {
            const card = e.target.closest('.exercise-card');
            const id = Number(card.getAttribute("data-id"));
            card.remove();
            deleteExerciseFromDB(id);
        }
    });

    searchInput.addEventListener("keyup", filterExercises);
    filterSelect.addEventListener("change", filterExercises);

    const videoModal = document.getElementById("videoModal");
    const videoFrame = document.getElementById("videoFrame");
    const closeVideoModal = document.getElementById("closeVideoModal");

    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("watch-video-btn")) {
            const card = e.target.closest(".exercise-card");
            const videoUrl = card.getAttribute("data-video");

            if (videoUrl) {
                videoFrame.src = videoUrl;
                videoModal.classList.remove("hidden");
                videoModal.classList.add("visible");
                document.body.classList.add("modal-open");
            } else {
                alert("No video available for this exercise.");
            }
        }

        if (e.target === closeVideoModal) {
            videoModal.classList.remove("visible");
            videoModal.classList.add("hidden");
            videoFrame.src = "";
            document.body.classList.remove("modal-open");
        }
    });
});
