import { Router } from 'express';
import authorizations from '../middleware/authorization.js'
import upload from '../middleware/fileUpload/multer.js'
import fileValidation from '../middleware/fileUpload/fileValidation.js';

const userRouter = Router();

//router wide middleware
userRouter.use(authorizations.isUser);

userRouter.get('/log-out', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        };
        res.redirect('/');
    });
});

userRouter.post('/upload', upload.single('file'), fileValidation, (req, res) => {
    res.send('upload successfully!')
})

userRouter.get('/user-route', (req, res, next) => {
    res.render('user-page', {
        user: req.user,
        message: null,
    });
});

export default userRouter;