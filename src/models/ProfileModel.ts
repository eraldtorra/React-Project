


class ProfileModel

{

    firstName: string;
    lastName: string;
    email: string;
    userName: string;


    constructor(firstname: string, lastname: string, email: string, userName: string) {
        this.firstName = firstname;
        this.lastName = lastname;
        this.email = email;
        this.userName = userName;
    }
}

export default ProfileModel;