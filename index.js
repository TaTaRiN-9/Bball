import express from 'express';
import hbs from 'hbs';
import expressHBS from 'express-handlebars';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import {fileURLToPath} from 'url';
import session from 'express-session';
import flash from 'express-flash';
import passport from 'passport';
import methodOverride from 'method-override';

import authRoutes from './routes/auth.js';

// получаем путь нашего проекта
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();


app.engine("hbs", expressHBS.engine(
    {
        layoutsDir: "views/layouts", 
        defaultLayout: "layout",
        extname: "hbs"
    }
))

// можем отправлять запрос бэку с разных адресов 
app.use(cors());

// даем понять экспрессу, что будем использовать json файлы и запросы
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// помогает отображать сообщение без перенаправления запроса
app.use(flash())

// необходима для сессий пользователей
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false
}))

// инициализация паспорта, необходимо для проверки авторизации пользователя
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// сообщаем express, что статические файлы находятся в public
app.use(express.static(path.join(__dirname, 'public')));

// Путь для роутов начинается с account
app.use('/account', authRoutes);

async function startApp() {
    try {
        // подключаем к базе данных
        await mongoose.connect(
            `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.v8wtfbn.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
        )

        app.listen(PORT, () => {
            console.log(`Server is started on ${PORT} port`);
        });
    } catch (error) {
        console.log(error)
    }
}

// константы
const PORT = process.env.PORT || 3000;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// говорим hbs, что есть папка partials, где лежат header, footer

hbs.registerPartials(path.join(__dirname, 'views/partials'), (err) => {})

// подключаем hbs (handlebars)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Представления
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Главная'
    });
})

app.get('/basket', (req, res) => {
    res.render('basket', {
        title: 'Корзина'
    });
})

app.get('/contacts', (req, res) => {
    res.render('contacts', {
        title: 'Контакты'
    });
})

app.get('/instruction', (req, res) => {
    res.render('instruction', {
        title: 'Инструкция'
    });
})

app.get('/test', (req, res) => {
    res.json({message: 'All is fine'})
})

// выход пользователя из аккаунта
app.get('/logout', (req, res, next) => {
    req.logOut(req.user, err => {
        if (err) return next(err)
    })
    res.redirect('/account/login')
})

startApp();