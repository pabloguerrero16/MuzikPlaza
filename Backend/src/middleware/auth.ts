import { NextFunction, Request, Response } from "express-serve-static-core";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["auth_token"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.userId = (decoded as JwtPayload).userId;
    next();
  } catch (Error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.rol != "Admin") {
      return res
        .status(403)
        .json({ message: "You don't have permission to visit this page" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export { verifyToken, checkAdmin };
