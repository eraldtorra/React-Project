import { useState, useEffect } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchBook } from "./components/SearchBook";
import { Pagination } from "../Utils/Pagination";
import { Link } from "react-router-dom";


export const SearchBookPage = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalBooks, setTotalBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [categorySelection, setCategorySelection] = useState('Book category');


    useEffect(() => {

        const fetchBooks = async () => {
            const baseurl: string = "http://localhost:9090/api/books";

            let url: string = '';

           

            if (search === '' && categorySelection === 'Book category') {
                url = `${baseurl}?page=${currentPage - 1}&size=${booksPerPage}`;
                
            } else {
                let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`);

              
                
                url = baseurl + searchWithPage;
            
            }




            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.books;

            setTotalBooks(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

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
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl, search, booksPerPage, categorySelection]);

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

    const searchHandleChange = () => {
        setCurrentPage(1);
        if (search === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`)
        }
        setCategorySelection('Book category');
    }

    const categoryField = (value: string) => {
       
        setCurrentPage(1);
        if(
            value.toLowerCase() === 'fe' ||
            value.toLowerCase() === 'be' ||
            value.toLowerCase() === 'devops' ||
            value.toLowerCase() === 'data'
        ){
            setCategorySelection(value);
         
            let newSearchUrl = `/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`;
            setSearchUrl(newSearchUrl);
        
        }else{
            setCategorySelection('All');
            setSearchUrl(`?page=<pageNumber>&size='${booksPerPage}`);
        }
    }

    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalBooks ? booksPerPage * currentPage : totalBooks;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="container">
                <div>
                    <div className="row mt-5">
                        <div className="col-6">
                            <div className="d-flex">
                                <input type="search" className="form-control me-2" placeholder="Search book"
                                    aria-labelledby="Search" onChange={e => setSearch(e.target.value)} />
                                <button className="btn btn-outline-success" onClick={() => searchHandleChange()}>
                                    Search
                                </button>

                            </div>
                        </div>
                        <div className="col-4">
                            <div className="dropdown">
                                <button className='btn btn-secondary dropdown-toggle' type='button'
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown'
                                    aria-expanded='false'>
                                    {categorySelection}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li onClick={() => categoryField('All')}>
                                        <p className="dropdown-item" >All</p>
                                    </li>
                                    <li onClick={() => categoryField('FE')}>
                                        <p className="dropdown-item" >Front End</p>
                                    </li>
                                    <li onClick={() => categoryField('be')}>
                                        <p className="dropdown-item" >Back End</p>
                                    </li>
                                    <li onClick={() => categoryField('devops')}>
                                        <p className="dropdown-item" >DevOps</p>
                                    </li>
                                    <li onClick={() => categoryField('Data')}>
                                        <p className="dropdown-item" >Data</p>
                                    </li>
                                </ul>
                            </div>

                        </div>

                    </div>
                    {totalBooks > 0 ?
                        <>
                            <div className="mt-3">
                                <h5>Number of results: ({totalBooks})</h5>

                            </div>
                            <p>
                                {indexOfFirstBook + 1} to {lastItem} of {totalBooks} items:
                            </p>
                            {books.map(book => (
                                <SearchBook key={book.id} book={book} />
                            ))}
                        </>
                        :
                        <div className="m-3">
                            <h4>
                                Can't find what you are looking for?
                            </h4>
                            <Link type="button" className="btn main-color btn-md px-3 me-md-2 fw-bold text-white"
                                to="/messages">
                                Library Service
                            </Link>
                        </div>
                    }

                    {totalPages > 1 &&
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                    }

                </div>
            </div>

        </div>

    );

}