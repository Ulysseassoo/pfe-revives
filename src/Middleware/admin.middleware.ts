import { Request, Response, NextFunction } from "express";
import { UserRole } from "../Inteface/User";


const adminMiddleware = async (
    req: Request,
	res: Response,
	next: NextFunction,
) => {
    // Check if user is authenticated and has admin role
    if (req.user && req.user !== null && req.user.role === UserRole.ADMIN) {
      next(); // User is authorized, proceed to next middleware or route
    } else {
      res.status(403).json({
        status: 403,
        message: 'Access denied.',
      });
    }
  };
  
export default adminMiddleware;