import Joi from "joi";
import * as countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

// Charger les traductions (optionnel, ici en anglais)
countries.registerLocale(en);

// Récupérer la liste des codes pays valides
const validCountries = Object.keys(countries.getAlpha2Codes());

export const createUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).trim().required().messages({
    "string.min": "Username must be at least 3 characters long.",
    "string.max": "Username must not exceed 30 characters.",
    "any.required": "The 'username' field is required.",
  }),
  password: Joi.string().min(6).trim().required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "any.required": "The 'password' field is required.",
  }),
  firstName: Joi.string().min(2).max(50).trim().required().messages({
    "string.min": "First name must be at least 2 characters long.",
    "string.max": "First name must not exceed 50 characters.",
    "any.required": "The 'firstName' field is required.",
  }),
  lastName: Joi.string().min(2).max(50).trim().required().messages({
    "string.min": "Last name must be at least 2 characters long.",
    "string.max": "Last name must not exceed 50 characters.",
    "any.required": "The 'lastName' field is required.",
  }),
  email: Joi.string().email().trim().required().messages({
    "string.email": "Email must be a valid email address.",
    "any.required": "The 'email' field is required.",
  }),
  birthDate: Joi.date().optional().messages({
    "date.base": "Birth date must be a valid date.",
  }),
  city: Joi.string().trim().min(3).max(100).required().messages({
    "string.min": "City must be at least 3 characters long.",
    "string.max": "City must not exceed 100 characters.",
    "any.required": "The 'city' field is required.",
  }),
  country: Joi.string()
    .trim()
    .valid(...validCountries)
    .required()
    .messages({
      "any.required": "The 'country' field is required.",
      "any.only": "The 'country' field must be a valid ISO country code.",
    }),
});

export const createCompanySchema = Joi.object({
  companyName: Joi.string().min(3).max(30).trim().required().messages({
    "string.min": "Company name must be at least 3 characters long.",
    "string.max": "Company name must not exceed 30 characters.",
    "any.required": "The 'company name' field is required.",
  }),
  password: Joi.string().min(6).trim().required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "any.required": "The 'password' field is required.",
  }),
  email: Joi.string().email().trim().required().messages({
    "string.email": "Email must be a valid email address.",
    "any.required": "The 'email' field is required.",
  }),
  companyNumber: Joi.string()
    .pattern(/^[A-Za-z0-9\-]+$/)  // Remplace cette regex par celle correspondant à ton format de numéro d'entreprise
    .trim()
    .required()
    .messages({
      "string.pattern.base": "The 'companyNumber' must be a valid company number.",
      "any.required": "The 'companyNumber' field is required."
    }),
  birthDate: Joi.date().optional().messages({
    "date.base": "Birth date must be a valid date.",
  }),
  city: Joi.string().trim().min(3).max(100).required().messages({
    "string.min": "City must be at least 3 characters long.",
    "string.max": "City must not exceed 100 characters.",
    "any.required": "The 'city' field is required.",
  }),
  country: Joi.string()
    .trim()
    .valid(...validCountries)
    .required()
    .messages({
      "any.required": "The 'country' field is required.",
      "any.only": "The 'country' field must be a valid ISO country code.",
    }),
  street: Joi.string().trim().min(3).max(255).required().messages({
    "string.min": "Street must be at least 3 characters long.",
    "string.max": "Street must not exceed 255 characters.",
    "any.required": "The 'street' field is required.",
  }),
});

export const createAuthSchema = Joi.object({
  email: Joi.string().email().trim().required().messages({
    "string.email": "Email must be a valid email address.",
    "any.required": "The 'email' field is required.",
  }),
  password: Joi.string().min(6).trim().required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "any.required": "The 'password' field is required.",
  }),
});

export const createSubCategorieSchema = Joi.object({
  name: Joi.string().min(3).max(30).trim().required().messages({
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name must not exceed 30 characters.",
    "any.required": "The 'name' field is required.",
  }),
  description: Joi.string().min(6).max(30).trim().required().messages({
    "string.min": "Description must be at least 6 characters long.",
    "string.max": "Description must not exceed 30 characters.",
    "any.required": "The 'description' field is required.",
  }),
  type: Joi.string().min(3).max(30).trim().required().messages({
    "string.min": "Type must be at least 3 characters long.",
    "string.max": "Type must not exceed 30 characters.",
    "any.required": "The 'type' field is required.",
  }),
});

