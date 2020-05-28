//server.js for Lab 7

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jsonParser = bodyParser.json();
const uuid = require('uuid');

const Authenticate = require('./middleware/Authenticate');

const app = express();

app.use(Authenticate)

app.use(morgan('dev'));
//Can be sent as a bearer token or book-api-key header
//Or parameter: apiKey . middleware should authenticate
//if not sent, send back unauthorized response with 401

let bookmarks = [
    {
        id: uuid.v4(),
        title: "Google",
        description: "A useful search engine.",
        url: "http://www.google.com",
        rating: 3.5
    },
    {
        id: uuid.v4(),
        title: "Minesweeper Online",
        description: "A blast from the past",
        url: "minesweeperonline.com/",
        rating: 1
    }

];



app.get('/bookmarks', (req, res) => {
    //send back as a response all the existing bookmarks with 200 status

    return res.status(200).json(bookmarks);
});

app.get('/bookmark', (req, res) => {
    //validate that the title is passed in the querystring, else 406
    //validate that the title exists or 404 not found
    //On success, send back 200 status with array of bookmarks holding title (e.i. repeated)

    let foundMarks = [];

    if (!req.query.title) {
        res.statusMessage = "Please include 'title' in the parameters of your request.";
        return res.status(406).end();
    }
    //Collect all the bookmarks with the given name
    for (index in bookmarks) {
        if (bookmarks[index].title == req.query.title) {
            foundMarks.push(bookmarks[index]);
        }
    }

    //If we didn't find anything, throw a 404

    if (!foundMarks.length) {
        res.statusMessage = "No bookmark found with the given title";
        return res.status(404).end();
    }
    

    return res.status(200).json(foundMarks);
});

app.post("/bookmarks", jsonParser, (req, res) => {
    //send bookmark in body of request, all fields except id
    //auto generate uuid
    //validate that all fields are received. If not, 406
    //if success, respond 201 w/ new bookmark
    if (!(req.body.title && req.body.description && req.body.url && req.body.rating)) {
        res.statusMessage = "Not enough information. Please send necessary fields in the body of request.";
        return res.status(406).end();
    }
    else {
        let postMe = {
            id: uuid.v4(),
            title: `${req.body.title}`,
            description: req.body.description,
            url: req.body.url,
            rating: req.body.rating
        }
        bookmarks.push(postMe);
        return res.status(201).json(postMe);
    }

});

app.delete('/bookmark/:id', (req, res) => {

    let id = req.params.id;

    if (!id) {
        res.statusMessage = "No ID provided.";
        return res.status(404).end();
    }

    for (index in bookmarks) {
        if (bookmarks[index].id == id) {
            bookmarks.splice(index);
            return res.status(200).end();
        }
    }
    res.statusMessage = "ID not found.";
    return res.status(404).end();
    //validate that the id exists. If not, return 404
    //if successful, send back 200
});

app.patch('/bookmark/:id', jsonParser, (req, res) => {
    //send id in body; if missing return 406
    //validate id from body and path are same. else 409
    //pass object in body with updated content: can have 1 to 4 fields
    //send relevant message in response

    let id = req.params.id; 
    let id2 = req.body.id;

    res.statusMessage = "Changes: ";
    
    if (!id2) {
        res.statusMessage = "Please pass 'id' in body of request.";
        return res.status(406).end();
    }

    if (!id) {
        res.statusMessage = "Please enter 'id' in the url: /bookmark/${id}";
        return res.status(404).end();
    }

    if (id !== id2) {
        res.statusMessage = "Please enter same 'id' in url and body.";
        return res.status(409).end();
    }
    for (index in bookmarks) {
        if (bookmarks[index].id == id2) {
            if (req.body.title) {
                bookmarks[index].title = req.body.title;
                res.statusMesage += "Title ";
            }
            if (req.body.description) {
                bookmarks[index].description = req.body.description;
                res.statusMessage += "Description ";
            }
            if (req.body.url) {
                bookmarks[index].url = req.body.url;
                res.statusMessage += "URL ";
            }
            if (req.body.rating) {
                bookmarks[index].rating = req.body.rating;
                res.statusMessage += "Rating ";
            }

            return res.status(202).json(bookmarks[index]);
        }
    }

    
    res.statusMessage = "ID not found in server's bookmark array.";
    return res.status(404).end();

});



app.listen(8080, () => {
    console.log("This server is running on port 8080.");
});


//Get requests: http://localhost:8080/bookmarks
//Get requests by id: http://localhost:8080/bookmark?id=123
