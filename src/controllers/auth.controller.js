import AuthService from '../services/auth.service.js'
import SuserService from '../services/user.service.js'
import Utils from '../Utils/auth.utils.js'

const RegisterUser = async( req, res ) => {
    try {
        const registerBody = {
            email : req.body.email,
            username: req.body.username,
            password : req.body.password,
        } 
        console.log( registerBody)
        const registerUser = await AuthService.RegisterUser( registerBody );
        res.status(200).json( registerUser );
    } catch (error) {
        res.status(500).json("controllers error")
    }
}

const LoginUser = async( req, res ) => {
    try {
        const loginBody = {
            username : req.body.username,
            password : req.body.password 
        }
        const LoginUser = await AuthService.LoginUser( loginBody );
        res.status(200).json( LoginUser );
    } catch (error) {
        res.status( 400 ).json( error );
    }
}

const LoginADMIN = async( req, res ) => {
    const ADMIN = {
        username: req.body.username,
        password: req.body.password
    }
    const token = await AuthService.LoginADMIN( ADMIN );
    if( token ){
        res.send( token );
    }
    console.log( token );
    
}

const GetAllUsers = async( req, res ) => {
    try {
        const AllSusers = await SuserService.getAllSusers();
        res.status(200).json( AllSusers );
    }
    catch( error ) {
        res.status( 400 ).json( error );
    }

}

const ForgotPassword = async( req, res ) => {
    try {
        const Email = {
            email: req.body.email
        };
        const IsExistEmail = await SuserService.CheckMailUser( Email.email );
        if( !IsExistEmail ) {
            res.status( 400 ).json( { message: "EMAIL NOT EXIST" } );
        }
        const OTP = await AuthService.SendMail( Email.email );
        res.status( 200 ).json( OTP );
    }
    catch( error ) {
        res.status( 400 ).json( error );
    }
}

const ResetPassword = async( req, res ) => {
    try {
        const NewPassword = {
            email: req.body.email,
            newpassword: req.body.newpassword,
            otp: req.body.otp
        };
        const SetNewPassword = await AuthService.SetNewPassword( NewPassword );
        res.status( 200 ).json( SetNewPassword );
    } catch (error) {
        res.status( 400 ).json( error )
    }
}

const UploadSingle = ( req, res ) => {
    AuthService.UploadSingle( req, res )
}

const UploadMulti = ( req, res ) => {
    AuthService.UploadMulti( req, res )
}

export default { 
    RegisterUser,
    LoginUser,
    LoginADMIN,
    GetAllUsers,
    ForgotPassword,
    ResetPassword,
    UploadSingle,
    UploadMulti
}