export const messageSchema = Joi.object({
  senderId: Joi.string().uuid().required().messages({
    "string.uuid": "Sender ID must be a valid UUID.",
    "any.required": "Sender ID is required.",
  }),
  receiverId: Joi.string().uuid().required().messages({
    "string.uuid": "Receiver ID must be a valid UUID.",
    "any.required": "Receiver ID is required.",
  }),
  content: Joi.string().min(1).required().messages({
    "string.min": "Content must not be empty.",
    "any.required": "Content is required.",
  }),
  read: Joi.boolean().default(false).optional().messages({
    "boolean.base": "Read must be a boolean.",
  }),
});

export const vehicleSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.min": "Title must be at least 3 characters long.",
    "string.max": "Title must not exceed 100 characters.",
    "any.required": "The 'title' field is required.",
  }),
  description: Joi.string().min(3).max(500).required().messages({
    "string.min": "Description must be at least 3 characters long.",
    "string.max": "Description must not exceed 500 characters.",
    "any.required": "The 'description' field is required.",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a valid number.",
    "number.positive": "Price must be a positive number.",
    "any.required": "The 'price' field is required.",
  }),
  city: Joi.string().min(3).max(100).required().messages({
    "string.min": "City must be at least 3 characters long.",
    "string.max": "City must not exceed 100 characters.",
    "any.required": "The 'city' field is required.",
  }),
  country: Joi.string().min(2).max(100).required().messages({
    "string.min": "Country must be at least 2 characters long.",
    "string.max": "Country must not exceed 100 characters.",
    "any.required": "The 'country' field is required.",
  }),
  model: Joi.string().min(2).max(50).required().messages({
    "string.min": "Model must be at least 2 characters long.",
    "string.max": "Model must not exceed 50 characters.",
    "any.required": "The 'model' field is required.",
  }),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required()
    .messages({
      "number.base": "Year must be a valid number.",
      "number.min": "Year must be at least 1900.",
      "number.max": `Year must not exceed the current year (${new Date().getFullYear()}).`,
      "any.required": "The 'year' field is required.",
    }),
  mileage: Joi.number().integer().min(0).required().messages({
    "number.base": "Mileage must be a valid number.",
    "number.min": "Mileage must be a positive number.",
    "any.required": "The 'mileage' field is required.",
  }),
  fuelType: Joi.string()
    .valid("Petrol", "Diesel", "Electric", "Hybrid")
    .required()
    .messages({
      "string.valid":
        "Fuel type must be one of 'Petrol', 'Diesel', 'Electric', or 'Hybrid'.",
      "any.required": "The 'fuelType' field is required.",
    }),
  color: Joi.string().min(3).max(30).required().messages({
    "string.min": "Color must be at least 3 characters long.",
    "string.max": "Color must not exceed 30 characters.",
    "any.required": "The 'color' field is required.",
  }),
  transmission: Joi.string().valid("Manual", "Automatic").required().messages({
    "string.valid": "Transmission must be either 'Manual' or 'Automatic'.",
    "any.required": "The 'transmission' field is required.",
  }),
  subCategoryId: Joi.number().integer().required().messages({
    "number.base": "SubCategory ID must be a valid number.",
    "any.required": "The 'subCategory' field is required.",
  }),
  userId: Joi.string().uuid().optional().messages({
    "string.uuid": "User ID must be a valid UUID.",
  }),
  companyId: Joi.string().uuid().optional().messages({
    "string.uuid": "Company ID must be a valid UUID.",
  }),
});

