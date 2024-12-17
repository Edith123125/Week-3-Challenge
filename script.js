// Function to display each movie in the menu
function movieMenu(title, id) {
    const k = document.createElement("k");
    k.className = "movie_list"; // Assigning a class for styling the movie list

    const btn = document.createElement("button");
    btn.textContent = "Delete";  // Button text for deletion
    btn.className = "delete";  // Class to style the delete button
    btn.dataset.movieId = id;  // Storing the movie ID as a data attribute on the button

    // Adding the movie title and delete button inside the <k> element
    k.textContent = `${title} `;
    k.appendChild(btn);

    // Appending the <k> element to the container
    const containerMenu = document.querySelector("#container_menu");
    containerMenu.appendChild(k);
}

// Event listener for the "Menu" button to fetch and display the movie list
document.querySelector('.btn_menu').addEventListener('click', handleMenu)

// Function to handle the display of movies when the "Menu" button is clicked
function handleMenu() {
    document.querySelector('.btn_menu').disabled = true;  // Disables the "Menu" button to prevent multiple clicks

    fetch('http://localhost:3000/films')  // Fetch movie data from the server
        .then(res => res.json())
        .then(data => {
            data.forEach(movie => {
                movieMenu(movie.title);  // Display each movie in the menu
            });
        })
        .catch((err) => console.error(err));  // Log any errors that occur
}

// Global variables to store movie data and the current index for navigation
let movieData = [];  // Array to hold fetched movie data
let currentIndex = 0;  // To keep track of the current movie displayed

// Fetch movie data and display the first movie
function fetchMovies() {
    fetch('http://localhost:3000/films')  // Fetch movie data from the server
        .then(res => res.json())
        .then(data => {
            movieData = data;  // Store the fetched data in movieData
            displayMovie(movieData[currentIndex]);  // Display the first movie
        })
        .catch(err => console.error('Error fetching movies:', err));  // Log any errors
}

// Function to display the movie based on the current index
function displayMovie(movie) {
    const imageContainer = document.querySelector('.image-container');
    const buttonsDiv = document.querySelector('.buttons');

    imageContainer.innerHTML = '';  // Clear previous content
    buttonsDiv.innerHTML = '';  // Clear previous buttons

    // Create and append the movie poster
    const img = document.createElement('img');
    img.src = movie.poster;
    img.alt = movie.title;
    img.className = 'movie-poster';
    imageContainer.appendChild(img);

    // Create a div to hold navigation buttons
    const navigationDiv = document.createElement('div');
    navigationDiv.className = 'navigation-buttons';

    // Preceding Movie Button
    const preceedingBtn = document.createElement('button');
    preceedingBtn.textContent = 'Preceeding Movie';
    preceedingBtn.className = 'movie-btn_preceeding';
    preceedingBtn.onclick = (event) => {
        event.preventDefault();  // Prevents page reload
        currentIndex = (currentIndex - 1 + movieData.length) % movieData.length;
        displayMovie(movieData[currentIndex]);  // Display the previous movie
    };
    navigationDiv.appendChild(preceedingBtn);

    // Next Movie Button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next Movie';
    nextBtn.className = 'movie-btn_next';
    nextBtn.onclick = (event) => {
        event.preventDefault();  // Prevents page reload
        currentIndex = (currentIndex + 1) % movieData.length;
        displayMovie(movieData[currentIndex]);  // Display the next movie
    };
    navigationDiv.appendChild(nextBtn);

    buttonsDiv.appendChild(navigationDiv);  // Append navigation buttons to the buttons container

    // Action Buttons Container
    const actionDiv = document.createElement('div');
    actionDiv.className = 'action-buttons';

    // Description Button
    const descriptionBtn = document.createElement('button');
    descriptionBtn.textContent = 'Movie Description';
    descriptionBtn.className = 'movie-btn_description';
    descriptionBtn.onclick = () => {
        const availableTickets = movie.capacity - movie.tickets_sold;
        // Display movie details in an alert
        alert(`Title: ${movie.title}\nDescription: ${movie.description}\nRuntime: ${movie.runtime} minutes\nShowtime: ${movie.showtime}\nAvailable Tickets: ${availableTickets}`);
    };
    actionDiv.appendChild(descriptionBtn);

    // Buy Ticket Button
    let availableTickets = movie.capacity - movie.tickets_sold;
    const buyTicketBtn = document.createElement('button');
    buyTicketBtn.textContent = availableTickets <= 0 ? 'Sold Out' : `Buy Ticket (${availableTickets} available)`;
    buyTicketBtn.className = 'movie-btn ' + (availableTickets <= 0 ? 'sold-out' : 'buy-ticket');
    buyTicketBtn.disabled = availableTickets <= 0;  // Disable if no tickets available
    buyTicketBtn.onclick = () => {
        if (availableTickets > 0) {
            availableTickets -= 1;
            movie.tickets_sold += 1;  // Update tickets sold
            buyTicketBtn.textContent = availableTickets <= 0 ? 'Sold Out' : `Buy Ticket (${availableTickets} available)`;
            buyTicketBtn.disabled = availableTickets <= 0;
            alert(`You bought a ticket for ${movie.title}!`);  // Display success message
        }
        if (availableTickets <= 0) {
            buyTicketBtn.classList.add('sold-out');  // Change button style to indicate sold-out
        }
    };
    actionDiv.appendChild(buyTicketBtn);

    buttonsDiv.appendChild(actionDiv);  // Append action buttons to the buttons container
}

