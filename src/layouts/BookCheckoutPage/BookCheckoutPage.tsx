import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";


export const BookCheckoutPage = () => {

    const { authState } = useOktaAuth();


    const [book, setBook] = useState<BookModel>();
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReviews, setIsLoadingReviews] = useState(true);

    // Loans Count
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoans, setIsLoadingCurrentLoans] = useState(true);

    // checkout
    const [checkout, setCheckout] = useState(false);
    const [isCheckingOutLoading, setIsCheckingOutLoading] = useState(true);



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
    }, [checkout]);


    useEffect(() => {
        const fetchReviews = async () => {
            const baseurl: string = `http://localhost:9090/api/reviews/search/findByBookId?bookId=${bookId}`;

            const response = await fetch(baseurl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.reviews;

            const loadedReviews: ReviewModel[] = [];

            let weightedStarReview: number = 0;

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    bookId: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription

                })
                weightedStarReview += responseData[key].rating;
            }

            if (loadedReviews) {
                const round = (Math.round((weightedStarReview / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStars(Number(round));
            }
            setReviews(loadedReviews);
            setIsLoadingReviews(false);
        };

        fetchReviews().catch((error) => {
            setHttpError(error.message);
            setIsLoadingReviews(false);
        });

    }, []);

    useEffect(() => {
        const fetchUserCurrentLoans = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:9090/api/books/secure/checkedout/count`;

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const currentLoansResponse = await fetch(url, requestOptions);
                if (!currentLoansResponse.ok) {
                    throw new Error('Something went wrong!');
                }

                const currentLoansResponseJson = await currentLoansResponse.json();
                setCurrentLoansCount(currentLoansResponseJson);
            }
            setIsLoadingCurrentLoans(false);
        }
        fetchUserCurrentLoans().catch((error) => {
            setHttpError(error.message);
            setIsLoadingCurrentLoans(false);
        });
    }, [authState, checkout]);

    // Checkout Effect

    useEffect(() => {
        const fetchCheckoutBook = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:9090/api/books/secure/checkedout/byuser?bookId=${bookId}`;

                const requestOptions = {
                    method: 'Get',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };

                const checkoutResponse = await fetch(url, requestOptions);

                if (!checkoutResponse.ok) {
                    throw new Error('Something went wrong!');
                }

                const checkoutResponseJson = await checkoutResponse.json();
                setCheckout(checkoutResponseJson);
            }
            setIsCheckingOutLoading(false);

        }
        fetchCheckoutBook().catch((error) => {
            setHttpError(error.message);
            setIsCheckingOutLoading(false);
        });
    }, [authState]);




    if (loading || isLoadingReviews || isLoadingCurrentLoans || isCheckingOutLoading) {
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

    async function checkoutBook() {
        const url = `http://localhost:9090/api/books/secure/checkout?bookId=${bookId}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        setCheckout(true);
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

                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount} 
                    isAuthenticated={authState?.isAuthenticated} isCheckedOut={checkout} checkoutBook={checkoutBook}/>

                </div>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />


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

                        <StarsReview rating={totalStars} size={32} />
                    </div>

                </div>
                <CheckoutAndReviewBox book={book} mobile={true} currentLoansCount={currentLoansCount}
                isAuthenticated={authState?.isAuthenticated} isCheckedOut={checkout} checkoutBook={checkoutBook} />
                <hr />

                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} /> n
            </div>
        </div>
    );
}