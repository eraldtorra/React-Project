import { useEffect, useState } from "react";

import { SpinnerLoading } from "../Utils/SpinnerLoading";
import ForumMessagesModel from "../../models/ForumMessagesModel";
import { ForumMessages } from "./ForumMessages";




export const ForumMessagePage = () => {

    const [forumMessages, setForumMessages] = useState<ForumMessagesModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);



    const threadId = (window.location.pathname).split("/")[2];

    useEffect(() => {

        const fetchForum = async () => {

            const baseurl: string = `${process.env.REACT_APP_API}/threadses/${threadId}/messages`;


            const response = await fetch(baseurl);

            console.log("hello");

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.forumMessageses;


            const loadedForumMessages: ForumMessagesModel[] = [];

            for (const key in responseData) {
                loadedForumMessages.push(
                    new ForumMessagesModel(
                        responseData[key].id,
                        responseData[key].content,
                        responseData[key].postedBy,
                        responseData[key].datePosted
                    )
                );

                console.log(loadedForumMessages);
            }

            // sort loadedForumMessages by datePosted
            loadedForumMessages.sort((a, b) => {
                return new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime();
            });

            setForumMessages(loadedForumMessages);


            setLoading(false);

        }

        fetchForum().catch(error => {
            setHttpError(error.message);
            setLoading(false);
        });
        
    }, [threadId]);

    if (loading) {
        return (
            <SpinnerLoading />
        );
    }
    if (httpError) {
        return (
            <h5>{httpError}</h5>
        );
    }


    return (
        <div>
            <div className="container">

                <div>
                    <div>

                        <div className="mt-3">
                            <h2>Forum Messages</h2>
                        </div>
                        {forumMessages.length === 0?
                         <h5>No messages found</h5>
                            :
                        forumMessages.map(ForumMessage => (
                            <ForumMessages key={ForumMessage.id} forumMessage={ForumMessage} />
                        ))}
                    </div>
                </div>
            </div>

        </div>

    );
}