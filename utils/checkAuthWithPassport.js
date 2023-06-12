export const checkAuthWithPassport = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    
    res.redirect('/account/login')
}

export const checkNotAuthWithPassport = (req, res, next) => {
    // Проверяем, зарегистрирован ли пользователь, если да, то перенаправляем
    if (req.isAuthenticated()) {
        return res.redirect('/account/me')
    }

    // если нет, то идем дальше
    next();
}