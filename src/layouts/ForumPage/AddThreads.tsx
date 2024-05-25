import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";




export const AddThreads = () => {

    const { authState } = useOktaAuth();
    const history = useHistory();

    const [title, setTitle] = useState('');
     // Displays
     const [displayWarning, setDisplayWarning] = useState(false);
     const [displaySuccess, setDisplaySuccess] = useState(false);
   

    async function handleSubmit () {
        const url = `${process.env.REACT_APP_API}/threads/secure/add`;
        if (authState?.isAuthenticated && title !== '') {

            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title})
            };

            const submitNewThreadResponse = await fetch(url, requestOptions);
            if (!submitNewThreadResponse.ok) {
                throw new Error('Something went wrong!');
            }
            setDisplaySuccess(true);
            setDisplayWarning(false);
            
            setTimeout(() => {
                history.push('/forum');
            }, 3000);
            
        


        }
        else{
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
       
        
    }


    return (
        <div className='container mt-5 mb-5'>
               {displaySuccess && 
                <div className='alert alert-success' role='alert'>
                    Thread added successfully
                </div>
            }
            {displayWarning && 
                <div className='alert alert-danger' role='alert'>
                    All fields must be filled out
                </div>
            }
            <h1 className=" text-center">Add Threads</h1>
            <form>
                <div className='col-md-4 mb-4 mt-5 '>
                    <label>Subjekt</label>
                    <input
                        type='text'
                        className='form-control mt-2'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <button
                    type='button'
                    className='btn btn-primary mt-4'
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </form>
        </div>

    );
}