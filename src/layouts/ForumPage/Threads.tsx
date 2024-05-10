import React from "react";
import ThredModel from "../../models/ThreadModel";



export const Threads: React.FC<{thread: ThredModel}> = (props) => {
    
    return(

        <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
          <div className="row g-0">
            <div className="col-md-6">
                <div className="card-body">
                    <h5 className="card-title">
                        {props.thread.title}
                    </h5>
                    <h4>
                        {props.thread.creator}
                    </h4>
                    <p className="card-text">
                        {props.thread.date}
                    </p>

                </div>

            </div>
            <div className="col-md-4 d-flex justify-content-center align-items-center">
                {/* <Link to={`/checkout/${props.book.id}`} className="btn btn-md main-color text-white">
                    View Details
                </Link> */}

            </div>
        </div>

     </div>

    );
}