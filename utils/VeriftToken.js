import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token; 

  if (!token) {
    return res.json("You are not authenticated!"); 
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      return res.json("Token is not valid!"); 
    }

    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res,next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.json("You are Not authorized!");
    }
  });
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res,next, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        return res.json("You are Not authorized!");
      }
    });
  };