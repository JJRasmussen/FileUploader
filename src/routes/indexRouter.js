import { Router } from 'express';
import { validationResult } from 'express-validator';
import passport from '../middleware/passport.js'
import authorizations from '../middleware/authorization.js'
import newUserSchema from '../middleware/validatorSchemas.js';
import { createNewUser } from '../controllers/userController.js';

const indexRouter = Router();

//public routes
indexRouter.get('/', async(req, res) => {
    let userCreated = (req.query.userCreated === 'true');
    let invalidLogin = (req.query.invalidLogin === 'true');
    res.render('index', {
        user: req.user,
        message: false,
        userCreated: userCreated,
        invalidLogin: invalidLogin,
    });
});
indexRouter.post('/log-in', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/?invalidLogin=true'
}));
indexRouter.get('/sign-up', async(req, res) => {
    res.render('sign-up');
});
indexRouter.post('/sign-up',
    newUserSchema,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).render('index', {
                message: "Error in user creation",
                errors: errors.array(),
                user: req.user
            });
        };
        try{
            await createNewUser(req, res, next);
            res.status(201).redirect('/?userCreated=true')
        } catch(error) {
            next(error);
        }
    }
);

//user routes
indexRouter.get('/log-out', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        };
        res.redirect('/');
    });
});

indexRouter.get('/user-route', authorizations.isUser, (req, res, next) => {
    res.render('user-page', {
        user: req.user,
        message: null,
    });
});

export default indexRouter;