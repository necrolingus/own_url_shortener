import express from 'express'
import {config} from '../controller/config.js'

const router = express.Router()
const adminSecretValue = config.adminSecretValue

//add a new user
router.post('/user', async function(req,res) {
    console.log(req.body)
    return res.status(200).send(`user post ${adminSecretValue}`)
})

//delete a user
router.post('/user', async function(req,res) {
    return res.status(200).send(`user post ${adminSecretValue}`)
})

//update a user
router.post('/user', async function(req,res) {
    return res.status(200).send(`user post ${adminSecretValue}`)
})

export {router}