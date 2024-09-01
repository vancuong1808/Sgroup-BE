import database from "../config/database.js";
import { GetTimeNow } from "../Utils/date.utils.js";

const GetAllUsers = async() => {
    try {
        const allUsers = await database.query("SELECT id, username, email, fullName FROM users ");
        return allUsers[0];
    }
    catch( error ) {
        throw error;
    }
}

const GetUserByID = async( id ) => {
    try {
        const user = await database.query(`SELECT id, username, email, fullName FROM users WHERE id = ?`, [ id ]);
        return user[0];
    }
    catch( error ) {
        throw error;
    }
}

const CreateUser = async( User ) => {
    try {
        const user = await database.query('INSERT INTO users( username, email, password, fullName ) VALUES( ?, ?, ?, ? )', [ User.username, User.email, User.password, User.fullName ] );
        return user[0];
    }
    catch( error ) {
        throw error;
    }
}

const UpdateUser = async( id, User ) => {
    try {
        const user = await database.query('UPDATE users SET username = ?, email = ?, fullName = ? WHERE id = ?', [ User.username, User.email, User.fullName, id ]);
        return user;
    }
    catch( error ) {
        throw error;
    }
}

const DeleteUser = async( id ) => {
    try {
        const user = await database.query(`DELETE FROM users WHERE id = ? `, [ id ] );
        return user;
    }
    catch( error ) {
        throw error;
    }
}

const CheckOTP = async( NewPassword ) => {
    try {
        const isExistEmail = await database.query(`SELECT expire, otp FROM users WHERE email = ?`, [ NewPassword.email ]);
        if( isExistEmail[0].length === 0 ) {
            throw new Error("Email not Found")
        }
        if ( GetTimeNow() <= Number( otp[0][0].expire ) ) {
            return { status: 'expired', message: "Otp available", data: otp[0] };
        } else {
            return { status: 'not expired', message: "Otp not available", data: otp[0] };
        }
    } catch (error) {
        throw error;
    }
}


export default {
    GetAllUsers,
    GetUserByID,
    CreateUser,
    UpdateUser,
    DeleteUser,
    CheckOTP,
}