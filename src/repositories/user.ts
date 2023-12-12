import CustomUserModel from "../database/model/customUser.model";

const signUp = async (email: string, username: string, password: string) => {

    const user = await CustomUserModel.findOne({where: {username: username}});
    if(user)
        return "User is already registered";
    
    return await CustomUserModel.create({
        email: email,
        username: username,
        password: password
    })
}

export { signUp };