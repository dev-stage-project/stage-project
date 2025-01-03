import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyAccessToken, refreshAccessToken } from "@/app/lib/tokenManager";
import { createAuthSchema } from "@/app/validation";

dotenv.config();

const prisma = new PrismaClient();

// Replace with secure keys
const ACCESS_TOKEN_SECRET = process.env.ACCESS_JWT_SECRET || "fallback_secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_JWT_SECRET || "fallback_refresh_secret";
interface UserPayload {
  id: string;
  username: string;
  email: string;
  entity: string;
  isBanned: boolean;
  banReason: string[];
  banEndDate: Date;
}

type AuthenticatedEntity = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
  isBanned: boolean;
  banEndDate: Date | null;
  banReason: string[] | null;
  birthDate: Date | null;
};

export async function POST(req: Request) {
  try {
    const { email, password }: AuthenticatedEntity = await req.json();

    let user: AuthenticatedEntity | null = null;
    let isCompany: boolean = false;

    const { error } = createAuthSchema.validate(
      { email, password },
      { abortEarly: false }
    );

    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return new Response(JSON.stringify({ error: validationErrors }), {
        status: 400,
      });
    }

    // Search in the "user" table
    const foundUser = await prisma.user.findUnique({
      where: { email },
    });

    if (foundUser) {
      user = {
        id: foundUser.id,
        name: foundUser.username,
        email: foundUser.email,
        password: foundUser.password,
        role: foundUser.role,
        active: foundUser.active,
        birthDate: foundUser.birthDate,
        isBanned: foundUser.isBanned,
        banEndDate: foundUser.banEndDate,
        banReason: foundUser.banReason,
      };
    } else {
      // If not found, search in the "company" table
      const foundCompany = await prisma.company.findUnique({
        where: { email },
      });

      if (foundCompany) {
        user = {
          id: foundCompany.id,
          name: foundCompany.companyName,
          email: foundCompany.email,
          password: foundCompany.password,
          role: foundCompany.role,
          active: foundCompany.active,
          birthDate: foundCompany.birthDate,
          isBanned: foundCompany.isBanned,
          banEndDate: foundCompany.banEndDate,
          banReason: foundCompany.banReason,
        };
        isCompany = true; // Indicates that it is a company
      }
    }

    // If no user or company found, return an error
    if (!user) {
      return new Response(JSON.stringify({ error: "Email not found" }), {
        status: 404,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return new Response(JSON.stringify({ error: "Incorrect password" }), {
        status: 401,
      });
    }

    // Generate the access token
    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.name,
        email: user.email,
        role: user.role,
        entity: isCompany ? "company" : "user", // Add an entity indicator
        isBanned: user.isBanned,
        banReason: user.banReason,
        banEndDate: user.banEndDate,
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "3h" }
    );

    // Generate the refresh token
    const refreshToken = jwt.sign(
      {
        id: user.id,
        username: user.name,
        email: user.email,
        role: user.role,
        entity: isCompany ? "company" : "user",
        isBanned: user.isBanned,
        banReason: user.banReason,
        banEndDate: user.banEndDate,
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Create cookies
    const accessCookie = `access_token=${accessToken}; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=10800`; // 3h
    const refreshCookie = `refresh_token=${refreshToken}; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=604800`; // 7d

    // Respond with cookies and a success message
    return new Response(
      JSON.stringify({ message: "Login successful " + accessCookie }),
      {
        status: 200,
        headers: {
          "Set-Cookie": [accessCookie, refreshCookie].join(", "),
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      return new Response(
        JSON.stringify({ error: "Error during login: " + error.message }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ error: "Unknown error" }), {
      status: 500,
    });
  }
}

// function for refresh token if user is login
export async function GET(req: Request) {
  try {
    // Retrieve cookies from the request
    const cookie = req.headers.get("cookie");
    const accessToken = cookie
      ?.split(";")
      .find((c) => c.trim().startsWith("access_token="))
      ?.split("=")[1];
    const refreshToken = cookie
      ?.split(";")
      .find((c) => c.trim().startsWith("refresh_token="))
      ?.split("=")[1];
    console.log(accessToken);
    console.log(refreshToken);

    // Check authentication with the access token
    if (accessToken) {
      const user = verifyAccessToken(accessToken);

      if (user) {
        // If the access token is valid, return a response with the user's email
        return new NextResponse(
          JSON.stringify({
            message: "User authenticated",
            username: user.username,
            id: user.id,
            banEndDate: user.banEndDate,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        // If the access token is invalid or expired, try to refresh the token with the refresh token
        if (refreshToken) {
          return refreshAccessToken(refreshToken); // Use the existing function to refresh the token
        }

        // If no refresh token is available, return an error
        return new NextResponse(
          JSON.stringify({
            error: "Access token expired, and no refresh token available",
          }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } else {
      if (refreshToken) {
        const newAccessToken = refreshAccessToken(refreshToken);

        if (newAccessToken) {
          const user = verifyAccessToken(newAccessToken) as UserPayload | null;

          if (!user) {
            return new NextResponse(
              JSON.stringify({ error: "Invalid access token" }),
              {
                status: 401,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          // Créez la réponse avec les informations utilisateur
          const response = new NextResponse(
            JSON.stringify({
              message: "Token successfully refreshed",
              username: user.username,
              id: user.id,
              banEndDate: user.banEndDate || null, // Ajoutez une valeur par défaut
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );

          // Ajoutez le nouveau token dans les cookies
          response.cookies.set("access_token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600, // 1 heure
            sameSite: "strict",
            path: "/",
          });

          return response;
        } else {
          return new NextResponse(
            JSON.stringify({ error: "Invalid or expired refresh token" }),
            {
              status: 401,
              headers: { "Content-Type": "application/json" },
            }
          );
        } // Use the existing function to refresh the token
      }
    }

    // If no access token is found, return an error
    return new NextResponse(
      JSON.stringify({ message: "User not authenticated" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error during authentication check:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to check authentication" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
