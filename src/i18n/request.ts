import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { getMessages } from "@/lib/content-api";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "it")) {
    locale = routing.defaultLocale;
  }

  let messages: Record<string, unknown>;
  try {
    messages = await getMessages(locale);
  } catch {
    messages = (await import(`../../messages/${locale}.json`)).default;
  }

  return {
    locale,
    messages,
  };
});
