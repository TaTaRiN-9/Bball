import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const initialize = async (passport) => {
    const authenticateUser = async (email, password, done) => {
        // Ищем пользователя в базе данных
        const user = await User.findOne({email});
        if (!user) {
            return done(null, false, {message: 'Пользователь не найден'})
        }

        try {
            // Сравниваем пароли
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, {message: 'Пароль неверный'})
            } 
        } catch (error) {
            return done(error)
        }
    }

    // стратегия авторизации
    passport.use(new LocalStrategy.Strategy({usernameField: 'email'}, authenticateUser))
    
    // для сохранения пользовательских сессий
    passport.serializeUser((user, done) => done(null, user.id)) 

    // для получения пользовательских данных из сессий
    passport.deserializeUser(async function(id, done) {
        const ido = await User.findById(id);
        done(null, ido)
    });
}