import express from 'express'
import {config} from '../controller/config.js'
import {validateNewUser} from '../controller/schemaValidator.js'
import {user} from '../models/user.js'

const router = express.Router()
const adminSecretValue = config.adminSecretValue

//add a new user
router.post('/user', async function(req,res) {
    const schemaOutcome = validateNewUser(req.body)

    if (schemaOutcome) {
        try {
            await user.create({
                ...req.body
            })
        } catch (error) {
            //Check for PostgreSQL duplicate key error (error code 23505)
            if (error.name === 'SequelizeUniqueConstraintError' || error.original.code === '23505') {
                return res.status(400).send('Duplicate key error: A user with this email and domain already exists.')
            }
            //Handle other errors
            return res.status(500).send('An error occurred');
        }
        return res.status(200).send(`User created`)
    } else {
        return res.status(422).send(`Schema is bad`)
    }
})

//delete a user
// router.post('/user', async function(req,res) {
//     return res.status(200).send(`user post ${adminSecretValue}`)
// })

// //update a user
// router.post('/user', async function(req,res) {
//     return res.status(200).send(`user post ${adminSecretValue}`)
// })

export {router}