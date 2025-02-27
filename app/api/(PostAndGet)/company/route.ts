'use server';

import { PrismaClient, Company } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createCompanySchema } from "@/app/validation";
const prisma = new PrismaClient();

// interface CompanyData {
//   companyName: string;
//   password: string;
//   email: string;
//   companyNumber: string;
//   birthDate: string;
//   city: string;
//   country: string;
//   street: string;
// }

export async function GET() {
  try {
    const companys = await prisma.company.findMany();
    return new Response(JSON.stringify(companys), { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      return new Response("Error fetching users: " + error.message, {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ error: `Erreur serveur ${error}` }), {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const requestBody = await req.json();
    // Vérifiez ce qui est envoyé

    const {
      companyName,
      password,
      email,
      companyNumber,
      birthDate,
      city,
      country,
      street
    }: Company = requestBody;

    // Vérification des champs obligatoires
    if (!companyName || !password || !email || !companyNumber || !birthDate || !street) {
      return new Response("Missing required fields", { status: 400 });
    }

    const foundUser = await prisma.user.findUnique({
      where: { email },
    });
    if (foundUser) {
      return new Response(
        JSON.stringify({ error: "this email is already used" }),
        {
          status: 404,
        }
      );
    }

    const { error } = createCompanySchema.validate(
      { companyName, password, email, companyNumber, birthDate, city, country, street },
      { abortEarly: false }
    );

    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return new Response(JSON.stringify({ error: validationErrors }), {
        status: 400,
      });
    }
    // Hachage du mot de passe avant de le stocker dans la base de données
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(requestBody);
    // Créer une nouvelle company dans la base de données
    const newCompany: Company = await prisma.company.create({
      data: {
        companyName,
        password: hashedPassword,
        email,
        companyNumber,
        birthDate: new Date(birthDate), // Convertir birthDate en objet Date
        city,
        country,
        street
      },
    });

    // Réponse avec la company créé
    return new Response(JSON.stringify(newCompany), { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      return new Response("Error creating user: " + error.message, {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ error: "Erreur inconnue" }), {
      status: 500,
    });
  }
}
