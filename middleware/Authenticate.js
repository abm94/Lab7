//Authenticate.js

const api_key = "2abbf7c3-245b-404f-9473-ade729ed4653";

function Authenticate(req,res,next) {

   
    //Check if they entered the wrong parameter
    if (req.query.apiKey) {

        console.log("Found the parameter");

        if (req.query.apiKey !== api_key) {
            res.statusMessage = "The parameter 'apiKey' is incorrect.";
            return res.status(401).end();
        }
    }

    let input = req.headers.authorization;
    //Check if they entered the wrong bearer token
    if (input) {
        if (input !== `Bearer ${api_key}`) {
            res.statusMessage = "The bearer token is incorrect.";
            return res.status(401).end();
        }
        
    }

    input = req.headers['book-api-key'];
    //Check if they entered the wrong passcode in headers
    if (input) {
        res.statusMessage = "The header value 'book-api-key' is incorrect.";
        return res.status(401).end();
    }

    //Make sure they sent something in one of those
    if (!(req.query.apiKey || req.headers.authorization || req.headers['book-api-key'])) {
        res.statusMessage = "No api key found. Try entering it as parameter 'apiKey' .";
        return res.status(401).end();
    }

    //If all conditions passed, user must have put correct passcode in at least one method
    next();
}


module.exports = Authenticate;