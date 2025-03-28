document.addEventListener("DOMContentLoaded", () => { //same as in-class exercise
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
      
    document
      .getElementById("food")
      .addEventListener("click", () => navigate("food-tracker"));
      
    document
      .getElementById("calorie")
      .addEventListener("click", () => navigate("calorie-calculator"));
      
    document
      .getElementById("work")
      .addEventListener("click", () => navigate("workouts"));
      
    document
      .getElementById("nutrition")
      .addEventListener("click", () => navigate("nutritional-advice"));
      

    navigate("main-page"); //starts on the main page
    

    
  });