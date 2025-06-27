import Prisma from './client.js';

async function findUserByUsername(username){
    try{
        return await Prisma.user.findUnique({ 
            where: {
                username: username,
            },
        });     
    } catch (error) {
        console.error("error querying user:", error)
        throw error;
    } 
};

async function createUserInDatabase(username, hashedPassword){
    try{
        return await Prisma.user.create({ 
            data: {
                username: username,
                hashedPassword: hashedPassword,
            },
        });
    } catch(error){
        console.error("error creating user:", error)
        throw error;
    }
};

export default {
    findUserByUsername,
    createUserInDatabase
}