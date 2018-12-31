const express = require('express');
const router = express.Router()
const Users = require('../models/users');
const jwt = require('jsonwebtoken');
// connect to DB
const mongoose = require('mongoose')
const db = "mongodb://<UserName>:<UserEmail>.mlab.com:27594/userdetail"

mongoose.connect(db, err => {
    if (err) {
        console.log('error' + err);
    } else {
        console.log('db connected successfully')
    }
})

function verifyToken(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send('unarthorized requset')
    }
    let token =req.headers.authorization.split(' ')[1]
    if( token === 'null'){
        return res.status(401).send('unarthorized requset')
    }
    let payload = jwt.verify(token,'Token')
    if(!payload){
        return res.status(401).send('unarthorized requset')
    }
    req.userId = payload.subject
    next()
}

// router module
router.get('/', (req, res) => {
    res.send('API is working')
})

// Resgisted user Login To DB

router.post('/register', (req, res) => {
    let userData = req.body
    let user = new Users(userData)

    user.save((error, registeredUser) => {
        if (error) {
            console.log('error');
        } else {
            let payload = { subject: registeredUser._id }
            let token = jwt.sign(payload, 'Token')
            res.status(200).send({ token })
        }
    })
})

// User Login

router.post('/login', (req, res) => {
    let userData = req.body
    Users.findOne({ email: userData.email }, (error, user) => {
        if (error) {
            console.log('error')
        } else {
            if (!user) {
                res.status(401).send('Invalid Email')
            } else {
                if (user.password != userData.password) {
                    res.status(401).send('Invalid Password')
                } else {
                    let payload = { subject: user._id }
                    let token = jwt.sign(payload, 'Token')
                    res.status(200).send({token})
                }
            }

        }
    })
});

router.get('/evants', verifyToken,(req, res) => {
    let evants = [
        {
            "id": 1,
            "name": "karthick",
            "domain": "mean stack developer"
        },
        {
            "id": 2,
            "name": "ram",
            "domain": "ios developer"
        },
        {
            "id": 3,
            "name": "nigil",
            "domain": "ios developer"
        },
        {
            "id": 4,
            "name": "dilip",
            "domain": "andriod developer"
        },
        {
            "id": 4,
            "name": "aswin",
            "domain": "andriod developer"
        }

    ]
    res.json(evants)
})

module.exports = router