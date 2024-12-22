import validator from "validator";

export const validateSignUpData = (req) => {
  const { email, password, firstName, lastName } = req.body;
  if (!firstName?.trim() || !lastName?.trim())
    throw new Error("Name must not be empty!!");
  if (email.trim() === "") {
    throw new Error("Email must not be empty");
  } else if (!validator.isEmail(email)) {
    throw new Error("Must be a valid email address");
  }
  if (password === "") {
    throw new Error("Password must not be empty");
  }
};
