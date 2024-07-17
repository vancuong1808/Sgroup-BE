import express from "express"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const ValidateToken = async( req, res, next ) => {
    try {
        // 
        // Lấy token từ header Authorization
        // const authHeader = req.headers.authorization;
        // // Kiểm tra xem authHeader có tồn tại và bắt đầu bằng "Bearer "
        // if (!authHeader || !authHeader.startsWith('Bearer ')) {
        //     return res.status(401).send("NO AUTHENTICATION");
        // }
        // // Tách Bearer và token
        // const token = authHeader.split(' ')[1];
        // // Xác thực token
        const token = req.headers?.token;
        console.log( token )
        if( token == null ) {
            return res.status( 400 ).send( "NO AUTHENTICATION ");
        } 
        jwt.verify( token, process.env.SECRET_KEY, ( error, decoded ) => {
            if( error ) {
                console.log( error )
                return res.status( 400 ).send( "ERROR TOKEN");
            }
            req.user = decoded;
            next();
        });
    } catch( error ) {
        console.log( error )
        return res.status( 400 ).send("ERROR VALIDATE " );
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
        console.log( error )
        return res.status( 400 ).json({ message : "ERROR VALIDATE"})
    }
}


export default {
    ValidateToken,
    ValidateForgotPassword
}