const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const PORT = process.env.PORT || 3000;
// Set the view engine to EJS
app.set('view engine', 'ejs');

var allowedUsers=[
    {
        userName:"Ram",
        password:123
    },
    {
        userName:"Jam",
        password:123
    },
    {
        userName:"Sam",
        password:123
    },
]

// Session middleware
app.use(session({
    secret: "123131231",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } 
}));

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware to parse form data
app.use(express.urlencoded({ extended: false }));

function preventCaching(req, res, next) {
    res.setHeader('Cache-Control', 'no-store');
    next();
}

// Apply middleware to all routes
app.use(preventCaching);

// Middleware to check if user is logged in
function redirectToHomeIfLoggedIn(req, res, next) {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
}

// Routes
app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('home');
});

app.get('/login',redirectToHomeIfLoggedIn, (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('login', { error: '' });
});

app.post('/login', (req, res) => {
    const { userName, password } = req.body;
    if (allowedUsers.some((obj)=> userName==obj.userName && password==obj.password)) {
        req.session.user = { userName };
        res.redirect('/');
    } else {
        res.render('login', { error: 'Invalid email or password' });
    }
});

app.get("/logout",(req,res)=>{
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/login');
    });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
