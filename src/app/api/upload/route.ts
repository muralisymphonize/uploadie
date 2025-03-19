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
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: "No files provided." },
        { status: 400 }
      );
    }

    const uploadedFiles: string[] = [];

    // Process each file and store in the upload directory
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filePath = path.join(uploadDir, file.name);
      await writeFile(filePath, buffer);

      uploadedFiles.push(file.name);
    }

    return NextResponse.json(
      { message: "Files uploaded successfully.", files: uploadedFiles },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { message: "Error uploading files." },
      { status: 500 }
    );
  }
}
