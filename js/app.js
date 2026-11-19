/**
- @file app.js
- @description This file contains JavaScript for our movie app.
- It contains the movieList instance, the event functions and UI code.
- cspell: ignore Jeremy Geddes colour tabcontent tablinks 
- @author Jeremy Geddes
- @version 2.2
 */

/**
- @global
- @description The initial list of movies for our app.
 */
let initialMovies = [
  { title: "The Redemption", year: 1994, rating: 9.3 },
  { title: "The Matrix", year: 1999, rating: 8.7 },
  { title: "SAW 1", year: 2002, rating: 7.6 },
  { title: "Face Off", year: 1997, rating: 7.3 },
  { title: "The Terminator", year: 2000, rating: 8.1 },
  { title: "Drag me to hell", year: 2011, rating: 6.6 },
  { title: "Bad boys 2", year: 2008, rating: 6.8 },
  { title: "Get rich or die trying", year: 2005, rating: 5.4 }
];

/**
- @memberof MovieList
- @instance movieList
- @global
- @description The movieList instance to keep track of list of movies in the app
 */
let movieList = new MovieList('list', initialMovies);

// Getting all the buttons from our application
const searchBtn = document.getElementById('searchBtn');
const sortA2ZBtn = document.getElementById('sortA2ZBtn');
const sortZ2ABtn = document.getElementById('sortZ2ABtn');
const sortRatingZ2ABtn = document.getElementById('sortRatingZ2ABtn');
const addSubmit = document.getElementById('addSubmit');
const updateSubmit = document.getElementById('updateSubmit');
const deleteSubmit = document.getElementById('deleteSubmit');

// Refresh buttons across forms/pages
const refreshBtns = document.querySelectorAll('.refresh-btn');

// Add event handlers 
if (searchBtn) searchBtn.addEventListener('click', searchClick);
if (sortA2ZBtn) sortA2ZBtn.addEventListener('click', a2zClick);
if (sortZ2ABtn) sortZ2ABtn.addEventListener('click', z2aClick);
if (sortRatingZ2ABtn) sortRatingZ2ABtn.addEventListener('click', sortRatingZ2AClick);
if (addSubmit) addSubmit.addEventListener('click', addClick);
if (updateSubmit) updateSubmit.addEventListener('click', updateClick);
if (deleteSubmit) deleteSubmit.addEventListener('click', deleteClick);

// Attach click listener to all .refresh-btn elements
refreshBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const searchInput = document.getElementById('search-string');
        if (searchInput) {
            searchInput.value = '';
        }

        movieList.reset(initialMovies);
    });
});

/**
- Search for a movie by ID or Title
- @event Click#searchBtn
- @function searchClick
 */
function searchClick() {
    const formEl = document.getElementById("form-list-control");
    const query = formEl ? formEl.elements["search-string"].value.trim().toLowerCase() : "";

    // If search box is empty, display all movies
    if (!query) {
        movieList.refresh();
        return;
    }

    // Filter movies matching either ID or Title
    const filteredMovies = movieList.movieList.filter(movie => {
        const matchesId = String(movie.id).toLowerCase().includes(query);
        const matchesTitle = movie.title.toLowerCase().includes(query);
        return matchesId || matchesTitle;
    });

    // Clear existing rows and re-render matches as table rows
    movieList.removeElements();
    if (filteredMovies.length === 0) {
        showMessage("No movies found matching your search.", "DarkOrange", "white");
    } else {
        filteredMovies.forEach((movie, index) => movieList.movieRow(movie, index));
    }
}

/**
- Sort the movieList in ascending order
- @event Click#sortA2ZBtn
- @function a2zClick
 */
function a2zClick() {
    movieList.sortA2Z();
}

/**
- Sort the movieList in descending order
- @event Click#sortZ2ABtn
- @function z2aClick
 */
function z2aClick() {
    movieList.sortZ2A();
}

/**
- Sort the movieList by highest-to-lowest rating, then Z to A
- @event Click#sortRatingZ2ABtn
- @function sortRatingZ2AClick
 */
function sortRatingZ2AClick() {
    movieList.sortRatingAndZ2A();
}

/**
- @event Click#addSubmit
- @function addClick
- @description Add a new movie to the list
 */
