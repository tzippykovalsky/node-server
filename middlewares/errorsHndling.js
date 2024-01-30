
export const errorsHndling=(err,req,res,next)=>{
    console.log(err)
    res.status(res.statusCode || 500).send(err.message || "התרחשה תקלה");

}
