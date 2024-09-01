import multer from 'multer';
export const FileConfigs = () => {
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
        if( checktype ) {
            return callback( null, true );
        } else {
            console.log( checktype )
            return callback("ERROR Image not valid");
        }
    }
}
}