import { query } from "express";
import database from "../config/database.js";

const CreatePolls = async( PollsBody ) => {
    try {
    const isExistUser = await database.query(`SELECT * FROM users WHERE id = ?`, [PollsBody.userid]);
    if( isExistUser[0].length === 0 ) {
        console.log( " not exist userid", isExistUser );
        return { message: "NOT EXIST USERID" };
    }
    const isExistPolls = await database.query(`SELECT * FROM polls WHERE title IS NOT NULL AND title = ?`, [PollsBody.title]);
    if( isExistPolls[0].length !== 0 ) {
        console.log( " exist title", isExistPolls[0] );
        return { message: "EXIST POLLS" };
    }
    const Polls = await database.query(`INSERT INTO polls( userid ,title, isLock, createdAt ) VALUES( ?, ?, ?, ? )`, [ PollsBody.userid, PollsBody.title, PollsBody.isLock, PollsBody.createdAt ]);
    if( Polls[0]?.affectedRows === 0 ) {
        console.log( Polls[0] );
        return { message : "CREATE POLLS FAIL", status: false  };
    } 
    return { message: "CREATE POLLS SUCCESS", PollsID : Polls[0]?.insertId, status: true  };   
    }
    catch( error ) {
        console.log( error );
        return { message: "ERROR CREATE POLLS", status: false };
    }
}   

const LockPoll = async( PollID, UserID ) => {
    try {
        const isExistPolls = await database.query(`SELECT * FROM polls WHERE id = ?`, [PollID]);
        if( isExistPolls[0].length === 0 ) {
            console.log( "not exist title", isExistPolls[0] );
            return { message: "NOT EXIST POLLS" };
        }

        const isExistUser = await database.query(`SELECT * FROM users WHERE id = ?`, [UserID]);
        if( isExistUser[0].length === 0 ) {
            console.log( " not exist userid", isExistUser );
            return { message: "NOT EXIST USERID" };
        }

        if( isExistPolls[0][0].userid !== UserID ) {
            console.log( "NOT CREATOR")
            return { message: "NOT CREATOR", status: false };
        }

        const isLock = isExistPolls[0][0].isLock;
        if( isLock ) {
            console.log( "POLL IS ALREADY LOCK" );
            return { message : "POLL IS ALREADY LOCK", status: false  };
        }

        const Polls = await database.query(`UPDATE polls SET isLock = 1 WHERE id = ?`, [ PollID ]);
        if( Polls[0]?.affectedRows === 0 ) {
            console.log( Polls[0] );
            return { message : "POLLS LOCK IS FAIL", status: false  };
        } 
        console.log( Polls[0] );
        return { message: "POLLS IS LOCK SUCCESS", PollID : PollID, status: true  };

    } catch (error) {
        console.log( error )
        return { message : "LOCK ERROR", status: false  };
    }
}

const UnLockPoll = async( PollID, UserID ) => {
    try {
        const isExistPolls = await database.query(`SELECT * FROM polls WHERE id = ?`, [PollID]);
        if( isExistPolls[0].length === 0 ) {
            console.log( "not exist title", isExistPolls[0] );
            return { message: "NOT EXIST POLLS" };
        }

        const isExistUser = await database.query(`SELECT * FROM users WHERE id = ?`, [UserID]);
        if( isExistUser[0].length === 0 ) {
            console.log( " not exist userid", isExistUser );
            return { message: "NOT EXIST USERID" };
        }

        if( isExistPolls[0][0].userid !== UserID ) {
            console.log( "NOT CREATOR")
            return { message: "NOT CREATOR", status: false };
        }

        const isLock = isExistPolls[0][0].isLock;
        if( !isLock ) {
            console.log( "POLL IS ALREADY UNLOCK" );
            return { message : "POLL IS ALREADY UNLOCK", status: false  };
        }

        const Polls = await database.query(`UPDATE polls SET isLock = 0 WHERE id = ?`, [ PollID ]);
        if( Polls[0]?.affectedRows === 0 ) {
            console.log( Polls[0] );
            return { message : "POLLS LOCK IS FAIL", status: false  };
        } 
        console.log( Polls[0] );
        return { message: "POLLS IS UNLOCK SUCCESS", PollID : PollID, status: true  };

    } catch (error) {
        console.log( error )
        return { message : "UNLOCK ERROR", status: false  };
    }
}

