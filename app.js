import express from 'express';
import users from "./routes/users.js"
const app = express();
const PORT = 3000;

app.use( express.json() )
app.use("/api/users", users);


app.listen( PORT, function( req, res ) {
    console.log('Example app listening on port 3000!');
})