import { useState } from "react";
import { Loans } from "./components/Loans";
import { HistoryPage } from "./components/HistoryPage";
import { useOktaAuth } from "@okta/okta-react";


export const ShelfPage = () => {

    const { authState } = useOktaAuth();

    const [historyClick, setHistoryClick] = useState(false);


    async function generatePdf(){
        const url = `${process.env.REACT_APP_API}/generatePdf`;
        const requestOptions = {
            method: 'GET',
            headers: { 
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/pdf' 
            }
        };
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error('Something went wrong!')
        }
        // show pdf 
        const blob = await response.blob();
        const urlPdf = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlPdf;
        a.target = '_blank';
        a.click();

    }


    return (
        <div className='container'>
            <div className='mt-3'>
                <nav>
                    <div className='nav nav-tabs' id='nav-tab' role='tablist'>
                        <button onClick={() => setHistoryClick(false)} className='nav-link active' id='nav-loans-tab' data-bs-toggle='tab'
                            data-bs-target='#nav-loans' type='button' role='tab' aria-controls='nav-loans'
                            aria-selected='true'>
                            Loans
                        </button>
                        <button onClick={() => setHistoryClick(true)} className='nav-link' id='nav-history-tab' data-bs-toggle='tab'
                            data-bs-target='#nav-history' type='button' role='tab' aria-controls='nav-history'
                            aria-selected='false'>
                            Your History
                        </button>

                        <button className="Btn" onClick={generatePdf}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 384 512"
                                className="svgIcon"
                            >
                                <path
                                    d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"
                                ></path>
                            </svg>
                            <span className="icon2"></span>
                        </button>


                    </div>
                </nav>
                <div className='tab-content' id='nav-tabContent'>
                    <div className='tab-pane fade show active' id='nav-loans' role='tabpanel'
                        aria-labelledby='nav-loans-tab'>
                        <Loans />
                    </div>
                    <div className='tab-pane fade' id='nav-history' role='tabpanel'
                        aria-labelledby='nav-history-tab'>
                        {historyClick ? <HistoryPage /> : <></>}

                    </div>
                </div>
            </div>
        </div>
    );
}