function addClick() {
    const formElements = document.getElementById("form-add").elements;
    const title = formElements["title"].value.trim();
    const year = Number(formElements["year"].value);
    const rating = Number(formElements["rating"].value);

    const pattern = /^[a-z0-9\s]*$/i;
    const test = pattern.test(title);
    const yearIsInt = Number.isInteger(year);
    const ratingIsValid = !isNaN(rating) && rating >= 0 && rating <= 10;

    if (test && title.length > 0 && yearIsInt && ratingIsValid) {
        movieList.add(title, year, rating);

        formElements.title.value = "";
        formElements.year.value = "";
        formElements.rating.value = "";

        showMessage("Movie Added Successfully", "chartreuse", "black");
    } else if (!test || title.length === 0) {
        showMessage("Invalid title, must be alphanumeric with spaces only", "red", "white");
    } else if (!yearIsInt) {
        showMessage("Invalid year, must be an integer", "red", "white");
    } else {
        showMessage("Invalid rating, must be between 0 and 10", "red", "white");
    }
}

/**
- Get movie data from the movie list to update when typing an index
- @function getData
 */
function getData() {
    console.log("getData");
    const idValue = document.getElementById('upIndex').value;
    const upIndex = Number(idValue);
    const upperBound = movieList.movieList.length;

    if (upIndex > 0 && upIndex <= upperBound) {
        const title = document.getElementById('upTitle');
        const year = document.getElementById('upYear');
        const row = movieList.getRow(upIndex - 1);
        title.value = row.title;
        year.value = row.year;
    } else {
        showMessage("No such index exists", "DarkOrange", "white");
    }
}

const upIndex = document.getElementById('upIndex');
if (upIndex) upIndex.addEventListener('change', getData);

/**
- @event Click#updateSubmit
- @function updateClick
- @description Update a movie in the list
 */
function updateClick() {
    const index = Number(document.getElementById("upIndex").value) - 1;
    const title = document.getElementById("upTitle").value.trim();
    const year = Number(document.getElementById("upYear").value);
    const existingMovie = movieList.getRow(index);

    if (!existingMovie) {
        showMessage("No such index exists", "DarkOrange", "white");
        return;
    }

    const pattern = /^[a-z0-9\s]*$/i;
    const test = pattern.test(title);
    const yearIsInt = Number.isInteger(year);

    if (test && title.length > 0 && yearIsInt) {
        movieList.update(index, title, year, existingMovie.rating);
        document.getElementById("upIndex").value = "";
        document.getElementById("upTitle").value = "";
        document.getElementById("upYear").value = "";
        showMessage("Movie Updated Successfully", "chartreuse", "black");
    } else if (!test || title.length === 0) {
        showMessage("Invalid title, must be alphanumeric with spaces only", "red", "white");
    } else {
        showMessage("Invalid year, must be an integer", "red", "white");
    }
}

/**
- @event Click#deleteClick
- @function deleteClick
- @description Delete a movie from the movieList
 */
function deleteClick() {
    const indexElement = document.getElementById("delIndex");
    const index = Number(indexElement.value) - 1;
    const upperBound = movieList.movieList.length;

    if (index >= 0 && index < upperBound) {
        const movie = movieList.getRow(index);
        const isConfirmed = window.confirm(`Do you want to delete movie "${movie.title}"?`);
        if (isConfirmed) {
            movieList.delete(index);
            indexElement.value = "";
            showMessage("Movie Deleted", "chartreuse", "black");
        } else {
            showMessage("Delete cancelled", "DarkOrange", "white");
        }
    } else {
        showMessage("No such index exists", "DarkOrange", "white");
    }
}

// UI Javascript
function openForm(evt, action) {
    let i, tabContent, tabLinks;
    tabContent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = 'none';
    }
    tabLinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }
    const targetTab = document.getElementById(action);
    if (targetTab) {
        targetTab.style.display = "block";
    }
    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add("active");
    }
}

const defaultOpen = document.getElementById('defaultOpen');
if (defaultOpen) defaultOpen.click();

const dateSpan = document.getElementById("date");
if (dateSpan) {
    const theDate = new Date();
    dateSpan.textContent = theDate.getFullYear();
}

function showMessage(message, colour, text) {
    const msg = document.getElementById('msg');
    if (msg) {
        msg.style.display = "block";
        msg.textContent = message;
        msg.style.backgroundColor = colour;
        msg.style.color = text;
    }
}