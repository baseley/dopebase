import { NextResponse } from "next/server";
import { seedArticleIdeas } from "@/plugins/blog/lib/ai/seeder/seed"; // Updated import path
import { findOne } from "@/core/db"; // Updated import path

export async function POST(req: Request) {
  try {
    const { prompt, category } = await req.json();
    const topic = (await findOne("settings", { name: "description" }))?.value ?? "general topic";

    await seedArticleIdeas(prompt, topic, category);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in generate-ideas:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
