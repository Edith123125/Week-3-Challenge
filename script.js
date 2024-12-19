// Function to display each movie in the menu
function movieMenu(title, id) {
    const k = document.createElement("k");
    k.className = "movie_list"; // Assigning a class for styling the movie list

    const btn = document.createElement("button");
    btn.textContent = "Delete"; 
    btn.className = "delete"; 
    btn.dataset.movieId = id; // Storing the movie ID as a data attribute on the button

    // Adding the movie title and delete button inside the <k> element
    k.textContent = `${title} `;
    k.appendChild(btn);

    // Appending the <k> element to the container
    const containerMenu = document.querySelector("#container_menu");
    containerMenu.appendChild(k);
}

// Event listener for the "Menu" button t
document.querySelector('.btn_menu').addEventListener('click', handleMenu);

// Function to handle the display of movies when the Menu button is clicked
function handleMenu() {
    document.querySelector('.btn_menu').disabled = true; // Disables the Menu button to prevent multiple clicks

    fetch('http://localhost:3000/films') // Fetch movie data from the server
        .then(res => res.json())
        .then(data => {
            data.forEach(movie => {
                movieMenu(movie.title, movie.id); 
            });
        })
        .catch((err) => console.error(err)); 
}

// Global variables to store movie data and the current index for navigation
let movieData = []; // Array to hold fetched movie data
let currentIndex = 0; // To keep track of the current movie displayed

// Fetch movie data and display the first movie
function fetchMovies() {
    fetch('http://localhost:3000/films') // Fetch movie data from the server
        .then(res => res.json())
        .then(data => {
            movieData = data; // Store the fetched data in movieData
            displayMovie(movieData[currentIndex]); // Display the first movie
        })
        .catch(err => console.error('Error fetching movies:', err)); 
}

// Function to display the movie based on the current index
function displayMovie(movie) {
    const imageContainer = document.querySelector('.image-container');
    const buttonsDiv = document.querySelector('.buttons');

    imageContainer.innerHTML = ''; // Clear previous content
    buttonsDiv.innerHTML = ''; // Clear previous buttons

    // Create and append the movie poster
    const img = document.createElement('img');
    img.src = movie.poster;
    img.alt = movie.title;
    img.className = 'movie-poster';
    imageContainer.appendChild(img);

    // Create navigation buttons
    const navigationDiv = document.createElement('div');
    navigationDiv.className = 'navigation-buttons';

    const precedingBtn = document.createElement('button');
    precedingBtn.textContent = 'Preceding Movie';
    precedingBtn.className = 'movie-btn_preceding';
    precedingBtn.onclick = (event) => {
        event.preventDefault();
        currentIndex = (currentIndex - 1 + movieData.length) % movieData.length;
        displayMovie(movieData[currentIndex]);
    };
    navigationDiv.appendChild(precedingBtn);

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next Movie';
    nextBtn.className = 'movie-btn_next';
    nextBtn.onclick = (event) => {
        event.preventDefault();
        currentIndex = (currentIndex + 1) % movieData.length;
        displayMovie(movieData[currentIndex]);
    };
    navigationDiv.appendChild(nextBtn);

    buttonsDiv.appendChild(navigationDiv);

    // Create action buttons
    const actionDiv = document.createElement('div');
    actionDiv.className = 'action-buttons';

    const descriptionBtn = document.createElement('button');
    descriptionBtn.textContent = 'Movie Description';
    descriptionBtn.className = 'movie-btn_description';
    descriptionBtn.onclick = () => {
        const availableTickets = movie.capacity - movie.tickets_sold;
        alert(`Title: ${movie.title}\nDescription: ${movie.description}\nRuntime: ${movie.runtime} minutes\nShowtime: ${movie.showtime}\nAvailable Tickets: ${availableTickets}`);
    };
    actionDiv.appendChild(descriptionBtn);

    let availableTickets = movie.capacity - movie.tickets_sold;
    const buyTicketBtn = document.createElement('button');
    buyTicketBtn.textContent = availableTickets <= 0 ? 'Sold Out' : `Buy Ticket (${availableTickets} available)`;
    buyTicketBtn.className = 'movie-btn ' + (availableTickets <= 0 ? 'sold-out' : 'buy-ticket');
    buyTicketBtn.disabled = availableTickets <= 0;
    buyTicketBtn.onclick = () => {
        if (availableTickets > 0) {
            availableTickets -= 1;
            movie.tickets_sold += 1;
            buyTicketBtn.textContent = availableTickets <= 0 ? 'Sold Out' : `Buy Ticket (${availableTickets} available)`;
            buyTicketBtn.disabled = availableTickets <= 0;
            alert(`You bought a ticket for ${movie.title}!`);
        }
        if (availableTickets <= 0) {
            buyTicketBtn.classList.add('sold-out');
        }
    };
    actionDiv.appendChild(buyTicketBtn);

    buttonsDiv.appendChild(actionDiv);
}

// Initial fetch call when the page loads
document.addEventListener('DOMContentLoaded', fetchMovies);

// Handling movie deletion via DELETE request
document.addEventListener("click", (b) => {
    if (b.target.classList.contains("delete")) {
        const movieId = b.target.dataset.movieId;
        const parentElement = b.target.closest("k");

        if (movieId && parentElement) {
            parentElement.remove();
            deleteMovie(movieId);
        } else {
            console.error("Error: Movie ID or parent element not found");
        }
    }
});

// Function to delete a movie from the server
function deleteMovie(id) {
    fetch(`http://localhost:3000/films/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Failed to delete the movie");
            }
            alert("Movie deleted successfully!");
        })
        .catch((err) => console.error("Error deleting movie:", err));
}
