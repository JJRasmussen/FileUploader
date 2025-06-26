const path = require('node:path');
const express = require('express');
const session = require('express-session');
const indexRouter = require('./routes/indexRouter');
//session handling
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');

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
    expressSession({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000 
        },
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUnitialized: true,
        store: new PrismaSessionStore(
            new PrismaClient(),
            {
                checkPeriod: 2*60*1000,
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            },
        ),
    }),
);

app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

app.listen(3000, () => console.log(`app listening on port ${3000}!`));