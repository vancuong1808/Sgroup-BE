import dotenv from 'dotenv';
import express from 'express';
import routes from './src/routes/index.routes.js'
import responseHandler from './src/handlers/response.handler.js';
dotenv.config();
const app = express();

app.use( express.json() );
app.use( "/api", routes );

<<<<<<< Updated upstream
// const excute = async() => {
//     const users = await UserService.getAllUsers();
//     console.log( users );
//     const UserName = "Doe";
//     const Password = "123";
//     const login = await LoginService.Login( UserName, Password );
//     console.log( login );
// }




app.use( express.json() )
app.use("/api/user", SuserRoute );
app.use("/api/auth", AuthSuserRoute );
app.use("/api", ApiVoteRoute );

=======
app.use( (error, req, res, next ) => {
    responseHandler.error(res, error);
});
>>>>>>> Stashed changes

app.listen( process.env.PORT || 3000 , function( req, res ) {
    console.log('Example app listening on port 3000!');
})