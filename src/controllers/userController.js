import userDb from '../db/userQueries.js';
import bcrypt from 'bcryptjs';

export async function createNewUser(req, res, next){
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.HASH_LENGTH));
        await userDb.createUserInDatabase(req.body.username, hashedPassword);
    } catch(error) {
        console.error(error);
        next(error);
    };
};



