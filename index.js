require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const csrf = require('csurf');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');

const app = express();

require('./middlewares/passport.middleware');

// Connect MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => console.log('MongoBD Connected!'))
  .catch(err => console.log(err));

// Routes
const adminRoute = require('./routes/admin.route');
const authRoute = require('./routes/auth.route');
const productsRoute = require('./routes/products.route');
const cartRoute = require('./routes/cart.route');
const transferRoute = require('./routes/transfer.route');

// Middlewares
const authMiddleware = require('./middlewares/auth.middleware');
const sessionMiddleware = require('./middlewares/session.middleware');
const globalVariablesMiddileware = require('./middlewares/global-variables.middleware');

// Handlebars
const hbs = exphbs.create({
  helpers: {
    xif: (v1, v2, options) => (v1 === v2) ? options.fn(this) : options.inverse(this),
    mainImage: (images, num) => images[num],
    slice: (string, num) => string.slice(0, num) + ' ...'
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Public Folder
app.use(express.static('public'));

// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie Parser middleware
app.use(cookieParser(process.env.SESSION_SECRET));

// // Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

// Session cart middleware
app.use(sessionMiddleware);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash Middlware
app.use(flash());

// Global Varibales
app.use(globalVariablesMiddileware);

// Routes
app.get('/', (req, res) => res.render('home', { title: 'Store' }));
app.use('/products', productsRoute);
app.use('/auth', authRoute);
app.use('/admin', authMiddleware.requireAuth, adminRoute);
app.use('/cart', cartRoute);
app.use('/transfer', authMiddleware.requireAuth, csrf({ cookie: true }), transferRoute);

// Port
const port = 2000;
app.listen(port, () => console.log(`Server started on port ${port}`));
