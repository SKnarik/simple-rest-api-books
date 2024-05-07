import Joi from "joi";

export const bookValidationSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  genre: Joi.string().required(),
  year_published: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear()),
  rating: Joi.number().min(0).max(10),
  summary: Joi.string().required(),
});