const DeletePoll = async( PollID, UserID ) => {
    try {
        const isExistPolls = await database.query(`SELECT * FROM polls WHERE id = ?`, [PollID]);
        if( isExistPolls[0].length === 0 ) {
            console.log( " not exist pollID", isExistPolls );
            return { message: "NOT EXIST POLLSID"  };
        }

        const isExistUser = await database.query(`SELECT * FROM users WHERE id = ?`, [UserID]);
        if( isExistUser[0].length === 0 ) {
            console.log( " not exist userid", isExistUser );
            return { message: "NOT EXIST USERID" };
        }

        if( isExistPolls[0][0].userid !== UserID ) {
            console.log( "NOT CREATOR", UserID, isExistPolls[0][0].userid )
            return { message: "NOT CREATOR", status: false };
        }

        const isExistOption = await database.query(`SELECT * FROM options WHERE pollID = ?`, [ PollID ]);
        if( isExistOption[0].length !== 0 ) {
            const isExistUserOption = await database.query(`SELECT * FROM submition WHERE optionID = ?`, [ isExistOption[0][0].ID ]);
            if( isExistUserOption[0].length !== 0 ) {
                console.log( isExistUserOption )
                const RemoveUserOption = await database.query(`DELETE FROM submition WHERE optionID = ?`, [ isExistOption[0][0].ID ]);
                console.log( RemoveUserOption );
                if( RemoveUserOption[0]?.affectedRows === 0 ) {
                    console.log( "not have any vote", RemoveUserOption );
                    return { message: "DELETE SUBMITION FAIL", status: false }
                }
            }
            const RemoveOption = await database.query(`DELETE FROM options WHERE pollID = ?`, [ PollID ]);
            if( RemoveOption[0]?.affectedRows === 0 ) {
                console.log( "not have any option", RemoveOption );
                return { message: "DELETE OPTION FAIL", status: false }
            }
        }

        const DeletePoll = await database.query(`DELETE FROM polls WHERE id = ?`, [ PollID ]);
        if( DeletePoll[0]?.affectedRows === 0 ) {
            console.log( DeletePoll[0] );
            return { message : "DELETE POLLS FAIL", status: false  };
        }

        console.log( DeletePoll[0], RemoveOption[0] );
        return { message: "DELETE POLLS SUCCESS", status: true  };
    } catch (error) {
        console.log( error )
        return { message : "DELETE ERROR", status: false  };
    }
}

const AddOption = async( OptionBody ) => {
    try {
        const isExistPolls = await database.query(`SELECT * FROM polls WHERE id = ?`, [OptionBody.pollid]);
        if( isExistPolls[0].length === 0 ) {
            console.log( " not exist POLLSID", isExistPolls );
            return { message: "NOT EXIST POLLSID", status: false  };
        }

        const isPollsLock = isExistPolls[0][0].isLock
        if( isPollsLock ) {
            console.log( "POLLS IS LOCK", isPollsLock );
            return { message: "POLLS IS LOCK" };
        }

        const isOptionTitleNull = OptionBody.option;
        if ( isOptionTitleNull === "" ) {
            console.log( "OPTION IS EMPTY", isOptionTitleNull );
            return { message: "OPTION IS EMPTY" };
        }

        const isOptionExist = await database.query(`SELECT * FROM options WHERE pollID = ? AND title = ?`, [OptionBody.pollid, OptionBody.option]);
        if( isOptionExist[0].length !== 0 ) {
            console.log( "OPTION IS EXIST", isOptionExist);
            return { message: "OPTION IS EXIST" };
        }

        const Option = await database.query(`INSERT INTO options( pollID, title, createdAt ) VALUES(?,?,?)`, [ OptionBody.pollid, OptionBody.option, OptionBody.createdAt ]);
        console.log( Option[0]?.affectedRows );
        if( Option[0]?.affectedRows === 0 ) {
            console.log( Option );
            return { message : "ADD OPTION FAIL", status: false  };
        } 
        // console.log( isExistPolls[0], isPollsLock, isOptionTitleNull[0], isOptionExist[0], Option[0].length );
        console.log( Option[0]?.insertId )
        return { message: "ADD OPTION SUCCESS", OptionID: Option[0]?.insertId, status: true  };   
    } catch (error) {
        console.log( error )
        return { message: "ERROR ADD OPTION ", status: false  };
    }
}

