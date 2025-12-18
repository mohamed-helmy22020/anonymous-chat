import { JwtPayload } from "jsonwebtoken";
interface CustomJwtPayload extends JwtPayload {
    username: string;
}
