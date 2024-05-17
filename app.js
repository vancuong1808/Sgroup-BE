import express from 'express';
import data from './db.json' with { type: "json" };
const app = express();
const PORT = 3000;

app.use( express.json() )



var cnt = 0;

app.post('/api/users/', function( req, res ) {
    const user = req.body;
    const newData = { id: ++cnt, name: user.name, description:user.description }
    data.User.push( newData )
    res.send( newData )
});

app.get('/api/users/:id', function( req, res ) {
    const _id = req.params.id;
    const index = data.User.findIndex( function( items, index ) {
        return items.id == _id;
    } );
    if( index != - 1 ) {
        res.send( data.User[index] )
    } else {
        res.send( "NOT FOUND :" + index );
    }
    //alo
});

app.get('/api/users/', function( req, res ) {
    res.send( data.User );
});

app.put('/api/users/:id', function( req, res ) {
    const _id = req.params.id;
    const { name, description } = req.body;
    const index = data.User.findIndex( function( items, index ) {
        return items.id == _id;
    } );
    if( index != - 1 ) {
        data.User[index].name = name;
        data.User[index].description = description;
        res.send("success!")
    } else {
        res.send( "NOT FOUND :" + index );
    }
})

app.delete('/api/users/:id', function( req, res ) {
    const _id = req.params.id;
    const index = data.User.findIndex( function( items, index ) {
        return items.id == _id
    });
    if( index != - 1 ) {
        data.User.splice( index, 1 );
        res.send("success!")
    } else {
        res.send( "NOT FOUND :" + index );
    }
});

app.listen( PORT, function( req, res ) {
    console.log('Example app listening on port 3000!');
})