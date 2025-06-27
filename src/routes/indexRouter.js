import { Router } from 'express';
import { validationResult } from 'express-validator';
import newUserSchema from '../middleware/validatorSchemas.js';
import { createNewUser } from '../controllers/userController.js';
const indexRouter = Router();

//public routes
indexRouter.get('/', async(req, res) => {
    res.render('index', {
            message: false,
        });
});

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
            res.status(201).render('index', {
                message: "user created"
            })
        } catch(error) {
            next(error);
        }
    }
);
export default indexRouter;