// Initial fetch call when the page loads
document.addEventListener('DOMContentLoaded', fetchMovies);

// Handling form submission to add a new movie via POST
function handleSubmit(b) {
    b.preventDefault();  // Prevent default form submission

    const form = e.target;  // Get the form element

    // Create a movie object from the form data
    const films = {
        title: form.title.value.trim(),
        runtime: form.runtime.value.trim(),
        capacity: form.capacity.value.trim(),
        showtime: form.showtime.value.trim(),
        tickets_sold: form.tickets_sold.value.trim(),
        description: form.description.value.trim(),
        poster: form.poster.value.trim(),
    };

    // Check if all fields are filled out
    const isFormValid = Object.values(films).every(value => value !== "");
    if (!isFormValid) {
        alert("Please fill out all fields before submitting.");
        return;  // Return if the form is invalid
    }

    // Call addMovie to POST the movie data
    addMovie(films);

    form.reset();  // Reset the form after submission
}

// Function to add a new movie to the server
function addMovie(films) {
    fetch('http://localhost:3000/films', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(films),  // Send movie data as JSON
    })
        .then(res => res.json())
        .then(movie => {
            console.log('Movie added:', movie);
            alert(`Movie "${movie.title}" added successfully!`);  // Notify user of success
        })
        .catch(err => console.error('Error adding movie:', err));  // Log any errors
}

// Attach event listener to form for movie submission
document.querySelector('#movie-form').addEventListener('submit', handleSubmit);

// Handling movie deletion via DELETE request
document.addEventListener("click", (b) => {
    if (b.target.classList.contains("delete")) {  // Check if delete button was clicked
        const movieId = b.target.dataset.movieId;  // Get movie ID from data attribute
        const parentElement = b.target.closest("k");  // Find the parent <k> element

        if (movieId && parentElement) {
            parentElement.remove();  // Remove the movie element from the DOM
            deleteMovie(movieId);  // Call deleteMovie to remove the movie from the server
        } else {
            console.error("Error: Movie ID or parent element not found");  // Error handling
        }
    }
});

// Function to delete a movie from the server
function deleteMovie(id) {
    console.log("Deleting movie with ID:", id);  // Log for debugging
    fetch(`http://localhost:3000/films/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => {
            if (!res.ok) {
                console.error("Failed to delete movie:", res.statusText);
                throw new Error("Failed to delete the movie");
            }
            console.log(`Movie with ID ${id} deleted successfully.`);  // Log successful deletion
            alert("Movie deleted successfully!");  // Notify user of success
        })
        .catch((err) => console.error("Error deleting movie:", err));  // Log any errors
}
