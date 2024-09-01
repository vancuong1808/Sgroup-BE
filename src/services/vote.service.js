import database from "../config/database.js";

const CreatePolls = async( pollsBody ) => {
    try {
        if ( !pollsBody.title || pollsBody.title.trim().length === 0 ) {
            return { status: 'failed', message: "TITLE IS NULL" };
        }
        const isExistUser = await database.query(`SELECT * FROM users WHERE id = ?`, [pollsBody.userid]);
        if ( isExistUser[0].length === 0 ) {
            return { status: 'failed', message: "NOT EXIST USERID" };
        }
        const isExistPolls = await database.query(`SELECT * FROM polls WHERE title IS NOT NULL AND title = ?`, [pollsBody.title]);
        if ( isExistPolls[0].length !== 0 ) {
            return { status: 'failed', message: "EXIST POLLS" };
        }
        const polls = await database.query(`INSERT INTO polls( userid ,title, isLock, createdAt ) VALUES( ?, ?, ?, ? )`, [pollsBody.userid, pollsBody.title, pollsBody.isLock, pollsBody.createdAt]);
        if ( polls[0]?.affectedRows === 0 ) {
            return { status: 'failed', message: "CREATE POLLS FAIL" };
        } 
        return { status: 'success', message: "CREATE POLLS SUCCESS", data: polls[0]?.insertId };
    } catch( error ) {
        throw error
    }
}; 

const LockPoll = async( pollID, userID ) => {
    try {
        const isExistPolls = await database.query(`SELECT * FROM polls WHERE id = ?`, [pollID]);
        if ( isExistPolls[0].length === 0 ) {
            return { status: 'failed', message: "NOT EXIST POLLS" };
        }

        const isExistUser = await database.query(`SELECT * FROM users WHERE id = ?`, [userID]);
        if ( isExistUser[0].length === 0 ) {
            return { status: 'failed', message: "NOT EXIST USERID" };
        }

        if ( isExistPolls[0][0].userid !== userID ) {
            return { status: 'failed', message: "NOT CREATOR" };
        }

        const isLock = isExistPolls[0][0].isLock;
        if ( isLock ) {
            return { status: 'failed', message: "POLL IS ALREADY LOCK" };
        }

        const polls = await database.query(`UPDATE polls SET isLock = 1 WHERE id = ?`, [pollID]);
        if ( polls[0]?.affectedRows === 0 ) {
            return { status: 'failed', message: "POLL LOCK FAIL" };
        }
        return { status: 'success', message: "POLL IS LOCKED SUCCESSFULLY", data: pollID };

    } catch( error ) {
        throw error;
    }
};

const UnLockPoll = async( pollID, userID ) => {
    try {
        const isExistPolls = await database.query(`SELECT * FROM polls WHERE id = ?`, [pollID]);
        if ( isExistPolls[0].length === 0 ) {
            return { status: 'failed', message: "NOT EXIST POLLS" };
        }

        const isExistUser = await database.query(`SELECT * FROM users WHERE id = ?`, [userID]);
        if ( isExistUser[0].length === 0 ) {
            return { status: 'failed', message: "NOT EXIST USERID" };
        }

        if ( isExistPolls[0][0].userid !== userID ) {
            return { status: 'failed', message: "NOT CREATOR" };
        }

        const isLock = isExistPolls[0][0].isLock;
        if ( !isLock ) {
            return { status: 'failed', message: "POLL IS ALREADY UNLOCKED" };
        }

        const polls = await database.query(`UPDATE polls SET isLock = 0 WHERE id = ?`, [pollID]);
        if ( polls[0]?.affectedRows === 0 ) {
            return { status: 'failed', message: "UNLOCK POLL FAILED" };
        }
        return { status: 'success', message: "POLL UNLOCK SUCCESSFUL", data: pollID };

    } catch( error ) {
        throw error;
    }
};

