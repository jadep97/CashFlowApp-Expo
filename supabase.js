import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const extra =
  Constants.expoConfig?.extra ??
  Constants.manifest?.extra ??
  Constants.manifest2?.extra;

const supabaseUrl = extra?.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
