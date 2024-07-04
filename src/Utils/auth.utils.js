import bcrypt, { genSalt } from 'bcrypt'

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

export default {
    HashedPassword,
    ComparePassword,
    RandomOTP
}