const RemoveOption = async( OptionID ) => {
    try {
        const isExistOption = await database.query(`SELECT * FROM options WHERE ID = ?`, [OptionID]);
        if( isExistOption[0].length === 0  ) {
            console.log( "not exist option", isExistOption );
            return { message: "NOT EXIST OPTION ID"}
        }

        const isExistPolls = await database.query(`SELECT * FROM polls WHERE id = ?`, [ isExistOption[0][0].pollID ]);
        if( isExistPolls[0].length === 0 ) {
            console.log( " not exist POLLSID", isExistPolls );
            return { message: "NOT EXIST POLLSID", status: false  };
        }
        const isPollsLock = isExistPolls[0][0].isLock
        if( isPollsLock ) {
            console.log( "POLLS IS LOCK", isPollsLock );
            return { message: "POLLS IS LOCK" };
        }

        const isExistUserOption = await database.query(`SELECT * FROM submition WHERE optionID = ?`, [OptionID]);
        if( isExistUserOption[0].length !== 0 ) {
            console.log( isExistUserOption )
            const RemoveUserOption = await database.query(`DELETE FROM submition WHERE optionID = ?`, [OptionID]);
            console.log( RemoveUserOption );
            if( RemoveUserOption.affectedRows === 0 ) {
                console.log( "not have any vote", RemoveUserOption );
                return { message: "DELETE SUBMITION FAIL", status: false }
            }
        }

        const RemoveOption = await database.query(`DELETE FROM options WHERE ID = ?`, [OptionID]);
        if( RemoveOption[0]?.affectedRows === 0 ) {
            console.log( "not have any option", RemoveOption );
            return { message: "DELETE OPTION FAIL", status: false }
        }

        console.log( isExistOption, isExistUserOption ,RemoveOption );
        return { message: "DELETE OPTION SUCCESS", status: true }
    } catch (error) {
        console.log( error )
        return { message: "ERROR REMOVE OPTION" , status: false };
    }
}

const Vote = async( VoteBody ) => {
    try {
        const isExistUser = await database.query(`SELECT * FROM users WHERE id = ?`, [VoteBody.userid]);
        if( isExistUser[0].length === 0 ) {
            console.log( " not exist userid", isExistUser );
            return { message: "NOT EXIST USERID" };
        }
        const isExistOption = await database.query(`SELECT * FROM options WHERE id = ?`, [VoteBody.optionid]);
        if( isExistOption[0].length === 0 ) {
            console.log( " not exist option", isExistUser );
            return { message: "NOT EXIST OPTION" };
        }

        const isExistPolls = await database.query(`SELECT * FROM polls WHERE id = ?`, [ isExistOption[0][0].pollID ]);
        if( isExistPolls[0].length === 0 ) {
            console.log( " not exist POLLSID", isExistPolls );
            return { message: "NOT EXIST POLLSID" };
        }
        const isPollsLock = isExistPolls[0][0].isLock
        if( isPollsLock ) {
            console.log( "POLLS IS LOCK", isPollsLock );
            return { message: "POLLS IS LOCK" };
        }

        const isExistVote = await database.query(`SELECT * FROM submition WHERE userID = ? AND optionID = ?`, [VoteBody.userid, VoteBody.optionid]);
        if( isExistVote[0].length === 0 ) {
            const vote = await database.query(`INSERT INTO submition( userID, optionID) VALUES(?,?)`, [ VoteBody.userid, VoteBody.optionid ]);
            if( vote[0]?.affectedRows === 0 ) {
                console.log( vote[0] );
                return { message : "VOTE FAIL", status: false  };
            } 
            console.log( vote[0] );
            return { message: "VOTE SUCCESS", status: true };
        }
        return { message: "ALREADY VOTED" };
    } catch (error) {
        console.log( error )
        return { message: "ERROR ADD VOTE", status: false }
    }
}

