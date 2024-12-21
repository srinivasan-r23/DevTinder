export const adminAuth = (req, res, next) => {
  console.log("logic of checking the admin Data");
  const token = "123";
  if (token) {
    next();
  } else {
    res.status(401).send("Youre not an admin");
  }
};

export const userAuth = (req, res, next) => {
  console.log("logic of checking the User Data");
  const token = "123";
  if (token) {
    next();
  } else {
    res.status(401).send("Youre not an user");
  }
};
