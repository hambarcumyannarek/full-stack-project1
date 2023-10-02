import express from 'express';
import { createPool } from 'mysql2/promise';
import session from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import path from 'path';
import multer from 'multer'
import fs from 'fs';


const app = express();
app.set('view-engine', 'ejs');
app.use(express.static('views'));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}))
app.use(express.urlencoded({ urlencoded: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy({
    usernameField: 'email'
}, async (email, password, done) => {
    let user = await pool.query('select * from userdate where email=?', [email]);
    user = user[0][0];
    if (user === undefined) {
        return done(null, false, { message: 'incorect email' })
    }
    if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
    } else {
        done(null, false, { message: 'incorect password' })
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    const user = await pool.query('select * from userdate where id=?', [id]);
    done(null, user[0][0])
})

const pool = createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})


function chakeAutocation(req, res, next) {
    if (req.isAuthenticated() === false) {
        return res.redirect('/login');
    }
    next();
}

app.get('/', chakeAutocation, async (req, res) => {
    const cards = await pool.query(`select * from products`);
    const likesProductId = await pool.query('select product_id from likes inner join products on products.id = likes.product_id where likes.thisuserid=?', [req.user.id]);
    console.log(likesProductId[0].length);
    res.render('home.ejs', {
        ...req.user,
        likesProducts: likesProductId[0],
        products: cards[0]
    });
})

const storage = multer.diskStorage({
    destination: 'views/images/upload/',
    filename: (req, file, callBack) => {
        callBack(null, Date.now() + '-' + Math.random() + path.extname(file.originalname));
    }
})

const upload = multer({ storage })

app.get('/addProduct', chakeAutocation, (req, res) => {
    console.log(req.user.name, req.user.email)
    res.render('addProduct.ejs', {
        name: req.user.name,
        email: req.user.email
    })
})

app.post('/addProduct', upload.single('productimg'), async (req, res) => {
    const { id, name, email } = req.user;
    const { filename } = req.file;
    const { price } = req.body;
    const product_name = req.body.name;

    console.log(id, filename, price)
    await pool.query('insert into products(user_id, img, product_name, price, autohor_name, autohor_email) values(?,?,?,?,?,?)', [id, filename, product_name, price, name, email]);
    res.redirect('/')
})

app.get('/likesProduct', async (req, res) => {
    const cards = await pool.query(`select likesuser_id, product_id, product_name, price, email as author_email, name as author_name, img from likes
                                    inner join userdate on userdate.id = likes.likesuser_id
                                    inner join products on products.id = likes.product_id
                                    where likes.thisuserid = ?`, [req.user.id]
    );
    console.log(cards[0])
    res.render('likesProduct.ejs', {
        ...req.user,
        likesProduct: cards[0]
    })
})


app.post('/likesProduct', async (req, res) => {
    const productuserId = req.body.productuserId;
    const productId = req.body.productId;
    const thisuserid = req.user.id;
    await pool.query(`insert into likes(likesuser_id, product_id, thisuserid) values(?,?,?)`, [productuserId, productId, thisuserid])
})

app.delete('/likesProduct', async (req, res) => {
    const { productId } = req.body;
    await pool.query(`delete from likes where thisuserid=? and product_id=?`, [req.user.id, productId]);// sa producti id a inc enq e likesi id
    res.send({
        likesProduct: true
    });
})

app.delete('/deleteSpecificProduct/:id', async (req, res) => {
    const productId = req.params.id;
    let imgSrc = await pool.query('select img from products where id = ?', [productId]);
    console.log(imgSrc[0][0].img)
    fs.unlinkSync(`views/images/upload/${imgSrc[0][0].img}`)
    await pool.query('delete from likes where product_id = ?', [productId]);
    await pool.query('delete from products where id = ?', [productId]);
    res.send(req.params.id);
})

function chakeNotAutocation(req, res, next) {
    if (req.isAuthenticated() === true) {
        return res.redirect('/');
    }
    next();
}

app.get('/logout', (req, res) => {
    req.logout(req.user, (err) => {
        if (err) return next(err);
        res.redirect('/login');
    });
});

// app.get('/porc', (req, res) => {
//     res.send('hello')
// })

app.post('/porc', (req, res) => {
    console.log(path.resolve(req.body.img));
    res.render('home.ejs', {
        src: path.resolve(req.body.img)
    })
})


app.use(chakeNotAutocation);

app.get('/login', (req, res) => {
    res.render('login.ejs', {})
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));


app.get('/register', (req, res) => {
    res.render('register.ejs', {
        emailBool: false,
        passwordBool: false,
        nameBool: false
    });
})

app.post('/register', async (req, res) => {
    // console.log(req.body);
    const { name, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password[0], 10);
    const findUser = await pool.query(`select * from userdate where email=?`, [email]);

    if (findUser[0].length === 0 && password[0] === password[1] && name.trim().length !== 0) {
        await pool.query('insert into userdate(name, email, password) values(?, ?, ?)', [name, email, hashPassword])
        res.redirect('/login')
    } else {
        console.log(findUser[0].length === 0)
        let emailBool = findUser[0].length === 0 ? false : true;
        let passwordBool = password[0] === password[1] ? false : true;
        let nameBool = name.trim().length !== 0 ? false : true;
        res.render('register.ejs', {
            name,
            email,
            password: password[0],
            emailBool,
            passwordBool,
            nameBool
        })
    }

})


app.listen(process.env.PORT || 8080, () => {
    console.log(`Your Server Listened ${process.env.PORT || 8080} This Port`);
})
