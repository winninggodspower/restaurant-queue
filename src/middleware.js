import { sequence } from "astro:middleware";
import { supabase } from "./lib/supabase";

async function auth ({locals, cookies, redirect}, next) {    
    const accessToken = cookies.get("sb-access-token");
    const refreshToken = cookies.get("sb-refresh-token");
    
    if (!accessToken || !refreshToken) {
      locals.user = null
      return next();
    }
    
    const { data, error } = await supabase.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value,
    });
    
    if (error) {
      cookies.delete("sb-access-token", {
        path: "/",
      });
      cookies.delete("sb-refresh-token", {
        path: "/",
      });

      locals.user = null
    } else {
      locals.user = data.user;
    }

  // return a Response or the result of calling `next()`
  return next();
};

export const onRequest = sequence(auth);