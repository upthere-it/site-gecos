import { getCompany, type CompanyData } from "./content-api";
import companyFallback from "@/data/company-fallback.json";

export type { CompanyData };

export async function getCompanyData(): Promise<CompanyData> {
  return (await getCompany()) ?? (companyFallback as CompanyData);
}
