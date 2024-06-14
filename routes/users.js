import express from "express"
import data from "../db.json" with { type: "json" }
import fs from 'fs';
import validate from "../middleware/validate.js";
const router = express.Router();

let ID;
if( data.User.length == 0 ) {
    ID = 0;
} else {
    ID = JSON.parse( data.User[data.User.length - 1].id );
}

router.post('/', validate.ValidateData, function( req, res ) {
    const { name, description } = req.body;
    const newData = { id: ++ID, name: name, description: description }
    data.User.push( newData )
    fs.writeFile( 'db.json', JSON.stringify( data, null, 2 ), 'utf8', ( err ) => {
        if( err ) {
            res.send("ERROR WRITE FILE!");
        } else {
            res.send( newData );
        }
    } )
});

router.get('/:id', function( req, res ) {
    const { id } = req.params;
    const index = data.User.findIndex( function( items, index ) {
        return items.id === parseInt( id );
    } );
    if( index != - 1 ) {
        res.send( data.User[index] )
    } else {
        res.send( "NOT FOUND INDEX:" + index );
    }
});

router.get('/', function( req, res ) {
    res.send( data.User );
});

router.put('/:id', validate.ValidateData, function( req, res ) {
    const { id } = req.params;
    const { name, description } = req.body;
    const index = data.User.findIndex( function( items, index ) {
        return items.id === parseInt( id );
    } );
    if( index != - 1 ) {
        data.User[index].name = name;
        data.User[index].description = description;
        fs.writeFile( './db.json', JSON.stringify( data, null, 2 ), 'utf8', ( err ) => {
            if( err ) {
                res.send("ERROR WRITE FILE!");
            } else {
                res.send( "Data Updated!" )
            }
        } )
    } else {
        res.send( "NOT FOUND INDEX:" + index );
    }
})

router.delete('/:id', function( req, res ) {
    const { id } = req.params;
    const index = data.User.findIndex( function( items, index ) {
        return items.id === parseInt( id )
    });
    if( index != - 1 ) {
        ID = JSON.parse( data.User[data.User.length - 1].id );
        data.User.splice( index, 1 );
        fs.writeFile( './db.json', JSON.stringify( data, null, 2 ), 'utf8', ( err ) => {
            if( err ) {
                res.send("ERROR WRITE FILE!");
            } else {
                res.send("Data Deleted!");
            }
        })
    } else {
        res.send( "NOT FOUND INDEX:" );
    }

});

export default router;