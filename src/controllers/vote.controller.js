import VoteService from '../services/vote.service.js';
import { GetCurrentDate } from '../Utils/date.utils.js';
import responseHandler from '../handlers/response.handler.js';

const CreatePolls = async( req, res, next ) => {
    try {
        const now = GetCurrentDate();
        const pollsBody = {
            userid: parseInt(req.user.userid),
            title: req.body.title,
            isLock: false,
            createdAt: `${now}`
        };
        const polls = await VoteService.CreatePolls( pollsBody);
        if ( polls.status === 'success') {
            return responseHandler.ok(res, polls.message, polls.data );
        } else {
            return responseHandler.badRequest( res, polls.message );
        }
    } catch( error ) {
        next( error );
    }
};

const LockPoll = async( req, res, next ) => {
    try {
        const PollID = req.params.id;
        const UserID = parseInt(req.user.userid);
        const result = await VoteService.LockPoll(PollID, UserID);

        if ( result.status === 'success' ) {
            return responseHandler.ok( res, result.message, result.data );
        } else {
            return responseHandler.badRequest( res, result.message );
        }
    } catch( error ) {
        next( error )
    }
};


const UnLockPoll = async( req, res, next ) => {
    try {
        const PollID = req.params.id;
        const UserID = parseInt(req.user.userid);
        const result = await VoteService.UnLockPoll(PollID, UserID);

        if ( result.status === 'success' ) {
            return responseHandler.ok( res, result.message, result.data );
        } else {
            return responseHandler.badRequest( res, result.message);
        }
    } catch( error ) {
        next( error )
    }
};


const DeletePoll = async( req, res, next ) => {
    try {
        const pollId = req.params.id;
        const userId = parseInt(req.user.userid);
        const result = await VoteService.DeletePoll(pollId, userId);

        if ( result.status === "success" ) {
            return responseHandler.ok( res, result.message, {} );
        } else {
            return responseHandler.badRequest( res, result.message );
        }
    } catch( error ) {
        next( error );
    }
}

const AddOption = async( req, res, next ) => {
    try {
        const now = GetCurrentDate();
        const optionBody = {
            pollid: req.body.pollid,
            option: req.body.option,
            createdAt: now
        };
        
        const result = await VoteService.AddOption(optionBody);

        if ( result.status === "success" ) {
            return responseHandler.ok( res, result.message, result.data );
        } else {
            return responseHandler.badRequest( res, result.message );
        }
    } catch (error) {
        next( error );
    }
}

const RemoveOption = async( req, res, next ) => {
    try {
        const optionId = req.params.id;
        const result = await VoteService.RemoveOption( optionId );

        if (result.status === "success") {
            return responseHandler.ok( res, result.message, {} );
        } else {
            return responseHandler.badRequest( res, result.message );
        }
    } catch( error ) {
        next( error );
    }
};

const Vote = async( req, res, next ) => {
    try {
        const voteBody = {
            userid: parseInt(req.user.userid),
            optionid: req.params.id
        };
        
        const result = await VoteService.Vote(voteBody);

        if (result.status === "success") {
            return responseHandler.ok(res, result.message);
        } else {
            return responseHandler.badRequest(res, result.message);
        }
    } catch( error ) {
        next( error );
    }
};


const UnVote = async( req, res, next ) => {
    try {
        const unVoteBody = {
            userid: parseInt(req.user.userid),
            optionid: req.params.id
        };

        const result = await VoteService.UnVote(unVoteBody);

        if (result.status === "success") {
            return responseHandler.ok( res, result.message );
        } else {
            return responseHandler.badRequest( res, result.message );
        }
    } catch( error ) {
        next( error )
    }
};


const GetUsersVoted = async( req, res, next ) => {
    try {
        const pollsID = req.params.id;
        const result = await VoteService.GetUsersVoted(pollsID);

        if (result.status === "success") {
            return responseHandler.ok( res, result.message, result.data );
        } else {
            return responseHandler.badRequest(res, result.message );
        }
    } catch( error ) {
        next( error )
    }
};


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