const UnVote = async( UnVoteBody ) => {
    try {
        const isExistUser = await database.query(`SELECT * FROM users WHERE id = ?`, [UnVoteBody.userid]);
        if( isExistUser[0].length === 0 ) {
            console.log( " not exist userid", isExistUser );
            return { message: "NOT EXIST USERID"};
        }
        const isExistOption = await database.query(`SELECT * FROM options WHERE id = ?`, [UnVoteBody.optionid]);
        if( isExistOption[0].length === 0 ) {
            console.log( " not exist option", isExistUser );
            return { message: "NOT EXIST OPTION"};
        }

        const isExistPolls = await database.query(`SELECT * FROM polls WHERE id = ?`, [ isExistOption[0][0].pollID ]);
        if( isExistPolls[0].length === 0 ) {
            console.log( " not exist POLLSID", isExistPolls );
            return { message: "NOT EXIST POLLSID"};
        }
        const isPollsLock = isExistPolls[0][0].isLock
        if( isPollsLock ) {
            console.log( "POLLS IS LOCK", isPollsLock );
            return { message: "POLLS IS LOCK"};
        }

        const isExistVote = await database.query(`SELECT * FROM submition WHERE userID = ? AND optionID = ?`, [ UnVoteBody.userid, UnVoteBody.optionid]);
        if( isExistVote[0].length !== 0 ) {
            const unVote = await database.query(`DELETE FROM submition WHERE userID = ? AND optionID = ?`, [ UnVoteBody.userid, UnVoteBody.optionid ]);
            if( unVote[0]?.affectedRows === 0 ) {
                console.log( unVote[0] );
                return { message : "UNVOTE FAIL", status: false  };
            } 
            console.log( unVote[0] );
            return { message: "UNVOTE SUCCESS", status: true };
        }
        return { message: "NOT VOTED YET" };
    } catch (error) {
        console.log( error )
        return { message: "ERROR UNVOTE", status: false }
    }
}

const GetUsersVoted = async( PollsID ) => {
    try {
        const isExistPolls = await database.query(`SELECT * FROM polls WHERE id = ?`, [PollsID]);
        if( isExistPolls === 0 ) {
            console.log( " not exist userid", isExistPolls );
            return { message: "NOT EXIST POLLSID" };
        }

        const CreatedBy = await database.query(`SELECT fullName FROM users WHERE id = ?`, [isExistPolls[0][0].userid]);
        if( CreatedBy[0].length === 0 ) {
            console.log( " not exist userid", CreatedBy );
            return { message: "NOT EXIST CREATEDBY" };
        }

        const Poll = {
            Topic : isExistPolls[0][0].title,
            PollsID : PollsID,
            CreatedBy : CreatedBy[0][0].fullName, 
            CreatedAt : isExistPolls[0][0].createdAt,
            IsLock : isExistPolls[0][0].isLock,
            Options : []
        }
        const UsersVoted = await database.query(`SELECT s.optionID, o.title, COUNT( s.userID ) as total
                                            FROM submition as s INNER JOIN options as o ON s.optionID = o.ID
                                            WHERE o.pollID = ?
                                            GROUP BY o.title, s.optionID`, [PollsID]);
        if( UsersVoted[0].length === 0 ) {
            console.log( " not exist userid", UsersVoted );
            return { message: "NOT EXIST OPTIONS", UsersVoted };
        }
        // Promise.all( 1 array ) va map tuong thich voi viec asynchronous con foreach thi 0
        await Promise.all( UsersVoted[0].map( async( element ) => {
            try {
                const Users = await database.query(`SELECT u.fullName FROM submition as s INNER JOIN users as u 
                                                    WHERE u.id = s.userID and s.optionID = ?`, [element.optionID]);
                if( Users[0].length === 0 ) {
                    console.log( " not exist userid", Users );
                    return { message: "NOT EXIST USERS", UsersVoted };
                }
                const ListUser = [];
                Users[0].forEach( user => {
                    ListUser.push( user.fullName )
                })
                Poll.Options.push({
                    Title: element.title,
                    UserVoted: ListUser,
                    Total: element.total
                })
            } catch (error) {
                console.log( error )
                return { message: "ERROR GET USERS ", status: false }
            }
        } ) );
        return Poll;
    } catch (error) {
        console.log( error )
        return { message: "ERROR GET USER VOTED" , status: false }
    }
}

export default {
    CreatePolls,
    LockPoll,
    UnLockPoll,
    DeletePoll,
    AddOption,
    RemoveOption,
    Vote,
    UnVote,
    GetUsersVoted
}