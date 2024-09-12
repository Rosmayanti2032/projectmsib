// Get the book form and book lists
const bookForm = document.getElementById('bookForm');
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');

// Initialize the bookshelves
const bookshelves = {
  notFinishedReading: [],
  finishedReading: []
};

// Load data from localStorage
const storedData = localStorage.getItem('bookshelves');
if (storedData) {
  bookshelves = JSON.parse(storedData);
}

// Add book form submission handler
bookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = parseInt(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;
  const id = new Date().getTime();
  const newBook = { id, title, author, year, isComplete };
  addBookToShelf(newBook);
  bookForm.reset();
});

// Add book to shelf
function addBookToShelf(book) {
  if (book.isComplete) {
    bookshelves.finishedReading.push(book);
  } else {
    bookshelves.notFinishedReading.push(book);
  }
  saveDataToLocalStorage();
  renderBookshelves();
}

// Move book between shelves
function moveBook(book, fromShelf, toShelf) {
  const fromIndex = fromShelf.indexOf(book);
  if (fromIndex !== -1) {
    fromShelf.splice(fromIndex, 1);
    toShelf.push(book);
    saveDataToLocalStorage();
    renderBookshelves();
  }
}

// Delete book
function deleteBook(book, shelf) {
  const index = shelf.indexOf(book);
  if (index !== -1) {
    shelf.splice(index, 1);
    saveDataToLocalStorage();
    renderBookshelves();
  }
}

// Save data to localStorage
function saveDataToLocalStorage() {
  localStorage.setItem('bookshelves', JSON.stringify(bookshelves));
}

// Render bookshelves
function renderBookshelves() {
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';
  bookshelves.notFinishedReading.forEach((book) => {
    const bookItem = document.createElement('div');
    bookItem.dataset.bookid = book.id;
    bookItem.innerHTML = `
      <h3>${book.title}</h3>
      <p>Penulis: ${book.author}</p>
      <p>Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">Selesai dibaca</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;
    incompleteBookList.appendChild(bookItem);
  });
  bookshelves.finishedReading.forEach((book) => {
    const bookItem = document.createElement('div');
    bookItem.dataset.bookid = book.id;
    bookItem.innerHTML = `
      <h3>${book.title}</h3>
      <p>Penulis: ${book.author}</p>
      <p>Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">Selesai dibaca</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;
    completeBookList.appendChild(bookItem);
  });
}

// Add event listeners to book list items
incompleteBookList.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const bookId = e.target.parentNode.parentNode.dataset.bookid;
    const book = bookshelves.notFinishedReading.find((book) => book.id === bookId);
    if (e.target.dataset.testid === 'bookItemIsCompleteButton') {
      moveBook(book, bookshelves.notFinishedReading, bookshelves.finishedReading);
    } else if (e.target.dataset.testid === 'bookItemDeleteButton') {
      deleteBook(book, bookshelves.notFinishedReading);
    }
  }
});

completeBookList.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const bookId = e.target.parentNode.parentNode.dataset.bookid;
    const book = bookshelves.finishedReading.find((book) => book.id === bookId);
    if (e.target.dataset.testid === 'bookItemIsCompleteButton') {
      moveBook(book, bookshelves.finishedReading, bookshelves.notFinishedReading);
    } else if (e.target.dataset.testid === 'bookItemDeleteButton