import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth].js";

export const getSession = async () => await getServerSession(authOptions)
