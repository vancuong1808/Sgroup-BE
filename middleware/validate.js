import express from "express"

const validate = {
    ValidateData : ( req, res, next ) => {
        try {
            const{ id, name, email } = req.body
            if( id != null ) {
                if( !id || id <= 0 ) {
                   res.send("ERROR ID");
                   return;
                }
            }
            if( !name ) {
                res.send("ERROR NAME");
                return;
            }
            if( !email ) {
                res.send("ERROR EMAIL");
                return; 
            }
            next();
        } catch (error) {
            res.send( error );
        }
    },
}

export default validate