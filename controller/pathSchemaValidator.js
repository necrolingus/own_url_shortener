import Ajv from 'ajv'
import addFormats from "ajv-formats"

const ajv = new Ajv()
addFormats(ajv)

//The schema for adding a new path
const newPathSchema = {
    type: "object",
    properties: {
        path: { type: "string", maxLength: 8 },
        redirect: { type: "integer", enum: [301, 302] },
        destination: { type: "string", format: "uri" },
        expireDays: { type: "integer" },
    },
    required: ["path", "redirect", "destination", "expireDays"],
    additionalProperties: false,
}

//The schema for deleting a path
const deletePathSchema = {
    type: "object",
    properties: {
        path: { type: "string" }
    },
    required: ["path"],
    additionalProperties: false,
}

//The schema for updating a path
const updatePathSchema = {
    type: "object",
    properties: {
        path: { type: "string", maxLength: 8 },
        redirect: { type: "integer", enum: [301, 302] },
        destination: { type: "string", format: "uri" },
        expireDays: { type: "integer" },
        pathActive: { type: "integer" },
    },
    required: ["path"],
    additionalProperties: false,
}

//Validate the new path data
function validateNewPath (data) {
    const validate = ajv.compile(newPathSchema)
    const valid = validate(data)
    return valid
}

//Validate the delete path data
function validateDeletePath (data) {
    const validate = ajv.compile(deletePathSchema)
    const valid = validate(data)
    return valid
}

//Validate the update path data
function validateUpdatePath (data) {
    const validate = ajv.compile(updatePathSchema)
    const valid = validate(data)
    return valid
}

export {validateNewPath, validateDeletePath, validateUpdatePath}