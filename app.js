document.addEventListener("DOMContentLoaded", () => {
    function navigate(viewId) {
      //console.log(1);
      document.querySelectorAll(".view > div").forEach((view) => {
        view.style.display = "none";
      });
  
      // Show the requested view
      document.getElementById(viewId).style.display = "block";
    }
    //console.log(1)
  
    document
      .getElementById("main")
      .addEventListener("click", () => navigate("main-page"));
      //console.log(1)
    document
      .getElementById("food")
      .addEventListener("click", () => navigate("food-tracker"));
      //console.log(1)
    document
      .getElementById("daily")
      .addEventListener("click", () => navigate("daily-tracker"));
      //console.log(1)
    document
      .getElementById("work")
      .addEventListener("click", () => navigate("workouts"));
      //console.log(1)
    document
      .getElementById("nutrition")
      .addEventListener("click", () => navigate("nutritional-advice"));
      //console.log(1)

    navigate("main-page");
    //console.log(1)

    
  });