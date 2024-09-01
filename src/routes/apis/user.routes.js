import express from 'express';
import Controller from '../../controllers/user.controller.js'

const router = express.Router();

router.get('/', Controller.GetAllUsers );

router.get('/:id', Controller.GetUserByID );

router.post('/', Controller.CreateUser );

router.put('/:id', Controller.UpdateUser );

router.delete('/:id', Controller.DeleteUser );


export default router;