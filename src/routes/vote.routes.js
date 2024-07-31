import express from 'express'
import VoteApiController from '../controllers/vote.controller.js'
import AuthMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();


router.post('/create-poll', AuthMiddleware.ValidateToken, VoteApiController.CreatePolls );

router.put('/lock-poll/:id', AuthMiddleware.ValidateToken, VoteApiController.LockPoll );

router.put('/unlock-poll/:id', AuthMiddleware.ValidateToken, VoteApiController.UnLockPoll );

router.delete('/delete-poll/:id', AuthMiddleware.ValidateToken, VoteApiController.DeletePoll );

router.post('/add-vote', VoteApiController.AddOption );

router.delete('/remove-vote/:id', VoteApiController.RemoveOption ); 

router.put('/vote', AuthMiddleware.ValidateToken, VoteApiController.Vote );

router.put('/unvote', AuthMiddleware.ValidateToken, VoteApiController.UnVote );

router.get('/get-users-voted/:id', VoteApiController.GetUsersVoted );

export default router