import { NextResponse } from "next/server";
import { seedArticles } from "@/plugins/blog/lib/ai/seeder/seed"; // Updated import path

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await seedArticles();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in generate-articles:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
