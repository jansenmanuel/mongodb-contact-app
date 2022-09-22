const express = require('express')
const expressLayouts = require('express-ejs-layouts')

const { body, validationResult, check } = require('express-validator')
const methodOverride = require('method-override')

const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

require('./utils/db')
const Contact = require('./model/contact')

const app = express();
const port = 3000;

// Setup method override
app.use(methodOverride('_method'))

// Setup ejs and express layouts
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// Flash configuration
app.use(cookieParser('secret'))
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

const employees = [
    {
        name: 'Jansen Manuel',
        position: 'Front-end Developer'
    },
    {
        name: 'Jevist Etlfian',
        position: 'Front-end Developer'
    },
    {
        name: 'Muhammad Ihsan Aryandi',
        position: 'Back-end Developer'
    },
    {
        name: 'Kristianto',
        position: 'Back-end Developer'
    },
    {
        name: 'Bama Qyandija Deandra',
        position: 'Mobile Developer'
    },
    {
        name: 'Martinus Tri Nur Cahyono',
        position: 'Lead Developer'
    }
]

// Home Page
app.get('/', (req, res) => {
    res.render('index', {
        layout: 'layouts/main-layout',
        title: 'Home',
        employees
    })
})

// About Page
app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main-layout',
        title: 'About'
    })
})

// Contact Page
app.get('/contact', async (req, res) => {
    const contacts = await Contact.find()

    res.render('contact', {
        layout: 'layouts/main-layout',
        title: 'Contact',
        contacts,
        msg: req.flash('msg')
    })
})

// Add Contact Page
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        layout: 'layouts/main-layout',
        title: 'Add Contact',
    })
})

// Add Contact Action
app.post(
    '/contact',
    [
        body('name').custom(async (value) => {
            const duplicate = await Contact.findOne({ name: value })
            if (duplicate) {
                throw new Error('Name Already Exist!')
            }
            return true
        }),

        check('email', 'Invalid Email!').isEmail(),
        check('phone', 'Invalid Phone Number!').isMobilePhone('id-ID')
    ], (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render('add-contact', {
                layout: 'layouts/main-layout',
                title: 'Add Contact',
                errors: errors.array()
            })
        } else {
            Contact.insertMany(req.body,
                (error, result) => {
                    req.flash('msg', 'Contact successfully added!')
                    res.redirect('/contact')
                })
        }
    })

// Delete Contact Action
app.delete('/contact', (req, res) => {
    Contact.deleteOne({ _id: req.body._id })
        .then(result => {
            req.flash('msg', 'Contact successfully deleted!')
            res.redirect('/contact')
        })
})

// Edit Contact Page
app.get('/contact/edit/:_id', async (req, res) => {
    const contact = await Contact.findOne({ _id: req.params._id })
    if (!contact) {
        res.status(404)
        res.send('<h1>404</h1>')
    } else {
        res.render('edit-contact', {
            layout: 'layouts/main-layout',
            title: 'Edit Contact',
            contact
        })
    }
})

// Edit Contact Action
app.put(
    '/contact',
    [
        body('name').custom(async (value, { req }) => {
            const duplicate = await Contact.findOne({ name: value })
            if (value !== req.body.oldName && duplicate) {
                throw new Error('Name Already Exist!')
            }
            return true
        }),

        check('email', 'Invalid Email!').isEmail(),
        check('phone', 'Invalid Phone Number!').isMobilePhone('id-ID')
    ], (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render('edit-contact', {
                layout: 'layouts/main-layout',
                title: 'Edit Contact',
                errors: errors.array(),
                contact: req.body
            })
        } else {
            Contact.updateOne(
                { _id: req.body._id },
                {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        phone: req.body.phone
                    }
                }
            ).then(result => {
                req.flash('msg', 'Contact successfully updated!')
                res.redirect('/contact')
            })
        }
    })

// Detail Contact Page
app.get('/contact/:_id', async (req, res) => {
    const contact = await Contact.findOne({ _id: req.params._id })

    res.render('detail-contact', {
        layout: 'layouts/main-layout',
        title: 'Detail Contact',
        contact
    })
})

app.listen(port, () => console.log(`Server started on port http://localhost:${port}`));