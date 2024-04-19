import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import PaymentInfo from "../../models/PaymentInfo";


export const PaymentPage = () => {
    

    const {authState} = useOktaAuth();
    const [httpError, setHttpError] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [fees, setFees] = useState(0);
    const [loadingFees, setLoadingFees] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            if (authState && authState.isAuthenticated){
                const url = `${process.env.REACT_APP_API}/payments/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}`;
        
                const requestOptions ={
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                }
            };
            const paymentResponse = await fetch(url, requestOptions);
            if (!paymentResponse.ok){
               throw new Error('Failed to fetch payment information');
            }

            const paymentResponseJeison = await paymentResponse.json();

            setFees(paymentResponseJeison.amount);
            setLoadingFees(false);
        }
       }
         fetchFees().catch((error) => {
              setHttpError(error.message);
              setLoadingFees(false);
         });
    },[authState]);


    const elements = useElements();
    const stripe = useStripe();

    async function checkout(){
        if (!stripe || !elements || !elements.getElement(CardElement)){
            return;
        }
        setSubmitDisabled(true);

        let paymentInfo = new PaymentInfo(Math.round(fees * 100),'USD', authState?.accessToken?.claims.sub ?? '');
        
        const url = `${process.env.REACT_APP_API}/payment/secure/payment-intent`;
        const requestOptions ={
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentInfo)
        };

        const paymentResponse = await fetch(url, requestOptions);

        if (!paymentResponse.ok){
           setHttpError(false);
           setSubmitDisabled(false);
           throw new Error('Failed to create payment intent');
        }

        const stripeResponseJson = await paymentResponse.json();

        stripe.confirmCardPayment(
            stripeResponseJson.client_secret,{
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        email: authState?.accessToken?.claims.sub
                    }
                }
            },{handleActions: false}
        
        ).then(async function (result:any) {
            if (result.error){
               alert(result.error.message);
                setSubmitDisabled(false);
            }else{
               const url= `${process.env.REACT_APP_API}/payment/secure/payment-complete`;
               const requestOptions ={
                   method: 'PUT',
                   headers: {
                       Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                       'Content-Type': 'application/json',
                   }
               };

                const paymentCompleteResponse = await fetch(url, requestOptions);
                if (!paymentCompleteResponse.ok){
                    setHttpError(true);
                    setSubmitDisabled(false);
                    throw new Error('Failed to complete payment');
                
            }

            setFees(0);
            setSubmitDisabled(false);
        }
     
        });

        setHttpError(false);
    }


    if (loadingFees){
        return(
            <SpinnerLoading />
        )
    }

    if (httpError){
        return(
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    return(
        <div className="container">
            {fees > 0 && <div className="card mt-3">
                <h5 className="card-header">Fees pending: <span className="text-danger">${fees}</span></h5>
                <div className="card-body">
                    <h5 className="card-title mb-3">Credit Card</h5>
                    <CardElement id="card-element" />
                    <button onClick={checkout} className="btn btn-md main-color text-white mt-3" type="button" disabled={submitDisabled}>
                        Pay fees
                    </button>

                </div>

            </div>}
            {fees === 0 && 
            <div className="mt-3">
                <h5>You have no fees!</h5>
                <Link type="button" className="btn main-color text-white" to='search'>
                    Explore top books
                </Link>
            </div>
            }

            {submitDisabled && <SpinnerLoading />}

        </div>
    );

}