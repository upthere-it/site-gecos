import Link from "next/link";
import ServiceForm from "../_components/ServiceForm";

export const dynamic = "force-dynamic";

export default function NewServicePage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/services" className="text-xs text-gray-500 hover:text-primary transition-colors">
          ← Torna ai servizi
        </Link>
        <h1 className="text-2xl font-bold text-primary mt-2">Nuovo servizio</h1>
      </div>

      <ServiceForm mode="create" />
    </div>
  );
}
