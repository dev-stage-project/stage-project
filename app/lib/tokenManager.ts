import jwt from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";

interface UserPayload {
  id: string;
  email: string;
  entity: string;
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_JWT_SECRET || "fallback_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_JWT_SECRET || "fallback_refresh_secret";

export function verifyAccessToken(
  token: string | undefined
): UserPayload | null {
  try {
    return token
      ? (jwt.verify(token, ACCESS_TOKEN_SECRET) as UserPayload)
      : null;
  } catch {
    return null;
  }
}

export function generateAccessToken(user: UserPayload): string {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
}

export function refreshAccessToken(refreshToken: string): string | null {
  try {
    // Verify and decode the refresh token
    const user = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as UserPayload;

    // Generate a new access token
    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      entity: user.entity
    });

    // Create the response with the new access token (if needed elsewhere)
    const response = new NextResponse(
      JSON.stringify({
        email: user.email,
        message: "Token successfully refreshed",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

    // Set the cookie with the new access token
    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hour
      sameSite: "strict",
      path: "/",
    });

    // Return the new access token
    return newAccessToken;
  } catch (error) {
    // Log the error and return null in case of an invalid or expired token
    console.error("Error during token refresh:", error);
    return null;
  }
}



export async function getTokenFromCookies(req: Request): Promise<string | null> {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => c.split("=").map(decodeURIComponent))
  );

  let accessToken = cookies.access_token || null;
  const refreshToken = cookies.refresh_token || null;

  if (!accessToken && refreshToken) {
    // Tentative de rafraîchissement de l'access token
    console.log("Access token manquant, tentative de rafraîchissement...");
    accessToken = refreshAccessToken(refreshToken);

    if (!accessToken) {
      console.error("Erreur lors du rafraîchissement de l'access token");
      return null;
    }
  }

  return accessToken;
}


export async function getUserFromRequest(req: NextRequest): Promise<{ id: string; entity: 'user' | 'company' }> {
  let accessToken = req.cookies.get('access_token')?.value ?? undefined; // Transforme null en undefined
  const refreshToken = req.cookies.get('refresh_token')?.value ?? undefined;

  if (!accessToken) {
    console.log('Access token manquant, tentative de rafraîchissement avec le refresh token.');

    if (!refreshToken) {
      throw new Error('Access token et refresh token manquants');
    }

    const newAccessToken = await refreshAccessToken(refreshToken);

    if (!newAccessToken) {
      throw new Error('Échec du rafraîchissement de l\'access token');
    }

    accessToken = newAccessToken;

    if (!accessToken) {
      throw new Error('Échec du rafraîchissement de l\'access token');
    }

    const response = NextResponse.next();
    response.cookies.set('access_token', accessToken, { httpOnly: true, secure: true });
  }

  try {
    const decodedToken = verifyAccessToken(accessToken);

    if (!decodedToken) {
      throw new Error('Access token invalide');
    }

    const { id, entity } = decodedToken as { id: string; entity: 'user' | 'company' };
    if (!id || !entity) {
      throw new Error('Payload du token invalide');
    }

    return { id, entity };
  } catch (error) {
    console.error('Erreur avec l\'access-token:', error);

    // Gestion d'un access-token expiré avec le refresh-token
    if (error instanceof Error && error.message.includes('expiré') && refreshToken) {
      console.log('Access token expiré, tentative de rafraîchissement avec le refresh token.');

      const newAccessToken = await refreshAccessToken(refreshToken);

      if (!newAccessToken) {
        throw new Error('Échec du rafraîchissement de l\'access token après expiration');
      }

      const decodedToken = verifyAccessToken(newAccessToken);

      if (!decodedToken) {
        throw new Error('Nouveau token invalide');
      }

      const { id, entity } = decodedToken as { id: string; entity: 'user' | 'company' };
      if (!id || !entity) {
        throw new Error('Payload du nouveau token invalide');
      }

      // Mise à jour du cookie avec le nouveau token
      const response = NextResponse.next();
      response.cookies.set('access_token', newAccessToken, { httpOnly: true, secure: true });

      return { id, entity };
    }

    throw new Error('Access token invalide ou rafraîchissement impossible');
  }
}
