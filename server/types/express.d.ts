import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      receivedTime?: number;
      parsingTime?: number;
      routingTime?: number;
    }
  }
}
