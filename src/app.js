const path = require('node:path');
const express = require('express');
const indexRouter = require('./routes/indexRouter');
//session handling
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const session = require('express-session');
const { passport } = require('./passport/passport')
const LocalStrategy = require('passport-local').Strategy




require('dotenv').config();

const app = express();

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