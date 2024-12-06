import Ajv from 'ajv'
import addFormats from "ajv-formats"

const ajv = new Ajv()
addFormats(ajv)

//the schema of of adding a new user
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

//function to call from other classes or files
function validateNewUser (data) {
    const validate = ajv.compile(newUserSchema)
    const valid = validate(data)
    return valid
}

export {validateNewUser}