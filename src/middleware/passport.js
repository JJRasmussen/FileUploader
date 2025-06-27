import passport from 'passport';
import bcrypt from 'bcryptjs';
import { Strategy as LocalStrategy } from 'passport-local';
import dbUser from '../db/userQueries.js';

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try{
            const user = await dbUser.findUserFromUsername(username);
            if (!user) {
                return done(null, false, {message: 'Incorrect username'});
            }
            console.log(user)
            const match = await bcrypt.compare(password, user.hashedPassword);
            if (!match) {
                return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, user);
        } catch(err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await dbUser.findUserFromId(id);
        done(null, user);
    } catch(err) {
        done(err);
    }
});

export default passport;