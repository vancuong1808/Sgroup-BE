import database from '../config/database.js'
import SuserService from './user.service.js'
import Utils from '../Utils/auth.utils.js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const RegisterUser = async( registerBody ) => {
    try {
        const hashedPassword = await Utils.HashedPassword( registerBody.password );
        const User = await database.query( 'INSERT INTO users( email, username, password ) VALUES ( ?, ?, ? )', [ registerBody.email ,registerBody.username, hashedPassword ] );   
        if( User.length === 0 ) {
            console.log( User );
            return { message : "REGISTER FAIL" };
        }
        return User[0].insertId;
    } 
    catch( error ) {
        console.log(error)
        return { message : "ERROR REGISTER" };
    }
}

const LoginUser = async( loginBody ) => {
    try {
        const hash = await database.query( 'SELECT password FROM users WHERE username = ?', [loginBody.username] );
        console.log( hash[0][0].password );
        if( hash.length === 0 ) {
            console.log( hash[0][0].password );
            return { message : "ERROR HASHING" };
        }
        const CheckedPassword = await Utils.ComparePassword( loginBody.password, hash[0][0].password );
        console.log( CheckedPassword )
        if ( CheckedPassword ) {
            return { message : "LOGIN SUCCESS" };
        }
        else {
            return { message : "LOGIN FAIL" };
        }
    } catch (error) {
        console.log( error )
        return { message : "ERROR LOGIN" };
    }
}

const LoginADMIN = async( ADMIN ) => {
    if ( ADMIN.username != "ADMIN" && ADMIN.password != "ADMIN" ) {
        res.status( 401 ).json( "WRONG ADMIN" );
        return { message: "WRONG ADMIN" };
    }
    const token = jwt.sign( { username: "ADMIN" }, process.env.SECRET_KEY );
    return token;
}

const SendMail = async( Email ) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            }
        });
    const otp = Utils.RandomOTP();
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USERNAME,
            to: Email,
            subject: 'OTP',
            text: `Your OTP: ${otp}`
        });

    const time = new Date();
    const expireTime = time.setMinutes( time.getMinutes() + 5 )
    console.log( expireTime )
    const setOTP = {
        email: Email,
        otp: otp,
        expireTime: expireTime.toString()
    }
    const saveOTP = await SuserService.saveUserOTP( setOTP );
    console.log( saveOTP )
    return { message: "GET OTP SUCCESS " }

    } catch (error) {
        console.log( error )
        return { message: "GET OTP FAIL "}
    }
    
    } catch (error) {
        console.log( error )
        return { message : "ERROR GET OTP" };
    }

}

const SetNewPassword = async( NewPassword ) => {
    try {
        const IsExistEmailOTP = await SuserService.CheckMailOTP( NewPassword.email );
        if( !IsExistEmailOTP ) {
            return { message: "EMAIL NOT EXIST" };
        }
        const IsOTPValid = await SuserService.CheckOTP( NewPassword );
        if ( !IsOTPValid ) {
            return { message : "OTP INVALID OR EXPIRED" };
        }
        const hashedPassword = await Utils.HashedPassword( NewPassword.newpassword );
        const User = database.query(`UPDATE users SET password = ? WHERE email = ?`, [ hashedPassword, NewPassword.email ]);
        if( User.length === 0 ) {
            console.log( User );
            return { message : "SET NEW PASSWORD FAIL" };
        }
        return { message : "SET NEW PASSWORD SUCCESS" };
    } catch (error) {
        return { message : "ERROR NEW PASSWORD", error };
    }
}

export default {
    RegisterUser,
    LoginUser,
    LoginADMIN,
    SendMail,
    SetNewPassword
}