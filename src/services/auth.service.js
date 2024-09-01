import database from '../config/database.js'
import { HashedPassword, ComparePassword } from '../Utils/auth.utils.js'
import { RandomOTP, GetExpiredOtp } from '../Utils/otp.utils.js'
import { Transporter } from '../config/emailConfig.js'
import { FileConfigs } from '../config/fileConfig.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const RegisterUser = async( registerBody ) => {
    try {
        const hashedPassword = await HashedPassword( registerBody.password );
        const User = await database.query( 'INSERT INTO users( email, fullName, username, password ) VALUES ( ?,?, ?, ? )', [ registerBody.email, registerBody.fullName ,registerBody.username, hashedPassword ] );   
        return User[0];
    } 
    catch( error ) {
        throw error;
    }
}

const LoginUser = async( loginBody ) => {
    try {
        const result = await database.query( 'SELECT id, password FROM users WHERE username = ?', [ loginBody.username ] );
        if( result[0].length === 0 ) {
            throw new Error("User not found")
        }
        const checkedPassword = await ComparePassword( loginBody.password, result[0][0].password );
        if ( !checkedPassword ) {
            throw new Error("Wrong password")
        }
        const token = jwt.sign( { userid: `${result[0][0].id}` }, process.env.SECRET_KEY );
        return { status: 'success', message: "Login successful", data: { token } };
    } catch( error ) {
        throw error;
    }
}

const SendMail = async(Email) => {
    try {
        const otp = RandomOTP();

        await Transporter.sendMail({
            from: process.env.SMTP_USERNAME,
            to: Email,
            subject: 'OTP',
            text: `Your OTP: ${otp}`
        });

        const setOTP = {
            email: Email,
            otp: otp,
            expireTime: GetExpiredOtp().toString()
        };

        const isExistEmail = await database.query(`SELECT * FROM users WHERE email = ?`, [setOTP.email]);

        if (isExistEmail[0].length === 0) {
            const setNewOtp = await database.query(`INSERT INTO users (otp, expire) VALUES ( ?, ?)`, [setOTP.email, setOTP.otp, setOTP.expireTime]);
            return setNewOtp[0];
        } else {
            const updateToOldOtp = await database.query(`UPDATE users SET otp = ?, expire = ? WHERE email = ?`, [setOTP.otp, setOTP.expireTime, setOTP.email]);
            return updateToOldOtp[0];

        }
    } catch (error) {
        throw error;
    }
}

const SetNewPassword = async( NewPassword ) => {
    try {
        const hashedPassword = await HashedPassword( NewPassword.newpassword );
        const user = database.query(`UPDATE users SET password = ? WHERE email = ?`, [ hashedPassword, NewPassword.email ]);
        return user[0];
    } catch (error) {
        throw error;
    }
}

const UploadSingle = ( file ) => {
    const upload = multer({ storage: FileConfigs().storage, fileFilter: FileConfigs().fileFilter }).single('file')
    upload( (error) => {
        if( error ) {
            throw error;
        }
        return { status: 'success', message: "Upload successful", data: file }
    })
}

const UploadMulti = ( files ) => {
    const upload = multer({ storage: FileConfigs().storage, fileFilter: FileConfigs().fileFilter } ).array('file', 10)
    upload( ( error ) => {
        if( error ) {
            throw error;
        }
        return { status: 'success', message: "Upload successful", data: files }
    })
}
export default {
    RegisterUser,
    LoginUser,
    SendMail,
    SetNewPassword,
    UploadSingle,
    UploadMulti
}