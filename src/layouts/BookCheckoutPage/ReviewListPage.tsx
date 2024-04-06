import React, { useEffect, useState } from 'react';
import ReviewModel from '../../models/ReviewModel';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { Review } from '../Utils/Review';
import { Pagination } from '../Utils/Pagination';


export const ReviewListPage = () => {
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage, setReviewsPerPage] = useState(5);
    const [totalReviews, setTotalReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const bookId = (window.location.pathname).split("/")[2];

    useEffect(() => {
        const fetchReviews = async () => {
            const baseurl: string = `http://localhost:9090/api/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;

            const response = await fetch(baseurl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.reviews;

            setTotalReviews(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

            const loadedReviews: ReviewModel[] = [];

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    bookId: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription

                })
            }

            setReviews(loadedReviews);
            setLoading(false);
        };

        fetchReviews().catch((error) => {
            setHttpError(error.message);
            setLoading(false);
        });

    }, [currentPage]);

    if (loading){
        return(
           <SpinnerLoading />
        );
    }

    if (httpError){
        return(
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    const indexOfLastReview: number = currentPage * reviewsPerPage;
    const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;

    let lastItem = reviewsPerPage*currentPage <= totalReviews ? 
    reviewsPerPage*currentPage 
    : 
    totalReviews;

    const paginate = (pageNumber: number) =>  setCurrentPage(pageNumber);
    
    return(
        <div className='container m-5'>
            <div>
                <h3>Comments: ({reviews.length})</h3>
            </div>
            <p>
                {indexOfFirstReview + 1} to {lastItem} of {totalReviews} items:
            </p>
            <div className='row'>
                {reviews.map((review) => (
                    <Review key={review.id} review={review} />
                ))}

            </div>

            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}

        </div>

    );
}