
export const errorsHndling=(err,req,res,next)=>{
    res.status(res.statusCode || 500).send(err.message || "התרחשה תקלה");

}