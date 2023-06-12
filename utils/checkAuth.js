import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
    /* получаем от запроса строку в виде: "Bearer eijdsjfsdjfiowiakcnvdfio"
       поэтому нам необходимо избавиться от слова Bearer. */
    const token = req.body.token || req.query.token || req.params.token || req.headers["x-access-token"];

    if (token) {
        try {
            // расшифровали токен
            console.log('1')
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            
            // добавляем новое поле, чтобы его потом можно было вытащить
            req.userId = decoded.id
            console.log(req.userId, 'req.userId !!!!!!')

            // идем дальше
            next()
        } catch (error) {
            return res.json({
                message: 'Нет доступа'
            })
        }
    } else {
        console.log('2');
        res.json({
            success: false
        })
    }
}