# Bookstore API

A TypeScript-based API for managing a collection of books, built with Express, TypeORM, and SQLite. The API supports basic CRUD operations and includes an endpoint to calculate discounted prices by genre.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Running the Server](#running-the-server)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
    - [Create a Book](#create-a-book)
    - [Get All Books](#get-all-books)
    - [Get a Book by ID](#get-a-book-by-id)
    - [Update a Book](#update-a-book)
    - [Delete a Book](#delete-a-book)
    - [Get Total Discounted Price by Genre](#get-total-discounted-price-by-genre)
- [Error Handling](#error-handling)


## Prerequisites

- **Node.js** (>=14.x)
- **npm** (>=6.x)

Make sure you have these installed on your machine before proceeding.

## Installation

To install the project, clone the repository and install the necessary dependencies:

```bash
git clone <your-repo-url>
cd bookstore-api
npm install
```
## Running Tests

Unit tests are written using Mocha, Chai, and Sinon. To run the tests:

```bash
npm test
```

Ensure the tests cover all scenarios for book operations and price calculation.


## Running the Server

To start the server in development mode:

```bash
npm run build
npm start
```

The API will be accessible at `http://localhost:<PORT>`.

## Database Setup

This project uses SQLite as the database, and TypeORM handles the ORM operations. Upon running the server, TypeORM will automatically set up the database schema based on the entities defined.

If you'd like to manually interact with the database, SQLite files are generated in the project directory.


## API Endpoints

### Create a Book

**POST** `/books`

Request Body:

```json
{
  "title": "Book Title",
  "author": "Author Name",
  "genre": "Genre",
  "price": 19.99
}
```

Response:

- **201 Created**: Returns the created book.

### Get All Books

**GET** `/books`

Response:

- **200 OK**: Returns an array of all books.

### Get a Book by ID

**GET** `/books/:id`

Response:

- **200 OK**: Returns the book with the specified ID.
- **404 Not Found**: If the book doesn't exist.

### Update a Book

**PUT** `/books/:id`

Request Body (optional fields):

```json
{
  "title": "Updated Title",
  "author": "Updated Author",
  "genre": "Updated Genre",
  "price": 24.99
}
```

Response:

- **200 OK**: Returns the updated book.
- **404 Not Found**: If the book doesn't exist.

### Delete a Book

**DELETE** `/books/:id`

Response:

- **200 OK**: Confirms deletion.
- **404 Not Found**: If the book doesn't exist.

### Get Total Discounted Price by Genre

**GET** `/books/discounted-price?genre=<genre>&discount=<discount>`

Response:

- **200 OK**: Returns the total discounted price for the specified genre.
- **400 Bad Request**: If invalid query parameters are provided.

## Error Handling

The API returns errors in the following format:

```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

