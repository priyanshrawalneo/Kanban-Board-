
import Joi from "joi";
export const schema = { 
  name: Joi.string().min(3).required().label('Name'),
  stage: Joi.number().required().label('Stage'),
  priority: Joi.string().required().label('Priority'),
  deadline: Joi.date().required().label('Deadline'),

};
// export const schemaObj = Joi.object({schema})
export const schemaObj = Joi.object(schema
  )

 
