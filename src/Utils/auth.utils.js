import bcrypt, { genSalt } from 'bcrypt'

export const HashedPassword = async( password ) => {
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash( password , saltRound );
    return hashedPassword;
}

export const ComparePassword = async( password, hashpassword ) => {
    const compare = await bcrypt.compare( password, hashpassword )
    return compare;
}
