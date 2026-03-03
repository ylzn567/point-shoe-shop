const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./db/connection');

const orderRouter = require('./routers/orderRouter.js')
const shoeRouter = require('./routers/shoeRouter.js')
const userRouter = require('./routers/userRouter.js')
const viewRouter = require('./routers/viewRouter.js')

const app = express();

function logger(req, res, next) {
    const line = `URL: ${req.url}, Method: ${req.method}, Time: ${new Date().toISOString()}\n`;

    fs.appendFile('logs.txt', line, (err) => {
        if (err) {
            console.error('Error writing to log file', err);
        }
    });
    next();
}

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/images', express.static('images'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    req.isAdmin = false;
    res.locals.isAdmin = false;
    next();
});

app.use((req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return next();
    }
    
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = payload;
        req.isAdmin = !!payload.isAdmin;
        res.locals.isAdmin = req.isAdmin;
    } catch (err) {
        req.userData = null;
    }
    next();
});

app.get('/', (req, res) => {
    res.render('index');
});

app.use(viewRouter);
app.use('/api/orders', orderRouter);
app.use('/api/shoes', shoeRouter);
app.use('/api/users', userRouter);

app.use((req, res, next) => {
    next({ status: 404, message: 'Route not found' });
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Server error';
    res.status(status).render('error', { status, message, details: err.details || null });
});

connectDB()
    .catch((err) => {
        console.error('Database startup error:', err.message);
    });

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
