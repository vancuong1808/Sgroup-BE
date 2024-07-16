import express from 'express';
import SuserRoute from "./src/routes/user.routes.js";
import AuthSuserRoute from "./src/routes/auth.routes.js"
import ApiVoteRoute from "./src/routes/vote.routes.js"
import dotenv from 'dotenv'
dotenv.config();
const app = express();


// const excute = async() => {
//     const users = await UserService.getAllUsers();
//     console.log( users );
//     const UserName = "Doe";
//     const Password = "123";
//     const login = await LoginService.Login( UserName, Password );
//     console.log( login );
// }




app.use( express.json() )
app.use("/user", SuserRoute );
app.use("/auth", AuthSuserRoute );
app.use("/api", ApiVoteRoute )


app.listen( process.env.PORT || 3000 , function( req, res ) {
    console.log('Example app listening on port 3000!');
})

// excute();