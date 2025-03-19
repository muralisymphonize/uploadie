import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { mkdir } from "fs";

const uploadDir = path.join(process.cwd(), "public/uploads");

// Ensure upload directory exists
const ensureUploadDir = async () => {
  return new Promise<void>((resolve, reject) => {
    mkdir(uploadDir, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating upload directory:", err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export async function POST(req: NextRequest) {
  try {
    await ensureUploadDir();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided." },
        { status: 400 }
      );
    }

    // Create buffer from file data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define file path to save
    const filePath = path.join(uploadDir, file.name);

    // Write file to local directory
    await writeFile(filePath, buffer);

    return NextResponse.json(
      { message: "File uploaded successfully.", fileName: file.name },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { message: "Error uploading file." },
      { status: 500 }
    );
  }
}
