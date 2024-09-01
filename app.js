import dotenv from 'dotenv';
import express from 'express';
import routes from './src/routes/index.routes.js'
import responseHandler from './src/handlers/response.handler.js';
dotenv.config();
const app = express();
app.use( express.json() )
app.use("/api/user", SuserRoute );
app.use("/api/auth", AuthSuserRoute );
app.use("/api", ApiVoteRoute );

app.use( (error, req, res, next ) => {
    responseHandler.error(res, error);
});

app.listen( process.env.PORT || 3000 , function( req, res ) {
    console.log('Example app listening on port 3000!');
})