// Book class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI class
class UI {
    static displayBooks(){
        const books = Store.getBooks();

        books.forEach((book) =>{
            UI.addBookToList(book);
        });
    }

    static addBookToList(book){
        const list = document.querySelector("#book-list");

        const row = document.createElement('tr');
        //Alt + 0096 for aplice inverso
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static clearFields(){
        document.querySelector('#title').value = "";
        document.querySelector('#author').value = "";
        document.querySelector('#isbn').value = "";
    }

    static showAlert(msg, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(msg));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        //remove it after x seconds
        setTimeout(() =>{
            document.querySelector('.alert').remove()
        }, 3000);
    }
}

//Store Class
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book, index) =>{
            if(book.isbn === isbn){
                books.splice(index, 1);
            };
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event: Display Book

document.addEventListener("DOMContentLoaded", UI.displayBooks);

//Event: Add book

document.querySelector('#book-form').addEventListener('submit', (e) =>{
    //remove default action
    e.preventDefault();

    //get values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //controllo
    if(title == '' || author == '' || isbn == ''){
        showAlert('Devi riempire tutti i campi', 'danger');
    }
    else{

        const book = new Book(title, author, isbn);

        //Book to UI
        UI.addBookToList(book);
        UI.clearFields();
        UI.showAlert('Book added', 'success');

        //add books
        Store.addBook(book);
    }
});

//Event: Remove Book

document.querySelector("#book-list").addEventListener('click', (e) =>{

    //UI removing a book
    UI.deleteBook(e.target);
    UI.showAlert('Book removed', 'success');

    //Update localStorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
})
