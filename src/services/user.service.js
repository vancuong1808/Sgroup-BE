import database from "../config/database.js";

const getAllSusers = async() => {
    try {
        const AllSusers = await database.query("SELECT id, username, email, fullName FROM users ");
        if( AllSusers[0].length === 0 ) {
            console.log( AllSusers );
            return { message : "ERROR ID" };
        } 
        return AllSusers[0];
    }
    catch( error ) {
        console.log( error );
        return;
    }
}

const getSuserByID = async( id ) => {
    try {
        if( id == null || id <= 0 ) {
            console.log("ERROR ID")
            return { message : "ERROR ID" };
        }
        const Suser = await database.query(`SELECT id, username, email, fullName FROM users WHERE id = ?`, [ id ]);
        if( Suser[0].length === 0 ) {
            console.log( Suser );
            return { message : "GET USER BY ID FAIL" };
        } 
        return Suser[0];
    }
    catch( error ) {
        console.log( error );
        return;
    }
}

const createSuser = async( User ) => {
    try {
        const Suser = await database.query('INSERT INTO users( username, email, password, fullName ) VALUES( ?, ?, ?, ? )', [ User.username, User.email, User.password, User.fullName ] );
        console.log( Suser )
        if( Suser[0].length === 0 ) {
            console.log( Suser );
            return { message : "CREATE USER FAIL" };
        } 
        console.log( Suser[0] );
        return Suser[0].insertId;
    }
    catch( error ) {
        console.log( error );
        return;
    }
}

const updateSuser = async( id, User ) => {
    try {
        if( id == null || id <= 0 ) {
            console.log("ERROR ID")
            return { message : "ERROR ID" };
        }
        const Suser = await database.query('UPDATE users SET username = ?, email = ?, fullName = ? WHERE id = ?', [ User.username, User.email, User.fullName, id ]);
        console.log( Suser )
        if( Suser[0].length === 0 ) {
            console.log( Suser );
            return { message : "UPDATE USER FAIL" };;
        } 
        return id;
    }
    catch( error ) {
        console.log( error );
        return;
    }
}

const deleteSuser = async( id ) => {
    try {
        if( id == null || id === 0 ) {
            console.log("ERROR ID")
            return { message : "ERROR ID" };
        }
        const Suser = await database.query(`DELETE FROM users WHERE id = ? `, [ id ] );
        if( Suser[0].length === 0 ) {
            console.log( Suser );
            return { message : "DELETE FAIL" };
        } 
        return { message : "USER SUCCESSFULLY DELETED" };
    }
    catch( error ) {
        console.log( error );
        return;
    }
}

const setUserOTP = async( setOTP ) => {
    try {
        const SuserOTP = await database.query(`INSERT INTO OTP( email, OTP, expire ) VALUES( ?, ?, ? )`, [ setOTP.email, setOTP.OTP, setOTP.expireTime ]);
        if( SuserOTP[0].length === 0 ) {
                console.log( SuserOTP );
                return false;
            } 
        return true;
    } catch (error) {
        console.log( "ERROR :", error );
        return false
    }
}

const CheckMailOTP = async( Email ) => {
    try { 
        const UserMail = await database.query( `SELECT * FROM OTP WHERE email = ?`, [ Email ]); 
        if( UserMail[0].length === 0 ) {
            console.log( UserMail );
            return false;
        }
        return true;
    } catch( error ) {
        console.log( "ERROR EMAIL OTP" );
        return false;
    }
}

const CheckMailUser = async( Email ) => {
    try { 
        const UserMail = await database.query( `SELECT * FROM users WHERE email = ?`, [ Email ]); 
        if( UserMail[0].length === 0 ) {
            console.log( UserMail );
            return false;
        }
        return true;
    } catch( error ) {
        console.log( "ERROR EMAIL USERS" );
        return false;
    }
}

const CheckOTP = async( NewPassword ) => {
    try {
        const time = new Date();
        const now = time.setMinutes( time.getMinutes() );
        const OTP = await database.query(`SELECT expire, otp FROM OTP WHERE email = ?`, [ NewPassword.email ]);
        if( OTP[0].length === 0 ) {
            console.log( expireTime, OTP );
            return false;
        }
        if ( now <= Number( OTP[0][0].expire ) && NewPassword.otp == OTP[0][0].otp  ) {
            console.log( "true", now, Number( OTP[0][0].expire ), OTP[0][0].otp  )
            return true;
        } else {
            console.log( "false", now, Number( OTP[0][0].expire ), OTP[0][0].otp  )
            return false;
        }
    } catch (error) {
        console.log( error );
        return false;
    }
}

const updateUserOTP = async( setOTP ) => {
    try {
        const SuserOTP = await database.query(`UPDATE OTP SET otp = ?, expire = ? WHERE email = ?`, [ setOTP.otp, setOTP.expireTime, setOTP.email ]);
        if( SuserOTP[0].length === 0 ) {
            console.log( SuserOTP );
            return false;
        } 
        return true;
    } catch (error) {
        console.log( "ERROR :", error );
        return false
    }
}

const saveUserOTP = async( setOTP ) => {
    console.log( setOTP )
    try {
        const IsExistEmail = await database.query( `SELECT * FROM OTP WHERE email = ?`, [ setOTP.email ]); 
        if( IsExistEmail[0].length === 0 ) {
            console.log( IsExistEmail )
            const saveOTP = await setUserOTP( setOTP );
            if( saveOTP ) {
                return { message : "SAVE OTP SUCCESS" };
            }
        }
        const saveOTP = await updateUserOTP( setOTP );
        if( saveOTP ) {
            return { message : "SAVE OTP SUCCESS" };
        }

    } catch (error) {
        return { message : "OTP ERROR", error };
    }
}


export default {
    getAllSusers,
    getSuserByID,
    createSuser,
    updateSuser,
    deleteSuser,
    CheckMailUser,
    CheckMailOTP,
    CheckOTP,
    saveUserOTP
}