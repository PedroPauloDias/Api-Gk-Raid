import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"
export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10)
    await connectMongoDB();
    await User.create({name, email , password: hashedPassword});

    return NextResponse.json(
      { message: "Usuário cadastrado" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);

    return NextResponse.json(
      { message: "Ocorreu um erro ao cadastrar o usuário" },
      { status: 500 }
    );
  }
}

