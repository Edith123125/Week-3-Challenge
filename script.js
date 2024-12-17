//displaying the Menu

function movieMenu(title, id) {
    const k = document.createElement("k");
    k.className = "movie_list"; // Assigning  a class for styling

    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.className = "delete";
    btn.dataset.movieId = id;

    // title and button addition inside the <k> element
    k.textContent = `${title} `;
    k.appendChild(btn);

    // Appending the <k>
    const containerMenu = document.querySelector("#container_menu");
    containerMenu.appendChild(k);
}


document.querySelector('.btn_menu').addEventListener('click', handleMenu)

function handleMenu(){
    document.querySelector('.btn_menu').disabled=true;

    fetch('http://localhost:3000/films')
    .then(res=> res.json())
    .then(data=>{
        data.forEach(movie=>{
            movieMenu(movie.title);
        });
    })
    .catch((err) => console.error(err));
}


// displaying the movie and button navigation

let movieData = [];// storing globally
let currentIndex = 0;

// Fetch movie data and display the first movie
function fetchMovies() {
  fetch('http://localhost:3000/films')
    .then(res => res.json())
    .then(data => {
      movieData = data; 
      displayMovie(movieData[currentIndex]); // Display the first movie
    })
    .catch(err => console.error('Error fetching movies:', err));
}

// movie are displayed based on current index
function displayMovie(movie) {
  const imageContainer = document.querySelector('.image-container');
  const buttonsDiv = document.querySelector('.buttons');

  imageContainer.innerHTML = '';// clears previous content
  buttonsDiv.innerHTML = '';

  //  image tags
  const img = document.createElement('img');
  img.src = movie.poster;
  img.alt = movie.title;
  img.className = 'movie-poster';
  imageContainer.appendChild(img);

  // Navigation and Action Buttons Container
  const navigationDiv = document.createElement('div');
  navigationDiv.className = 'navigation-buttons';
  // 1. Preceeding Button
  const preceedingBtn = document.createElement('button');
  preceedingBtn.textContent = 'Preceeding Movie';
  preceedingBtn.className = 'movie-btn_preceeding';
  preceedingBtn.onclick = (event) => {
    event.preventDefault(); // Prevents page reload
    currentIndex = (currentIndex - 1 + movieData.length) % movieData.length;
    displayMovie(movieData[currentIndex]);
  };
  navigationDiv.appendChild(preceedingBtn);

  // 2. Next Button
  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next Movie';
  nextBtn.className = 'movie-btn_next';
  nextBtn.onclick = (event) => {
    event.preventDefault(); // Prevents page reload
    currentIndex = (currentIndex + 1) % movieData.length;
    displayMovie(movieData[currentIndex]);
  };
  navigationDiv.appendChild(nextBtn);

  buttonsDiv.appendChild(navigationDiv);

  // Action Buttons Container
  const actionDiv = document.createElement('div');
  actionDiv.className = 'action-buttons';

  // 3. Description Button
  const descriptionBtn = document.createElement('button');
  descriptionBtn.textContent = 'Movie Description';
  descriptionBtn.className = 'movie-btn_description';
  descriptionBtn.onclick = () => {
    const availableTickets = movie.capacity - movie.tickets_sold;
    alert(`Title: ${movie.title}\nDescription: ${movie.description}\nRuntime: ${movie.runtime} minutes\nShowtime: ${movie.showtime}\nAvailable Tickets: ${availableTickets}`);
  };
  actionDiv.appendChild(descriptionBtn);

  // 4. Buy Ticket Button
  let availableTickets = movie.capacity - movie.tickets_sold;
  const buyTicketBtn = document.createElement('button');
  buyTicketBtn.textContent = availableTickets <= 0 ? 'Sold Out' : `Buy Ticket (${availableTickets} available)`;
  buyTicketBtn.className = 'movie-btn ' + (availableTickets <= 0 ? 'sold-out' : 'buy-ticket');
  buyTicketBtn.disabled = availableTickets <= 0;
  buyTicketBtn.onclick = () => {
    if (availableTickets > 0) {
      availableTickets -= 1;
      movie.tickets_sold += 1; // tickets_sold are upadted 
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




//  POST

function handleSubmit(b) {
  b.preventDefault();

  const form = e.target;

  // Get form data
  const films = {
    title: form.title.value.trim(),
    runtime: form.runtime.value.trim(),
    capacity: form.capacity.value.trim(),
    showtime: form.showtime.value.trim(),
    tickets_sold: form.tickets_sold.value.trim(),
    description: form.description.value.trim(),
    poster: form.poster.value.trim(),
  };

  // Check if all fields are filled
  const isFormValid = Object.values(films).every(value => value !== "");
  if (!isFormValid) {
    alert("Please fill out all fields before submitting.");
    return;
  }

  // Call addMovie to POST the movie data
  addMovie(films);

  // Reset the form after submission
  form.reset();
}

function addMovie(films) {
  fetch('http://localhost:3000/films', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(films),
  })
    .then(res => res.json())
    .then(movie => {
      console.log('Movie added:', movie);
      alert(`Movie "${movie.title}" added successfully!`);
    })
    .catch(err => console.error('Error adding movie:', err));
}

// Attach event listener to form
document.querySelector('#movie-form').addEventListener('submit', handleSubmit);




//  Deleting a movie using DELETE


document.addEventListener("click", (b) => {
  if (b.target.classList.contains("delete")) {
      const movieId = b.target.dataset.movieId; 
      const parentElement = b.target.closest("k"); // Find the parent <k>

      if (movieId && parentElement) {
          parentElement.remove(); // Remove movie from DOM
          deleteMovie(movieId); 
      } else {
          console.error("Error: Movie ID or parent element not found");
      }
  }
});

function deleteMovie(id) {
  console.log("Deleting movie with ID:", id); // Log for debugging
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
          console.log(`Movie with ID ${id} deleted successfully.`);
          alert("Movie deleted successfully!");
      })
      .catch((err) => console.error("Error deleting movie:", err));
}
