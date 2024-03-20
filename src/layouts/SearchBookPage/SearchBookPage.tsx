import { useState, useEffect } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";


export const SearchBookPage = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);


    useEffect(() => {
        const fetchBooks = async () => {
            const baseurl: string = "http://localhost:9090/api/books";

            const url: string = `${baseurl}?page=0&size=5`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.books;

            const loadedBooks: BookModel[] = [];

            for (const key in responseData) {
                loadedBooks.push(
                    new BookModel(
                        responseData[key].id,
                        responseData[key].title,
                        responseData[key].author,
                        responseData[key].description,
                        responseData[key].copies,
                        responseData[key].copiesAvailable,
                        responseData[key].category,
                        responseData[key].img
                    )
                );
            }

            setBooks(loadedBooks);
            setLoading(false);

        };

        fetchBooks().catch((error) => {
            setHttpError(error.message);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <SpinnerLoading />
        );
    }

    if (httpError) {
        return (
            <div className="container mt-5">
                <p>{httpError}</p>
            </div>
        );
    }

    return (
        <div className="container">
            <div>
                <div className="row mt-5">
                    <div className="col-6">
                        <div className="d-flex">
                            <input type="search" className="form-control me-2" placeholder="Search book"
                                aria-labelledby="Search" />
                            <button className="btn btn-outline-success">
                                Search
                            </button>

                        </div>
                        <div className="col-4">
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown" aria-aria-expanded='false'>
                                    Categories
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li>
                                        <a className="dropdown-item" href="#">All</a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#">Front End</a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#">Back End</a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#">DevOps</a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#">Data</a>
                                    </li>
                                </ul>
                            </div>

                        </div>

                    </div>

                    <div className="mt-3">
                        <h5>Number of results: (22)</h5>

                    </div>
                    <p>
                        1 to 5 of 22 items: 
                    </p>
                    {books.map(book =>(
                        <SearchBook key={book.id} book={book} />
                    ))}

                </div>
            </div>

        </div>
    );

}