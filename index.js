require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const csrf = require('csurf');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

const adminRoute = require('./routes/admin.route');
const authRoute = require('./routes/auth.route');
const productsRoute = require('./routes/products.route');
const cartRoute = require('./routes/cart.route');
const transferRoute = require('./routes/transfer.route');

const authMiddleware = require('./middlewares/auth.middleware');
const sessionMiddleware = require('./middlewares/session.middleware');

const app = express();

const hbs = exphbs.create({
  helpers: {
    xif: (v1, v2, options) => (v1 === v2) ? options.fn(this) : options.inverse(this),
    mainImage: (images, num) => images[num],
    slice: (string, num) => string.slice(0, num) + ' ...'
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(sessionMiddleware);
app.get('/', (req, res) => res.render('home', { title: 'Store' }));
app.use('/products', productsRoute);
app.use('/auth', authMiddleware.loggedIn, authRoute);
app.use('/admin', authMiddleware.requireAuth, adminRoute);
app.use('/cart', cartRoute);
app.use('/transfer', authMiddleware.requireAuth, csrf({ cookie: true }), transferRoute);

const port = 2000;
app.listen(port, () => console.log(`Server started on port ${port}`));
