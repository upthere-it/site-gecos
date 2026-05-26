import CompanyForm, { CompanyData } from "./_components/CompanyForm";
import { readLocalCompany } from "@/lib/local-data";

export const dynamic = "force-dynamic";

const CONTENT_API_URL = process.env.CONTENT_API_URL;

const EMPTY_COMPANY: CompanyData = {
  tagline: "",
  sedeOperativa: { indirizzo: "", cap: "", citta: "" },
  sedeLegale: { indirizzo: "", cap: "", citta: "" },
  telefoni: [],
  emails: [],
  social: { instagram: "", facebook: "" },
  copyright: "",
};

async function getCompany(): Promise<{ data: CompanyData; error: string | null }> {
  // Prova backend se configurato
  if (CONTENT_API_URL) {
    try {
      const res = await fetch(`${CONTENT_API_URL}/api/v1/company`, { cache: "no-store" });
      if (res.ok) {
        const json = (await res.json()) as Partial<CompanyData>;
        return {
          data: {
            tagline: json.tagline ?? "",
            sedeOperativa: {
              indirizzo: json.sedeOperativa?.indirizzo ?? "",
              cap: json.sedeOperativa?.cap ?? "",
              citta: json.sedeOperativa?.citta ?? "",
            },
            sedeLegale: {
              indirizzo: json.sedeLegale?.indirizzo ?? "",
              cap: json.sedeLegale?.cap ?? "",
              citta: json.sedeLegale?.citta ?? "",
            },
            telefoni: Array.isArray(json.telefoni) ? json.telefoni : [],
            emails: Array.isArray(json.emails) ? json.emails : [],
            social: {
              instagram: json.social?.instagram ?? "",
              facebook: json.social?.facebook ?? "",
            },
            copyright: json.copyright ?? "",
          },
          error: null,
        };
      }
    } catch {
      // Cade al fallback locale
    }
  }

  // Fallback locale
  try {
    const local = await readLocalCompany();
    return {
      data: {
        tagline: (local.tagline as string) ?? "",
        sedeOperativa: (local.sedeOperativa as CompanyData["sedeOperativa"]) ?? { indirizzo: "", cap: "", citta: "" },
        sedeLegale: (local.sedeLegale as CompanyData["sedeLegale"]) ?? { indirizzo: "", cap: "", citta: "" },
        telefoni: Array.isArray(local.telefoni) ? (local.telefoni as string[]) : [],
        emails: Array.isArray(local.emails) ? (local.emails as string[]) : [],
        social: (local.social as CompanyData["social"]) ?? { instagram: "", facebook: "" },
        copyright: (local.copyright as string) ?? "",
      },
      error: null,
    };
  } catch {
    return { data: EMPTY_COMPANY, error: null };
  }
}

export default async function AdminCompanyPage() {
  const { data, error } = await getCompany();

  return (
    <div className="p-8">
      <div className="mb-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-primary">Dati Aziendali</h1>
        <p className="text-sm text-gray-500 mt-1">
          Informazioni di contatto e dati legali visualizzati nel footer e nella
          pagina contatti.
        </p>
      </div>

      {error && (
        <div className="max-w-3xl mx-auto mb-6">
          <p className="text-sm text-error border border-error/30 bg-error/5 px-4 py-3">
            {error}
          </p>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <CompanyForm initialData={data} />
      </div>
    </div>
  );
}
