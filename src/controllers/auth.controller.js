import authService from '../services/auth.service.js'
import userService from '../services/user.service.js'
import responseHandler from '../handlers/response.handler.js'

const RegisterUser = async( req, res, next ) => {
    try {
        const registerBody = {
            email : req.body.email,
            fullName : req.body.fullName,
            username: req.body.username,
            password : req.body.password,
        } 
        const registerUser = await authService.RegisterUser( registerBody );
        if ( !registerUser || registerUser?.affectedRows === 0 ) {
            return responseHandler.badRequest( res, "Register failed" );
        }
        return responseHandler.created( res, "Register successful", registerUser );
    } catch( error ) {
        next( error );
    }
}

const LoginUser = async( req, res, next ) => {
    try {
        const loginBody = {
            username : req.body.username,
            password : req.body.password 
        }
        const LoginUser = await authService.LoginUser( loginBody );
        if ( LoginUser.status === "success" ) {
            return responseHandler.ok( res, LoginUser.message, LoginUser.data );
        }
    } catch( error ) {
        if ( error.message === "User not found" || error.message === "Wrong password" ) {
            return responseHandler.unauthenticate( res, error.message );
        }
        next( error );
    }
}

const GetAllUsers = async( req, res, next ) => {
    try {
        const allUsers = await userService.GetAllUsers();
        if ( allUsers.length === 0 ) {
            return responseHandler.notFound( res, "No users found" );
        }
        return responseHandler.ok( res, "Get all users successful", allUsers );
    }
    catch( error ) {
        next( error );
    }

}

const ForgotPassword = async(req, res, next) => {
    try {
        const Email = req.body.email;
        const isExistEmail = await userService.CheckMailUser(Email);
        if (!isExistEmail) {
            return responseHandler.badRequest(res, "EMAIL NOT EXIST");
        }
        const result = await authService.SendMail(Email);
        if( !result || result?.affectedRows === 0 ) {
            return responseHandler.badRequest(res, "EMAIL NOT EXIST");
        }
        return responseHandler.ok( res, "Email has been send", result );
    } catch( error ) {
        next( error );
    }
}

const ResetPassword = async( req, res, next ) => {
    try {
        const NewPassword = {
            email: req.body.email,
            newpassword: req.body.newpassword,
            otp: req.body.otp
        };
        const IsOTPValid = await userService.checkOTP( NewPassword );
        if ( IsOTPValid.status === "expired" ) {
            return responseHandler.unauthenticate( res, "OTP EXPIRED" );
        }
        if ( IsOTPValid.status === "not expired" ) {
            const SetNewPassword = await authService.SetNewPassword( NewPassword );
            if ( !SetNewPassword || SetNewPassword?.affectedRows === 0 ) {
                return responseHandler.badRequest( res, "Reset password failed" );
            }
            return responseHandler.ok( res, "Reset password successful", SetNewPassword );
        } 
    } catch( error ) {
        if ( error.message === "EMAIL NOT EXIST" ) {
            return responseHandler.unauthenticate( res, "EMAIL NOT EXIST" );
        }
        next( error );
    }
}

const UploadSingle = ( req, res, next ) => {
    try {
        const file = req.file;
        if( !file ) {
            return responseHandler.badRequest( res, "File not found" );
        }
        const uploadSingle =  authService.UploadSingle( file );
        if ( uploadSingle.status === 'success' ) {
            return responseHandler.ok( res, "Upload file successful", uploadSingle.data );
        }
    } catch( error ) {
        next( error );
    }
}

const UploadMulti = ( req, res, next ) => {
    try {
        const files = req.files;
        if( !files ) {
            return responseHandler.badRequest( res, "File not found" );
        }
        const uploadMulti =  authService.UploadMulti( files );
        if ( uploadMulti.status === 'success' ) {
            return responseHandler.ok( res, "Upload files successful", uploadMulti.data );
        }
    } catch( error ) {
        next( error );
    }
}

export default { 
    RegisterUser,
    LoginUser,
    GetAllUsers,
    ForgotPassword,
    ResetPassword,
    UploadSingle,
    UploadMulti
}