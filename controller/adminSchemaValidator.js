import Ajv from 'ajv'
import addFormats from "ajv-formats"

const ajv = new Ajv()
addFormats(ajv)

//The schema for adding a new user
const newUserSchema = {
    type: "object",
    properties: {
        primaryEmail: { type: "string", format: "email" },
        secondaryEmail: { type: "string", format: "email" },
        phoneNumber: { type: "string", pattern: "^[0-9]{6,}$" },
        apiKey: { type: "string", minLength: 10 },
        maxPaths: { type: "integer" },
    },
    required: ["primaryEmail", "apiKey", "maxPaths"],
    additionalProperties: false,
}

//The schema for deleting a user
const deleteUserSchema = {
    type: "object",
    properties: {
        primaryEmail: { type: "string", format: "email" }
    },
    required: ["primaryEmail"],
    additionalProperties: false,
}

//The schema for updating a user
const updateUserSchema = {
    type: "object",
    properties: {
        primaryEmail: { type: "string", format: "email" },
        apiKey: { type: "string", minLength: 10 },
        maxPaths: { type: "integer" },
        userActive: { type: "integer" },
    },
    required: ["primaryEmail"],
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