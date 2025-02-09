const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const bookResults = document.getElementById('book-results');
const myLibrary = document.getElementById('my-library');
const genreSelect = document.getElementById('genre-select');

let library = JSON.parse(localStorage.getItem('library')) || [];


async function searchBooks(query) {
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
  const data = await response.json();
  return data.items || [];
}


function displayBooks(books) {
  bookResults.innerHTML = '';
  books.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    bookCard.innerHTML = `
      <img src="${book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}" alt="${book.volumeInfo.title}">
      <h3>${book.volumeInfo.title}</h3>
      <p>${book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
      <button onclick="addToLibrary('${book.id}')">Add to Library</button>
    `;
    bookResults.appendChild(bookCard);
  });
}


function addToLibrary(bookId) {
  const book = library.find(b => b.id === bookId);
  if (!book) {
    const selectedBook = bookResults.querySelector(`[onclick="addToLibrary('${bookId}')"]`).parentElement;
    const newBook = {
      id: bookId,
      title: selectedBook.querySelector('h3').innerText,
      author: selectedBook.querySelector('p').innerText,
      status: 'To Read'
    };
    library.push(newBook);
    saveLibrary();
    displayMyLibrary();
  }
}


function saveLibrary() {
  localStorage.setItem('library', JSON.stringify(library));
}


function displayMyLibrary() {
  myLibrary.innerHTML = '';
  library.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    bookCard.innerHTML = `
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <p>Status: ${book.status}</p>
      <button onclick="updateStatus('${book.id}', 'Reading')">Reading</button>
      <button onclick="updateStatus('${book.id}', 'Completed')">Completed</button>
      <button onclick="removeFromLibrary('${book.id}')">Remove</button>
    `;
    myLibrary.appendChild(bookCard);
  });
}

function updateStatus(bookId, status) {
  const book = library.find(b => b.id === bookId);
  if (book) {
    book.status = status;
    saveLibrary();
    displayMyLibrary();
  }
}


function removeFromLibrary(bookId) {
  library = library.filter(b => b.id !== bookId);
  saveLibrary();
  displayMyLibrary();
}


searchButton.addEventListener('click', async () => {
  const query = searchInput.value;
  if (query) {
    const books = await searchBooks(query);
    displayBooks(books);
  }
});

genreSelect.addEventListener('change', () => {
  const genre = genreSelect.value;

  console.log(`Selected Genre: ${genre}`);
});


displayMyLibrary();