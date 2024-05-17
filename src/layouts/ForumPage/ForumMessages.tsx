import ForumMessagesModel from "../../models/ForumMessagesModel";



export const ForumMessages: React.FC<{forumMessage: ForumMessagesModel}> = (props) => {


    const date = new Date(props.forumMessage.datePosted);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;



    return(
        <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
            <div className="row g-0">
                <div className="col-md-6">
                    <div className="card-body">
                        <h3 className="card-text">
                            {props.forumMessage.content}
                        </h3>
                        <h6>
                            {props.forumMessage.postedBy}
                        </h6>
                        <p className="card-text">
                            {formattedDate}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}