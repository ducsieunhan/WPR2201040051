const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/authRoutes');
const configViewEngine = require('./src/config/viewEngine');
const { authMiddleware, checkUser } = require('./src/middlewares/authMiddleware');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('*', checkUser);

configViewEngine(app);

app.use('/auth', authRoutes);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});