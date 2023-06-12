import {Router} from 'express';
import passport from 'passport';
import {register, getMe, updateUser, loginGet, registerGet} from '../controllers/auth.js'
import { checkAuthWithPassport, checkNotAuthWithPassport } from '../utils/checkAuthWithPassport.js';

const router = new Router();
router.post('/register', register)
router.post('/login', passport.authenticate('local', {
    successReturnToOrRedirect: '/account/me',
    failureRedirect: '/account/login',
    failureFlash: true
}))

// update
router.post('/me', checkAuthWithPassport, updateUser)

// Get me
router.get('/me', checkAuthWithPassport, getMe)

// проецируем страницу логина
router.get('/login', checkNotAuthWithPassport, loginGet)

// проецируем страницу регистрации
router.get('/register', checkNotAuthWithPassport, registerGet)

export default router;