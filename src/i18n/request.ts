import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { getMessages } from "@/lib/content-api";
import itMessages from "../../messages/it.json";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "it")) {
    locale = routing.defaultLocale;
  }

  let messages: Record<string, unknown>;
  try {
    messages = await getMessages(locale);
  } catch {
    messages = itMessages as Record<string, unknown>;
  }

  return {
    locale,
    messages,
  };
});
