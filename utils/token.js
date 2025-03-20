import jwt from "jsonwebtoken";


/**
 * Generates a JWT token for a given user.
 * 
 * @param {Object} user - The user object containing `_id`, `userName`, and `role`.
 * @returns {string} The generated JWT tokens.
 */
export const generateToken=(user)=>{
    let token=jwt.sign(
        {_id:user._id,userName:user.userName,role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:"90m"}
    )
    return token;
}
