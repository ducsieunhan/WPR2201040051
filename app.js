const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/authRoutes');
const emailRoutes = require('./src/routes/emailRoutes');
const configViewEngine = require('./src/config/viewEngine');
const { authMiddleware, checkUser, getAllUsers } = require('./src/middlewares/authMiddleware');
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('*', checkUser);
app.use('*', getAllUsers);

configViewEngine(app);

app.use('/auth', authRoutes);
app.use('/', emailRoutes);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});