const DeletePoll = async( pollId, userId ) => {
    try {
        const isExistPolls = await database.query(`SELECT * FROM polls WHERE id = ?`, [pollId]);
        if (isExistPolls[0].length === 0) {
            return { status: "failed", message: "NOT EXIST POLLID" };
        }

        const isExistUser = await database.query(`SELECT * FROM users WHERE id = ?`, [userId]);
        if ( isExistUser[0].length === 0 ) {
            return { status: "failed", message: "NOT EXIST USERID" };
        }

        if ( isExistPolls[0][0].userid !== userId ) {
            return { status: "failed", message: "NOT CREATOR" };
        }

        const isExistOption = await database.query(`SELECT * FROM options WHERE pollID = ?`, [pollId]);
        console.log( isExistOption[0] );
        if ( isExistOption[0].length !== 0 ) {
            const isExistUserOption = await database.query(`SELECT * FROM submittions WHERE optionID = ?`, [isExistOption[0][0].ID]);
            console.log( isExistUserOption[0][0] );
            if ( isExistUserOption[0].length !== 0 ) {
                const removeUserOption = await database.query(`DELETE FROM submittions WHERE optionID = ?`, [isExistOption[0][0].ID]);
                if ( removeUserOption[0]?.affectedRows === 0 ) {
                    return { status: "failed", message: "DELETE SUBMISSION FAIL" };
                }
            }
            const removeOption = await database.query(`DELETE FROM options WHERE pollID = ?`, [pollId]);
            if ( removeOption[0]?.affectedRows === 0 ) {
                return { status: "failed", message: "DELETE OPTION FAIL" };
            }
        }

        const deletePoll = await database.query(`DELETE FROM polls WHERE id = ?`, [pollId]);
        if ( deletePoll[0]?.affectedRows === 0 ) {
            return { status: "failed", message: "DELETE POLL FAIL" };
        }
        
        return { status: "success", message: "DELETE POLL SUCCESS" };
    } catch (error) {
        console.log( error )
        throw error;
    }
}

const AddOption = async( optionBody ) => {
    try {
        const isExistPolls = await database.query(`SELECT * FROM polls WHERE id = ?`, [optionBody.pollid]);
        if ( isExistPolls[0].length === 0 ) {
            return { status: "failed", message: "NOT EXIST POLLID" };
        }

        const isPollsLock = isExistPolls[0][0].isLock;
        if ( isPollsLock ) {
            return { status: "failed", message: "POLL IS LOCKED" };
        }

        if ( !optionBody.option.trim().length ) {
            return { status: "failed", message: "OPTION IS EMPTY" };
        }

        const isOptionExist = await database.query(`SELECT * FROM options WHERE pollID = ? AND title = ?`, [optionBody.pollid, optionBody.option]);
        if ( isOptionExist[0].length !== 0 ) {
            return { status: "failed", message: "OPTION ALREADY EXISTS" };
        }

        const option = await database.query(`INSERT INTO options (pollID, title, createdAt) VALUES (?, ?, ?)`, [optionBody.pollid, optionBody.option, optionBody.createdAt]);
        if ( option[0]?.affectedRows === 0 ) {
            return { status: "failed", message: "ADD OPTION FAILED" };
        }
        
        return { status: "success", message: "ADD OPTION SUCCESSFUL", data: option[0]?.insertId };
    } catch (error) {
        throw error;
    }
}


const RemoveOption = async( optionId ) => {
    try {
        const isExistOption = await database.query(`SELECT * FROM options WHERE ID = ?`, [optionId]);
        if ( isExistOption[0].length === 0 ) {
            return { status: "failed", message: "NOT EXIST OPTION ID" };
        }

        const isExistPolls = await database.query(`SELECT * FROM polls WHERE id = ?`, [isExistOption[0][0].pollID]);
        if ( isExistPolls[0].length === 0 ) {
            return { status: "failed", message: "NOT EXIST POLLSID" };
        }

        const isPollsLock = isExistPolls[0][0].isLock;
        if ( isPollsLock ) {
            return { status: "failed", message: "POLLS IS LOCK" };
        }

        const isExistUserOption = await database.query(`SELECT * FROM submition WHERE optionID = ?`, [optionId]);
        if ( isExistUserOption[0].length !== 0 ) {
            const removeUserOption = await database.query(`DELETE FROM submition WHERE optionID = ?`, [optionId]);
            if ( removeUserOption.affectedRows === 0 ) {
                return { status: "failed", message: "DELETE SUBMITION FAIL" };
            }
        }

        const removeOption = await database.query(`DELETE FROM options WHERE ID = ?`, [optionId]);
        if ( removeOption[0]?.affectedRows === 0 ) {
            return { status: "failed", message: "DELETE OPTION FAIL" };
        }
        
        return { status: "success", message: "DELETE OPTION SUCCESS" };
    } catch (error) {
        throw error;
    }
}

