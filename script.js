// declaring variables for DOM
const search_item = document.getElementById("search-item");
const meal_items = document.getElementById("meal-div");
const favorite_meals = document.getElementById("favorite-meals");

// Create events

search_item.addEventListener('input', displayMeals);
favorite_meals.addEventListener("click", displayFavoriteMeals);

// Create an array to store favorite meals
let favoriteMealsArray = [];

// Check if favoriteArray exists in localStorage, otherwise initialize it
if (!localStorage.getItem("favoriteMealsArray")) {
    localStorage.setItem("favoriteMealsArray", JSON.stringify(favoriteMealsArray));
} else {
    favoriteMealsArray = JSON.parse(localStorage.getItem("favoriteMealsArray"));
}

//create a variable timeout for debouncing 
let timeout;

//create functions

//display all the meal items
async function displayMeals() {
    let searchValue = search_item.value;
    clearTimeout(timeout);
    timeout = setTimeout( async function(){
    try{
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`);
        const output = await response.json();

        meal_items.innerHTML = '';
        for(let item of output.meals){
            const div = document.createElement('div');
            div.classList.add('content');
            div.innerHTML = `
            <img src="${item.strMealThumb}">
            <h5>${item.strMeal}</h5>
            <div class="buttons">
            <button class="buttons action_btn" id="${item.idMeal}">More Details</button>
            ${
                favoriteMealsArray.includes(item.idMeal) ? `<button href='' class='favourite clicked action_btn' id='${item.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></button>` : `<button href='' class='favourite action_btn' id='${item.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></button>`
              }
              </div>`;
            meal_items.append(div);
            }

        // display details of selected meal
        var detailsButton = document.querySelectorAll('.buttons');
        for(let item of detailsButton) {
            item.addEventListener('click', displayMoreDetails);
        }

        // adding or removing favourite meals to list by calling toggle function
        var favoriteMealsButton = document.querySelectorAll('.favourite');
        for(let item of favoriteMealsButton) {
            item.addEventListener('click', toggleFavoriteMeals);
        }

    }
    catch(error){
        console.log(error);
        }
    },500);
}


//display only the favourite marked meals
async function displayFavoriteMeals() {
    meal_items.innerHTML = '';
    for(let items of favoriteMealsArray){
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${items}`);
            const output = await response.json();

            let item = output.meals[0]; 
            const div = document.createElement('div');
            div.classList.add('content');
            div.innerHTML = `
            <img src="${item.strMealThumb}">
            <h5>${item.strMeal}</h5>
            <div class="buttons">
            <button class="buttons action_btn" id="${item.idMeal}">More Details</button>
            <button href='' class='favourite clicked action_btn' id='${item.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></button>
            </div>`;
            meal_items.append(div);


        // display details of selected meal
        var detailsButton = document.querySelectorAll('.buttons');
        for(let item of detailsButton) {
            item.addEventListener('click', displayMoreDetails);
        }

        // adding or removing favourite meals to list by calling toggle function
        var favoriteMealsButton = document.querySelectorAll('.favourite');
        for(let item of favoriteMealsButton) {
            item.addEventListener('click', toggleFavoriteMeals);
        }

    }
}


//function to add or remove meals to favourite list
function toggleFavoriteMeals(event) {
    event.preventDefault();
    let index = favoriteMealsArray.indexOf(this.id);
    if(index == -1){
        favoriteMealsArray.push(this.id);
        this.classList.add('clicked');
    }
    else{
        favoriteMealsArray.splice(index,1);
        this.classList.remove('clicked');
    }
    localStorage.setItem("favoriteMealsArray", JSON.stringify(favoriteMealsArray));
}


// function to display details about a specific meal
async function displayMoreDetails() {
    let id  = this.id;
    console.log(id);
    meal_items.innerHTML = '';
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();

    //console.log(data);
    let item = data.meals[0];
    //console.log(meals);

    const div = document.createElement('div');
    div.classList.add('contentdetails');

    div.innerHTML = `
    <img src="${item.strMealThumb}">
    <h5>${item.strMeal}</h5>
    <p>${item.strInstructions}</p>
    `;

    meal_items.append(div);
}
