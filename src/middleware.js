import { sequence } from "astro:middleware";
import { supabase } from "./lib/supabase";

async function auth ({locals, cookies, redirect}, next) {    
    const accessToken = cookies.get("sb-access-token");
    const refreshToken = cookies.get("sb-refresh-token");
    
    if (!accessToken || !refreshToken) {
      locals.user = null
      return next();
    }
    
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value,
    });
    
    if (sessionError) {
      cookies.delete("sb-access-token", {
        path: "/",
      });
      cookies.delete("sb-refresh-token", {
        path: "/",
      });

      locals.user = null

    } else {
      const user = sessionData.user;

      // Fetch the profile data for the authenticated user
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

        if (profileError) {
          locals.user = user;
        } else {
          // Combine user and profile data into the locals.user object
          locals.user = {
            ...user,
            profile: profileData
          };
        }
    }

  // return a Response or the result of calling `next()`
  return next();
};

export const onRequest = sequence(auth);