const Vote = async (voteBody) => {
    try {
        const isExistUser = await database.query(`SELECT * FROM users WHERE id = ?`, [voteBody.userid]);
        if (isExistUser[0].length === 0) {
            return { status: "failed", message: "NOT EXIST USERID" };
        }

        const isExistOption = await database.query(`SELECT * FROM options WHERE id = ?`, [voteBody.optionid]);
        if (isExistOption[0].length === 0) {
            return { status: "failed", message: "NOT EXIST OPTION" };
        }

        const isExistPolls = await database.query(`SELECT * FROM polls WHERE id = ?`, [isExistOption[0][0].pollID]);
        if (isExistPolls[0].length === 0) {
            return { status: "failed", message: "NOT EXIST POLLID" };
        }

        const isPollsLock = isExistPolls[0][0].isLock;
        if (isPollsLock) {

            return { status: "failed", message: "POLL IS LOCKED" };
        }

        const isExistVote = await database.query(`SELECT * FROM submition WHERE userID = ? AND optionID = ?`, [voteBody.userid, voteBody.optionid]);
        if ( isExistVote[0].length === 0 ) {
            const vote = await database.query(`INSERT INTO submition(userID, optionID) VALUES(?, ?)`, [voteBody.userid, voteBody.optionid]);
            if (vote[0]?.affectedRows === 0) {
                return { status: "failed", message: "VOTE FAIL" };
            }
            return { status: "success", message: "VOTE SUCCESS" };
        }
        return { status: "failed", message: "ALREADY VOTED" };
    } catch( error ) {
        throw error;
    }
};


const UnVote = async (unVoteBody) => {
    try {
        const isExistUser = await database.query(`SELECT * FROM users WHERE id = ?`, [unVoteBody.userid]);
        if (isExistUser[0].length === 0) {
            return { status: "failed", message: "NOT EXIST USERID" };
        }

        const isExistOption = await database.query(`SELECT * FROM options WHERE id = ?`, [unVoteBody.optionid]);
        if (isExistOption[0].length === 0) {
            return { status: "failed", message: "NOT EXIST OPTION" };
        }

        const isExistPolls = await database.query(`SELECT * FROM polls WHERE id = ?`, [isExistOption[0][0].pollID]);
        if (isExistPolls[0].length === 0) {
            return { status: "failed", message: "NOT EXIST POLLID" };
        }

        const isPollsLock = isExistPolls[0][0].isLock;
        if (isPollsLock) {
            return { status: "failed", message: "POLLS IS LOCKED" };
        }

        const isExistVote = await database.query(`SELECT * FROM submition WHERE userID = ? AND optionID = ?`, [unVoteBody.userid, unVoteBody.optionid]);
        if (isExistVote[0].length !== 0) {
            const unVote = await database.query(`DELETE FROM submition WHERE userID = ? AND optionID = ?`, [unVoteBody.userid, unVoteBody.optionid]);
            if (unVote[0]?.affectedRows === 0) {
                return { status: "failed", message: "UNVOTE FAIL" };
            }
            return { status: "success", message: "UNVOTE SUCCESS" };
        }
        return { status: "failed", message: "NOT VOTED YET" };
    } catch( error ) {
        throw error;
    }
};


const GetUsersVoted = async (pollsID) => {
    try {
        const isExistPolls = await database.query(`SELECT * FROM polls WHERE id = ?`, [pollsID]);
        if (isExistPolls[0].length === 0) {
            return { status: "failed", message: "NOT EXIST POLLSID" };
        }

        const createdBy = await database.query(`SELECT fullName FROM users WHERE id = ?`, [isExistPolls[0][0].userid]);
        if (createdBy[0].length === 0) {
            return { status: "failed", message: "NOT EXIST CREATEDBY" };
        }

        const poll = {
            topic: isExistPolls[0][0].title,
            pollsID: pollsID,
            createdBy: createdBy[0][0].fullName,
            createdAt: isExistPolls[0][0].createdAt,
            isLock: isExistPolls[0][0].isLock,
            options: []
        };

        const usersVoted = await database.query(`
            SELECT s.optionID, o.title, COUNT(s.userID) as total
            FROM submition as s INNER JOIN options as o ON s.optionID = o.ID
            WHERE o.pollID = ?
            GROUP BY o.title, s.optionID
        `, [pollsID]);

        if (usersVoted[0].length === 0) {
            return { status: "failed", message: "NOT EXIST OPTIONS" };
        }

        // Dùng for...of để lặp qua từng option
        for (const element of usersVoted[0]) {
            try {
                const users = await database.query(`
                    SELECT u.fullName FROM submition as s 
                    INNER JOIN users as u ON u.id = s.userID 
                    WHERE s.optionID = ?
                `, [element.optionID]);

                if (users[0].length === 0) {
                    console.log("Không tồn tại người dùng", users);
                    return { status: "failed", message: "NOT EXIST USERS" };
                }

                const listUser = users[0].map(user => user.fullName);

                poll.options.push({
                    title: element.title,
                    userVoted: listUser,
                    total: element.total
                });
            } catch( error ) {
                throw error;
            }
        }

        return { status: "success", message: "GET USER SUCCESS" ,data: poll };
    } catch( error ) {
        throw error;
    }
};


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