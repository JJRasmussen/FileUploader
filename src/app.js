import { fileURLToPath } from 'node:url';
import path from 'node:path';
import express from 'express';
import indexRouter from './routes/indexRouter.js';
// session handling
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';
import session from 'express-session';
import passport from './middleware/passport.js';
import { Strategy as LocalStrategy } from 'passport-local'
import 'dotenv/config';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//setup styles
const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));

//session handling
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new PrismaSessionStore(
            new PrismaClient(),
            {
                checkPeriod: 2*60*1000,
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            },
        ),
        cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, //7 days
    }),
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

app.listen(3000, () => console.log(`app listening on port ${3000}!`));