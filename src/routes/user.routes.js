import express from 'express';
import Controller from '../controllers/user.controller.js'

const router = express.Router();

router.get('/', Controller.getAllSusers );

router.get('/:id', Controller.getSuserByID);

router.post('/', Controller.createSuser);

router.put('/:id', Controller.updateSuser );

router.delete('/:id', Controller.deleteSuser );


export default router;