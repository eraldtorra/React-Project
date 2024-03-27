import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";


export const BookCheckoutPage = () => {


    const [book, setBook] = useState<BookModel>();
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const bookId = window.location.pathname.split("/")[2];


    useEffect(() => {
        const fetchBooks = async () => {
            const baseurl: string = `http://localhost:9090/api/books/${bookId}`;


            const response = await fetch(baseurl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();


            const loadedBook: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img
            };
            setBook(loadedBook);
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
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }



    return (
        <div>
            <div className="container d-none d-lg-block">
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {book?.img ?
                            <img src={book.img} alt='Book' width='226' height='349' />
                            :

                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')}
                                alt='Book' width='226' height='349' />
                        }
                        

                    </div>
                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>

                            <StarsReview rating={4} size={32} />
                        </div>

                    </div>

                </div>
                <hr />
            </div>
            <div className="container d-lg-none mt-5">
                <div className="d-flex justify-content-center alighn-items-center">
                    {book?.img ?
                        <img src={book.img} alt='Book' width='226' height='349' />
                        :

                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')}
                            alt='Book' width='226' height='349' />
                    }
                </div>
                <div className="mt-4">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>

                        <StarsReview rating={4} size={32} />
                        <StarsReview rating={4} size={32} />

                       

                    </div>

                </div>
                <hr />


            </div>
        </div>
    );
}