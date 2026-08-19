import {
  createServerClient,
} from "@supabase/ssr";

import {
  NextResponse,
  type NextRequest,
} from "next/server";

export async function updateSession(
  request: NextRequest
) {
  let response = NextResponse.next({
    request,
  });

  const supabase =
    createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(cookiesToSet) {
            cookiesToSet.forEach(
              ({ name, value }) => {
                request.cookies.set(
                  name,
                  value
                );
              }
            );

            response =
              NextResponse.next({
                request,
              });

            cookiesToSet.forEach(
              ({ name, value, options }) => {
                response.cookies.set(
                  name,
                  value,
                  options
                );
              }
            );
          },
        },
      }
    );

  /*
   * IMPORTANT:
   *
   * Do not remove this getUser() call.
   * It refreshes the Supabase authentication
   * session when required.
   */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /*
   * Student protection
   *
   * If a student tries to access the student
   * dashboard without a valid session,
   * send them to Student Login.
   */

  const pathname =
    request.nextUrl.pathname;

  if (
    pathname.startsWith(
      "/student/dashboard"
    ) ||
    pathname.startsWith(
      "/student/results"
    )
  ) {
    if (!user) {
      const loginUrl =
        request.nextUrl.clone();

      loginUrl.pathname =
        "/student/login";

      return NextResponse.redirect(
        loginUrl
      );
    }
  }

  /*
   * Teacher protection
   */

  if (
    pathname.startsWith(
      "/teacher/dashboard"
    ) ||
    pathname.startsWith(
      "/teacher/assessment"
    ) ||
    pathname.startsWith(
      "/teacher/repository"
    ) ||
    pathname.startsWith(
      "/teacher/students"
    ) ||
    pathname.startsWith(
      "/teacher/settings"
    )
  ) {
    if (!user) {
      const loginUrl =
        request.nextUrl.clone();

      loginUrl.pathname =
        "/teacher/login";

      return NextResponse.redirect(
        loginUrl
      );
    }
  }

  /*
   * Return the response with the
   * refreshed Supabase cookies.
   */

  return response;
}