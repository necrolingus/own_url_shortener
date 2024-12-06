import Ajv from 'ajv'
import addFormats from "ajv-formats"

const ajv = new Ajv()
addFormats(ajv)

//The schema for adding a new user
const newUserSchema = {
    type: "object",
    properties: {
        primaryEmail: { type: "string", format: "email" },
        secondayEmail: { type: "string", format: "email" },
        phoneNumber: { type: "string", pattern: "^[0-9]{6,}$" },
        apiKey: { type: "string", minLength: 10 },
        domain: { type: "string", format: "hostname" },
        maxUrls: { type: "integer" },
    },
    required: ["primaryEmail", "apiKey", "domain", "maxUrls"],
    additionalProperties: false,
}

//The schema for deleting a user
const deleteUserSchema = {
    type: "object",
    properties: {
        primaryEmail: { type: "string", format: "email" },
        domain: { type: "string", format: "hostname" }
    },
    required: ["primaryEmail", "domain"],
    additionalProperties: false,
}

//The schema for updating a new user
const updateUserSchema = {
    type: "object",
    properties: {
        primaryEmail: { type: "string", format: "email" },
        apiKey: { type: "string", minLength: 10 },
        domain: { type: "string", format: "hostname" },
        maxUrls: { type: "integer" },
        userActive: { type: "integer" },
    },
    required: ["primaryEmail", "domain"],
    additionalProperties: false,
}

//Validate the new user data
function validateNewUser (data) {
    const validate = ajv.compile(newUserSchema)
    const valid = validate(data)
    return valid
}

//Validate the delete user data
function validateDeleteUser (data) {
    const validate = ajv.compile(deleteUserSchema)
    const valid = validate(data)
    return valid
}

//Validate the update user data
function validateUpdateUser (data) {
    const validate = ajv.compile(updateUserSchema)
    const valid = validate(data)
    return valid
}

export {validateNewUser, validateDeleteUser, validateUpdateUser}