import User from '../models/User.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { initialize } from '../passport/passport-config.js';
// Запускаем функцию
initialize(passport);

// Register user
export const register = async (req, res) => {
    try {
        // получаем запрос от пользователя
        const {email, name, password} = await req.body;
        
        // есть ли уже этот пользователь в базе данных
        const isUsed = await User.findOne({email})
        
        if (isUsed) {
            return res.json({
                message: 'Этот email уже занят.'
            })
        }
        
        // генерируем хэш
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // записываем юзера в бд
        const newUser = new User({
            email,
            name,
            password: hashedPassword,
        })

        // сохраняем
        await newUser.save()

        // Перенаправляем на страницу account/login
        res.redirect('/account/login');

    } catch (error) {
        res.json({
            error,
            message: 'Ошибка при создании пользователя'
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        // Получаем запрос от формы
        const {email, secondName, name, numberTel} = await req.body;
        // Обновляем данные пользователя
        const user = await User.findByIdAndUpdate({_id: req.user._id}, {$set: {
            email: email,
            secondName: secondName,
            name: name,
            numberTel: numberTel
        }});

        if (!user) {
            res.json({
                message: 'Что-то пошло не так'
            })
        }
        // Перенаправляем
        res.redirect('/account/me')
    } catch (error) {
        return res.json({
            message: 'Не удалось сохранить данные'
        })
    }
}

export const getMe = async (req, res) => {
    try {
        res.render('user', {
            email: req.user.email,
            secondName: req.user.secondName,
            name: req.user.name,
            numberTel: req.user.numberTel
        });
    } catch (error) {
        res.json({
            message: 'Что-то пошло не так('
        })
    }
}

export const loginGet = (req, res) => {
    res.render('login');
}

export const registerGet = (req, res) => {
    res.render('register');
}


