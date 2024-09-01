import userService from '../services/user.service.js';
import responseHandler from '../handlers/response.handler.js';


const GetAllUsers = async( req, res, next ) => {
    try {
        const allUsers = await userService.GetAllUsers();
        if ( allUsers.length === 0 ) {
            return responseHandler.notFound( res, "No users found" );
        }
        return responseHandler.ok( res, "Get all users successful", allUsers );
    }
    catch( error ) {
        next( error );
    }
}

const GetUserByID = async( req, res, next ) => {
    try {
        const { id } = req.params;
        if ( id == null || id <= 0 ) {
            return responseHandler.badRequest( res, "Invalid ID" );
        }
        const user = await userService.GetUserByID( id );
        if ( user.length === 0 ) {
            return responseHandler.notFound( res, "User not found" );
        }
        return responseHandler.ok( res, "Get user by id successful", user );
    } catch( error ) {
        next( error );
    }
}

const CreateUser = async( req, res, next ) => {
    try {
        const userBody = {
            username: req.body.username,
            email : req.body.email,
            password : req.body.password,
            fullName : req.body.fullName
        }
        const user = await userService.CreateUser( userBody );
        if ( !user || user?.affectedRows === 0 ) {
            return responseHandler.badRequest( res, "Create user failed" );
        }
        return responseHandler.created( res, "Create user successful", user )
    } 
    catch( error ) {
        next( error );
    }
}

const UpdateUser = async( req, res, next ) => {
    try {
        const { id } = req.params
        if ( id == null || id <= 0 ) {
            return responseHandler.badRequest( res, "Invalid ID" );
        }
        const userBody = {
            username: req.body.username,
            email : req.body.email,
            fullName : req.body.fullName
        }
        const userId = await userService.UpdateUser( id, userBody );
        if ( !userId || userId?.affectedRows === 0 ) {
            return responseHandler.badRequest( res, "Update user failed" );
        }
        const user = await userService.GetUserByID( userId );
        if ( user.length === 0 ) {
            return responseHandler.notFound( res, "User not found" );
        }
        return responseHandler.ok( res, "Update user successful", user );
    }
    catch( error ) {
        next( error );
    }
}

const DeleteUser = async( req, res, next ) => {
    try {
        const { id } = req.params;
        if( id == null || id <= 0 ) {
            return responseHandler.badRequest( res, "Invalid ID" );
        }
        const user = await userService.DeleteUser( id );
        if ( !user || user?.affectedRows === 0 ) {
            return responseHandler.badRequest( res, "Delete user failed" );
        }
        return responseHandler.ok( res, "Delete user successful", user );
    } catch( error ) {
        next( error );
    }
}



export default {
    GetAllUsers,
    GetUserByID,
    CreateUser,
    UpdateUser,
    DeleteUser
}