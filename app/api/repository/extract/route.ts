import { NextResponse } from "next/server";

import {
  extractAcademicHierarchy,
} from "@/services/repository/source-extraction.service";

export const runtime = "nodejs";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE =
  20 * 1024 * 1024;

export async function POST(
  request: Request
) {
  try {
    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error:
            "Please upload a PDF or image.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !ALLOWED_TYPES.includes(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Supported formats: PDF, JPG, PNG and WEBP.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          error:
            "File size must be 20 MB or less.",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      "========================================"
    );

    console.log(
      "LEAP REPOSITORY SOURCE EXTRACTION"
    );

    console.log(
      "File:",
      file.name
    );

    console.log(
      "Type:",
      file.type
    );

    console.log(
      "Size:",
      file.size
    );

    console.log(
      "========================================"
    );

    const result =
      await extractAcademicHierarchy(
        file
      );

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(
      "Repository extraction failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Academic extraction failed.",
      },
      {
        status: 500,
      }
    );
  }
}