import { pinata } from "@/app/lib/config";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    // Upload file to Pinata
    const { cid } = await pinata.upload.public.file(file);
    
    // Generate signed URL
    const signedUrl = await pinata.gateways.public.convert(cid);
    return NextResponse.json({signedUrl, cid}, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}