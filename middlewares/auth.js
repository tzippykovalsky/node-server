import jwt from "jsonwebtoken"



export const authAdmin = (req, res, next) => {
    try {
        let token = req.headers["access-token"];
        if (!token)
            return res.status(403).send("missing token please sign in first");
        let user=jwt.verify(token, process.env.JWT_SECRET);
        if(user.role==2){
            req.myUser = user;
            next();
        }
        else
            return res.status(403).send("You are not allowed to access this action")
    }
    catch (err) {
        res.status(401).send("this token is not authorized")
    }
}


export const auth = (req, res, next) => {
    try {
        let token = req.headers["access-token"];//key-כשאכניס את הטוקן זה יהיה ה
        if (!token)
            return res.status(403).send("missing token please sign in first");
        req.myUser = jwt.verify(token, process.env.JWT_SECRET);//myUser הוא מפענח את הטוקן ומכניס את הפרטים שפוענחו לשדה 
        // ועד שהוא יגמור בקשה זו אני אוכל לשלוף משם נתונים על המשתמש שלי
        next();
    }
    catch (err) {
        res.status(401).send("this token is not authorized")
    }
}

