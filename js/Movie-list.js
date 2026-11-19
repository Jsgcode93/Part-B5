/**
 * @file Movie-list.js
 * @description Movie and MovieList classes with localStorage and Rating support.
 * @author Jeremy Geddes
 */

// Movie class to represent individual movie objects
class Movie {
    // Constructor function to initialize movie properties: id, title, year, and rating
    constructor(id, title, year, rating) {
        this.id = id;
        this.title = title;
        this.year = Number(year);
        this.rating = Number(rating);
    }
}

// MovieList class 
class MovieList {
    constructor(rootId, defaultMovies = []) {
        this.rootId = rootId;
        this.movieList = this.loadFromStorage(defaultMovies);
        this.refresh();
    }

    // LoadFromStorage function to retrieve saved movies from localStorage 
    loadFromStorage(defaultMovies) {
        const stored = localStorage.getItem('movieDatabase');
        if (stored && stored !== "undefined" && stored !== "null") {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.map(m => new Movie(m.id, m.title, m.year, m.rating));
                }
            } catch (e) {
                console.error("Failed to parse localStorage, resetting...", e);
            }
        }
        
        // Generate initial default movies with IDs and ratings
        const initial = defaultMovies.map((m, index) => new Movie(index + 1, m.title, m.year, m.rating || 5.0));
        localStorage.setItem('movieDatabase', JSON.stringify(initial));
        return initial;
    }

    // SaveToStorage function 
    saveToStorage() {
        localStorage.setItem('movieDatabase', JSON.stringify(this.movieList));
    }

// MovieRow function 
    movieRow(movie, index) {
        const rootElement = document.getElementById(this.rootId);
        if (!rootElement) return;

        const row = document.createElement('tr');
        row.classList.add('movie-row');

        row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${movie.title}</td>
            <td>${movie.year}</td>
            <td>${movie.rating}</td>
        `;

        rootElement.appendChild(row);
    }

    // GenMovieList function to loop through all movies in the list and generate their rows
    genMovieList() {
        for (let i = 0; i < this.movieList.length; i++) {
            this.movieRow(this.movieList[i], i);
        }
    }

// RemoveElements function 
    removeElements() {
        const rootElement = document.getElementById(this.rootId);
        if (!rootElement) return;
        const childNodes = rootElement.getElementsByClassName('movie-row');
        while (childNodes.length > 0) {
            rootElement.removeChild(childNodes[0]);
        }
    }

    // Refresh function to clear the DOM elements and re-render the current movie list
    refresh() {
        this.removeElements();
        this.genMovieList();
    }

    // Reset function to clear localStorage & restore default movies
    reset(defaultMovies) {
        localStorage.removeItem('movieDatabase');

        this.movieList = this.loadFromStorage(defaultMovies);
        this.refresh();
    }

    // Add function to create a new movie with a unique ID, push it to the list, save, and refresh
    add(title, year, rating) {
        const newId = this.movieList.length > 0 ? Math.max(...this.movieList.map(m => m.id)) + 1 : 1;
        const newMovie = new Movie(newId, title, year, rating);
        this.movieList.push(newMovie);
        this.saveToStorage();
        this.refresh();
    }

    // Update function to modify an existing movie's properties
    update(index, title, year, rating) {
        if (this.movieList[index]) {
            this.movieList[index].title = title;
            this.movieList[index].year = Number(year);
            this.movieList[index].rating = Number(rating);
            this.saveToStorage();
            this.refresh();
        }
    }

    // Delete function to remove a movie from the list 
    delete(index) {
        this.movieList.splice(index, 1);
        this.saveToStorage();
        this.refresh();
    }

    // GetRow function to retrieve a specific movie object by its array index
    getRow(index) {
        return this.movieList[index];
    }

    // SortA2Z function to sort the movie list(A to Z)
    sortA2Z() {
        this.movieList.sort((a, b) => a.title.localeCompare(b.title));
        this.saveToStorage();
        this.refresh();
    }

    // SortZ2A function to sort the movie list  (Z to A)
    sortZ2A() {
        this.movieList.sort((a, b) => b.title.localeCompare(a.title));
        this.saveToStorage();
        this.refresh();
    }

    // SortRatingAndZ2A function to sort movies primarily by highest rating, then secondary by title (Z to A)
    sortRatingAndZ2A() {
        this.movieList.sort((a, b) => {
            // Primary sort: Rating highest to lowest
            if (b.rating !== a.rating) {
                return b.rating - a.rating;
            }
            // Secondary sort: Title Z to A 
            return b.title.localeCompare(a.title);
        });
        this.saveToStorage();
        this.refresh();
    }

    // Search function
    search(nameString) {
        let shortList = this.movieList.filter(movie => movie.title.toLowerCase().includes(nameString.toLowerCase()));
        this.removeElements();
        shortList.forEach((movie, index) => this.movieRow(movie, index));
    }
}