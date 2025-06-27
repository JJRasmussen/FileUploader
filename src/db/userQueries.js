import Prisma from './client.js';

async function findUserFromUsername(username){
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

async function findUserFromId(id){
    try{
        return await Prisma.user.findUnique({ 
            where: {
                id: id,
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
    findUserFromUsername,
    createUserInDatabase,
    findUserFromId,
}