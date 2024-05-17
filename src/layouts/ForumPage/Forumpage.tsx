import { useEffect, useState } from "react";
import ThreadModel from "../../models/ThreadModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { Pagination } from "../Utils/Pagination";
import { Threads } from "./Threads";
import { useOktaAuth } from "@okta/okta-react";


export const ForumPage = () => {

    const { authState } = useOktaAuth();

    const [threads, setThreads] = useState<ThreadModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [threadsPerPage] = useState(5);
    const [totalThreads, setTotalThreads] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {

        const fetchThreads = async () => {

            const baseurl: string = `${process.env.REACT_APP_API}/threadses`;

            let url: string = '';

            url = `${baseurl}?page=${currentPage - 1}&size=${threadsPerPage}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.threadses;

            setTotalThreads(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

            const loadedThreads: ThreadModel[] = [];

           

            for (const key in responseData) {
                loadedThreads.push(
                    new ThreadModel(
                        responseData[key].id,
                        responseData[key].date,
                        responseData[key].title,
                        responseData[key].creator
                    )
                );

                console.log(loadedThreads);
            }

            setThreads(loadedThreads);
            setLoading(false);

        }

        fetchThreads().catch(error => {
            setHttpError(error.message);
            setLoading(false);
        });
        window.scrollTo(0, 0);
    }, [currentPage, threadsPerPage]);

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

   

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);



    return (
        <div>
            <div className="container">
                <div>

                    {/*sent to center */}

                    <h1 className="mt-3 ">
                        Forum
                    </h1>
                    {authState?.isAuthenticated &&
                    <div className="d-flex justify-content-end">
                    <a href="/add-thread" className="btn btn-md main-color text-white">
                        Add Thread
                    </a>
                </div>
                }
                <div>
                
                            

                            {threads.map(thread =>(
                                <Threads key={thread.id} thread={thread} />
                            ))}

                        </div>


                    {totalPages > 1 &&
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                    }

                </div>
            </div>

        </div>

    );
}