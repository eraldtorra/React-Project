import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import ProfileModel from "../../models/ProfileModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";



export const ProfilePage = () => {


    const { authState } = useOktaAuth();

    const [profile, setProfile] = useState<ProfileModel>();
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);


    useEffect(() => {

        const fetchProfile = async () => {

            const baseurl: string = `${process.env.REACT_APP_API}/profile/secure/get`;

            const requestOptions = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                }
            }

            const response = await fetch(baseurl, requestOptions);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseData = await response.json(); 

            let loadedProfile: ProfileModel;


            loadedProfile = new ProfileModel(
                responseData.firstName,
                responseData.lastName,
                responseData.email,
                responseData.username
            );
           

                console.log(loadedProfile);

            setProfile(loadedProfile);
            setLoading(false);
        };

        fetchProfile().catch(error => {
            setLoading(false);
            setHttpError(error.message);
        });

    }, [authState?.accessToken?.accessToken]);





    return(
        <div className=" container">
            <div className="mt-5">
                <h3>Profile</h3>
                {loading && <SpinnerLoading/>}
                {httpError && <p>{httpError}</p>}
                {profile && 
                    <div>
                        <p>First Name: {profile.firstName}</p>
                        <p>Last Name: {profile.lastName}</p>
                        <p>Email: {profile.email}</p>
                        <p>Username: {profile.userName}</p>
                    </div>
                }
            </div>

        </div>


    );
}