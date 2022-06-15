import Joi from "joi";
export const schema = {
  name: Joi.string().min(3).required().label("Name"),
  username: Joi.string().min(3).required().label("Username"),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .label("Email"),
  password: Joi.string().min(6).required().label("Password"),
};
// export const schemaObj = Joi.object({schema})
export const schemaObj = Joi.object(schema);
