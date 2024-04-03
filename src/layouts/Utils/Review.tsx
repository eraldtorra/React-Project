import ReviewModel from "../../models/ReviewModel"
import { StarsReview } from "./StarsReview";

export const Review: React.FC<{review: ReviewModel}> = (props) => {
    const date = new Date(props.review.date);
    const longMonth = date.toLocaleString('default', { month: 'long' });
    const dateday = date.getDate();
    const dateYear = date.getFullYear();

    const dateRender = longMonth + " " + dateday + ", " + dateYear;
    
    return(
        <div>
        <div className="col-sm-8 col-md-8">
            <h5>{props.review.userEmail}</h5>
            <div className="row">
                <div className="col">
                    {dateRender}
                </div>
                <div className="col">
                        <StarsReview rating={props.review.rating} size={16}/>
                </div>

            </div>
            <div className="mt-2">
                <p>
                    {props.review.reviewDescription}
                </p>

            </div>

        </div>
        <hr/>
    </div>
    );
}