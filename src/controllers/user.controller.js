import SuserService from '../services/user.service.js';


const getAllSusers = async( req, res ) => {
    try {
        const AllSusers = await SuserService.getAllSusers();
        res.status(200).json( AllSusers );
    }
    catch( error ) {
        res.status( 400 ).json( error );
    }
}

const getSuserByID = async( req, res ) => {
    try {
        const { id } = req.params;
        const Suser = await SuserService.getSuserByID( id );
        res.status(200).json( Suser );
    } catch (error) {
        res.status( 400 ).json( error );
    }
}

const createSuser = async( req, res ) => {
    try {
        const User = {
            username: req.body.username,
            email : req.body.email,
            password : req.body.password,
            fullName : req.body.fullName
        }
        const SuserId = await SuserService.createSuser( User );
        const Suser = await SuserService.getSuserByID( SuserId );
        res.status(200).json( Suser );
    } 
    catch( error ) {
        res.status( 400 ).json( error );
    }
}

const updateSuser = async( req, res ) => {
    try {
        const { id } = req.params
        const User = {
            username: req.body.username,
            email : req.body.email,
            fullName : req.body.fullName
        }
        const SuserId = await SuserService.updateSuser( id, User );
        const Suser = await SuserService.getSuserByID( SuserId );
        res.status( 200 ).json( Suser );
    }
    catch( error ) {
        res.status( 400 ).json( error );
    }
}

const deleteSuser = async( req, res ) => {
    try {
        const { id } = req.params;
        const Suser = await SuserService.deleteSuser( id );
        res.status( 200 ).json( Suser );
    } catch (error) {
        res.status( 400 ).json( error );
    }
}



export default {
    getAllSusers,
    getSuserByID,
    createSuser,
    updateSuser,
    deleteSuser
}