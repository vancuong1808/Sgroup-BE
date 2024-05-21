import express from 'express';
import data from './db.json' with { type: "json" };
import fs from 'fs';
const app = express();
const PORT = 3000;

app.use( express.json() )


function ValidateData( req, res, next ) {
    const{ id, name, description } = req.body
    if( !id || id <=0) {
        res.send("ERROR ID");
    }
    if( !name ) {
        res.send("ERROR NAME")
    }
    if( !description ) {
        res.send("ERROR DESCRIPTION")
    }
    next();
}

let ID;

if( data.User.length == 0 ) {
    ID = 0;
} else {
    ID = JSON.parse( data.User[data.User.length - 1].id );
}

app.post('/api/users/', ValidateData, function( req, res ) {
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

app.get('/api/users/:id', function( req, res ) {
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

app.get('/api/users/', function( req, res ) {
    res.send( data.User );
});

app.put('/api/users/:id', ValidateData, function( req, res ) {
    const { id } = parseInt( req.params );
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

app.delete('/api/users/:id', function( req, res ) {
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


app.listen( PORT, function( req, res ) {
    console.log('Example app listening on port 3000!');
})