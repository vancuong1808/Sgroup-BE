import express from "express"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const ValidateToken = async( req, res, next ) => {
    try {
        const token = req.headers?.token
        console.log( token )
        if( token == null ) {
            res.status( 401 ).send( "NO AUTHENTICATION ");
        } else if (  !jwt.verify( token, process.env.SECRET_KEY ) ) {
            res.status( 401 ).send( "WRONG TOKEN" );
        }
        next();
    } catch( error ) {
        res.status( 400 ).send("ERROR VALIDATE ", error)
    }
}

const ValidateForgotPassword = async( req, res, next ) => {
    try {
        const ForgotPassword = {
            email: req.body.email,
            newpassword: req.body.newpassword,
            otp: req.body.otp
        }
        if( !ForgotPassword.newpassword ) {
            return res.status( 400 ).json( { message: "NEW PASSWORD IS NULL" } )
        } else if ( !ForgotPassword.email ) {
            return res.status( 400 ).json( { message: "EMAIL IS NULL" } )
        } else if ( !ForgotPassword.otp || ForgotPassword.otp < 6  ) {
            return res.status( 400 ).json({ message : "OTP IS NOT VALID"});
        }
        next();
    } catch (error) {
        return res.status( 400 ).json({ message : "ERROR VALIDATE", error })
    }
}

export default {
    ValidateToken,
    ValidateForgotPassword
}