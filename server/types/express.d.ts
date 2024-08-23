import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      parsingTime?: number;
      routingTime?: number;
    }
  }
}
