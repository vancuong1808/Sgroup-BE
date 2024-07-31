import VoteService from '../services/vote.service.js';
import AuthUtils from '../Utils/auth.utils.js';

const CreatePolls = async( req, res ) => {
    try {
        const now = AuthUtils.GetCurrentDate();
        console.log( now )
        const PollsBody = {
            userid: parseInt( req.user.userid ),
            title: req.body.title,
            isLock: false,
            createdAt: `${now}`
        }
        const Polls = await VoteService.CreatePolls( PollsBody );
        res.status( 200 ).json( Polls );
    } catch (error) {
        res.status( 400 ).json( error );
    }

}

const LockPoll = async( req, res ) => {
    try {
        const PollID = req.params.id;
        const User = {
            userid: parseInt( req.user.userid )
        }
        const LockPoll = await VoteService.LockPoll( PollID, User.userid );
        res.status( 200 ).json( LockPoll );
    } catch (error) {
        res.status( 400 ).json( error );
    }
}

const UnLockPoll = async( req, res ) => {
    try {
        const PollID = req.params.id;
        const User = {
            userid: parseInt( req.user.userid )
        }
        const UnLockPoll = await VoteService.UnLockPoll( PollID, User.userid );
        res.status( 200 ).json( UnLockPoll );
    } catch (error) {
        res.status( 400 ).json( error );
    }
}

const DeletePoll = async( req, res ) => {
    try {
        const PollID = req.params.id;
        const UserID = parseInt( req.user.userid );
        const DeletePoll = await VoteService.DeletePoll( PollID, UserID );
        res.status( 200 ).json( DeletePoll );
    } catch( error ) {
        res.status( 400 ).json( error )
    }
}


const AddOption = async( req, res ) => {
    try {
        const now = AuthUtils.GetCurrentDate();
        const OptionBody = {
            pollid: req.body.pollid,
            option: req.body.option,
            createdAt: now
        }
        const Option = await VoteService.AddOption( OptionBody );
        res.status( 200 ).json( Option );
    } catch (error) {
        res.status( 400 ).json( error );
    }
}

const RemoveOption = async( req, res ) => {
    try {
        const OptionID = req.params.id;
        const RemoveOption = await VoteService.RemoveOption( OptionID );
        res.status( 200 ).json( RemoveOption );
    } catch (error) {
        res.status( 400 ).json( error );
    }
}

const Vote = async( req, res ) => {
    try {
        const VoteBody = {
            userid: parseInt( req.user.userid ),
            optionid : req.body.optionid
        }
        const Vote = await VoteService.Vote( VoteBody );
        res.status( 200 ).json( Vote );
    } catch( error ) {
        res.status( 400 ).json( error );
    }
}

const UnVote = async( req, res ) => {
    try {
        const UnVoteBody = {
            userid: parseInt( req.user.userid ),
            optionid : req.body.optionid
        }
        const UnVote = await VoteService.UnVote( UnVoteBody );
        res.status( 200 ).json( UnVote );
    } catch( error ) {
        res.status( 400 ).json( error );
    }
}

const GetUsersVoted = async( req, res ) => {
    try {
        const PollsID = req.params.id;
        const UsersVoted = await VoteService.GetUsersVoted( PollsID );
        res.status( 200 ).json( UsersVoted );
    } catch (error) {
        res.status( 400 ).json( error );
    }
}

export default {
    CreatePolls,
    AddOption,
    LockPoll,
    UnLockPoll,
    DeletePoll,
    RemoveOption,
    Vote,
    UnVote,
    GetUsersVoted
}