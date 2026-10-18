# Library Books REST API Design

## Overview

This REST API manages books in a library. It allows clients to retrieve, create, update, and delete books, as well as search for books written by a particular author.

**Base URL:** `/api/books`

Each book has the following fields:

* `id`: A unique identifier for the book.
* `title`: The title of the book.
* `author`: The name of the author.
* `publishedYear`: The year the book was published.
* `genre`: The book's genre.

## API Endpoints

### 1. List All Books

* **Method:** `GET`
* **Path:** `/api/books`
* **Description:** Retrieves a list of all books in the library.
* **Success status code:** `200 OK`

**Example request:**

```http
GET /api/books
```

### 2. Get One Book

* **Method:** `GET`
* **Path:** `/api/books/{id}`
* **Description:** Retrieves a single book using its unique ID.
* **Success status code:** `200 OK`

**Example request:**

```http
GET /api/books/1
```

### 3. Create a Book

* **Method:** `POST`
* **Path:** `/api/books`
* **Description:** Creates a new book in the library.
* **Success status code:** `201 Created`

**Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "publishedYear": 1958,
  "genre": "Historical Fiction"
}
```

### 4. Update a Book

* **Method:** `PUT`
* **Path:** `/api/books/{id}`
* **Description:** Updates an existing book using its unique ID.
* **Success status code:** `200 OK`

**Example request:**

```http
PUT /api/books/1
```

**Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "publishedYear": 1958,
  "genre": "Classic Literature"
}
```

### 5. Delete a Book

* **Method:** `DELETE`
* **Path:** `/api/books/{id}`
* **Description:** Deletes a book using its unique ID.
* **Success status code:** `204 No Content`

**Example request:**

```http
DELETE /api/books/1
```

A successful deletion returns no response body.

### 6. List Books by Author

* **Method:** `GET`
* **Path:** `/api/books?author={authorName}`
* **Description:** Retrieves books written by a specified author using the `author` query parameter.
* **Success status code:** `200 OK`

**Example request:**

```http
GET /api/books?author=Chinua%20Achebe
```

The server returns a list of books whose author matches the requested name.

## Error Status Codes

### 400 Bad Request

* **Description:** The request contains invalid data or parameters.
* **Example:** A client attempts to create a book without providing the required `title` or `author` field.
* **Example response:**

```json
{
  "error": "Bad Request",
  "message": "The title and author fields are required."
}
```

### 404 Not Found

* **Description:** The requested resource does not exist.
* **Example:** A client requests `/api/books/999`, but no book with ID `999` exists.
* **Example response:**

```json
{
  "error": "Not Found",
  "message": "The requested book was not found."
}
```

## Summary

This REST API provides six endpoints for managing library books. It uses standard HTTP methods and status codes to communicate the results of requests and report errors.
