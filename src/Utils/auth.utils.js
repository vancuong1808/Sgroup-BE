import bcrypt, { genSalt } from 'bcrypt'
import multer from 'multer';

const HashedPassword = async( password ) => {
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash( password , saltRound );
    return hashedPassword;
}

const ComparePassword = async( password, hashpassword ) => {
    const compare = await bcrypt.compare( password, hashpassword )
    return compare;
}

const RandomOTP = () => {
    return Math.floor( 100000 + Math.random() * 900000 )
}
const FileConfigs = () => {
    return { 
    storage : multer.diskStorage({
        destination: function( req, file, callback ) {
            callback( null, './src/uploads/' )
        },
        filename: function( req, file, callback ) {
            callback( null, file.fieldname + '_' + file.originalname )
        },
    }),
    fileFilter: function( req, file, callback ) {
        const fileTypes = /image\/jpeg|application\/pdf|application\/json|image\/png|image\/gif|text\/plain/;
        const checktype = fileTypes.test( file.mimetype );
        console.log( file.mimetype )
        if( checktype ) {
            return callback( null, true );
        } else {
            console.log( checktype )
            return callback("ERROR Image not valid");
        }
    }
}
}

const GetCurrentDate = () => {
    const now = Date.now();
    const currentDate = new Date( now );
    return currentDate.toDateString();
}


export default {
    HashedPassword,
    ComparePassword,
    RandomOTP,
    FileConfigs,
    GetCurrentDate
}