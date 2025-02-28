// src/types/express/index.d.ts

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: ObjectId;
        username: string;
        email: string;
      };
    }
  }
}
import { ObjectId } from 'mongoose';
// src/types/express.d.ts
import { JwtPayload } from '@services/auth';  // Adjust this if needed

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; // Attach 'user' property to Request type
    }
  }
}
