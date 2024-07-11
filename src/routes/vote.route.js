import express from 'express'
import VoteApiController from '../controllers/vote.controller.js'

const router = express.Router();


router.post('/create-poll', VoteApiController.CreatePolls );

router.put('/lock-poll/:id', VoteApiController.LockPoll );

router.put('/unlock-poll/:id', VoteApiController.UnLockPoll );

router.delete('/delete-poll/:id', VoteApiController.DeletePoll );

router.post('/add-vote', VoteApiController.AddOption );

router.delete('/remove-vote/:id', VoteApiController.RemoveOption ); 

router.put('/vote', VoteApiController.Vote );

router.put('/unvote', VoteApiController.UnVote );

router.get('/get-users-voted/:id', VoteApiController.GetUsersVoted );

export default router