export const propertySchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.min": "Title must be at least 3 characters long.",
    "string.max": "Title must not exceed 100 characters.",
    "any.required": "The 'title' field is required.",
  }),
  description: Joi.string().max(500).optional().messages({
    "string.max": "Description must not exceed 500 characters.",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a valid number.",
    "number.positive": "Price must be a positive number.",
    "any.required": "The 'price' field is required.",
  }),
  city: Joi.string().min(3).max(100).required().messages({
    "string.min": "City must be at least 3 characters long.",
    "string.max": "City must not exceed 100 characters.",
    "any.required": "The 'city' field is required.",
  }),
  country: Joi.string().min(2).max(100).required().messages({
    "string.min": "Country must be at least 2 characters long.",
    "string.max": "Country must not exceed 100 characters.",
    "any.required": "The 'country' field is required.",
  }),
  propertyType: Joi.string()
    .valid("Apartment", "House", "Studio", "Villa", "Commercial")
    .required()
    .messages({
      "string.valid":
        "Property type must be one of 'Apartment', 'House', 'Studio', 'Villa', or 'Commercial'.",
      "any.required": "The 'propertyType' field is required.",
    }),
  surface: Joi.number().positive().required().messages({
    "number.base": "Surface must be a valid number.",
    "number.positive": "Surface must be a positive number.",
    "any.required": "The 'surface' field is required.",
  }),
  rooms: Joi.number().integer().min(1).required().messages({
    "number.base": "Rooms must be a valid number.",
    "number.min": "There must be at least 1 room.",
    "any.required": "The 'rooms' field is required.",
  }),
  furnished: Joi.boolean().required().messages({
    "any.required": "The 'furnished' field is required.",
  }),
  subCategoryId: Joi.number().integer().optional().messages({
    "number.base": "SubCategory ID must be a valid number.",
  }),
  userId: Joi.string().uuid().optional().messages({
    "string.uuid": "User ID must be a valid UUID.",
  }),
  companyId: Joi.string().uuid().optional().messages({
    "string.uuid": "Company ID must be a valid UUID.",
  }),
});

export const commercialOfferSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.min": "Title must be at least 3 characters long.",
    "string.max": "Title must not exceed 100 characters.",
    "any.required": "The 'title' field is required.",
  }),
  description: Joi.string().max(500).optional().messages({
    "string.max": "Description must not exceed 500 characters.",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a valid number.",
    "number.positive": "Price must be a positive number.",
    "any.required": "The 'price' field is required.",
  }),
  city: Joi.string().min(3).max(100).required().messages({
    "string.min": "City must be at least 3 characters long.",
    "string.max": "City must not exceed 100 characters.",
    "any.required": "The 'city' field is required.",
  }),
  country: Joi.string().min(2).max(100).required().messages({
    "string.min": "Country must be at least 2 characters long.",
    "string.max": "Country must not exceed 100 characters.",
    "any.required": "The 'country' field is required.",
  }),
  createdAt: Joi.date().optional().messages({
    "date.base": "CreatedAt must be a valid date.",
  }),
  updatedAt: Joi.date().optional().messages({
    "date.base": "UpdatedAt must be a valid date.",
  }),
  commercialType: Joi.string()
    .valid("Product", "Service", "Other")
    .required()
    .messages({
      "string.valid":
        "Commercial type must be one of 'Product', 'Service', or 'Other'.",
      "any.required": "The 'commercialType' field is required.",
    }),
  duration: Joi.number().integer().min(1).optional().messages({
    "number.base": "Duration must be a valid number.",
    "number.min": "Duration must be at least 1 day.",
  }),
  subCategoryId: Joi.number().integer().optional().messages({
    "number.base": "SubCategory ID must be a valid number.",
  }),
  userId: Joi.string().uuid().optional().messages({
    "string.uuid": "User ID must be a valid UUID.",
  }),
  companyId: Joi.string().uuid().optional().messages({
    "string.uuid": "Company ID must be a valid UUID.",
  }),
});


const ReporterTypeEnum = Joi.string().valid("user", "company").required();

export const reportSchema = Joi.object({
  reason: Joi.string().min(3).max(500).required().messages({
    "string.min": "Reason must be at least 3 characters long.",
    "string.max": "Reason must not exceed 500 characters.",
    "any.required": "The 'reason' field is required.",
  }),
  createdAt: Joi.date().optional().messages({
    "date.base": "CreatedAt must be a valid date.",
  }),
  status: Joi.string().valid("pending", "resolved", "rejected").default("pending").required().messages({
    "string.valid": "Status must be one of 'pending', 'resolved', or 'rejected'.",
    "any.required": "The 'status' field is required.",
  }),
  vehicleOfferId: Joi.number().integer().optional().messages({
    "number.base": "Vehicle offer ID must be a valid number.",
  }),
  realEstateOfferId: Joi.number().integer().optional().messages({
    "number.base": "Real estate offer ID must be a valid number.",
  }),
  commercialOfferId: Joi.number().integer().optional().messages({
    "number.base": "Commercial offer ID must be a valid number.",
  }),
  reporterId: Joi.string().uuid().required().messages({
    "string.uuid": "Reporter ID must be a valid UUID.",
    "any.required": "The 'reporterId' field is required.",
  }),
  reporterType: ReporterTypeEnum.messages({
    "any.required": "The 'reporterType' field is required.",
  }),
});
