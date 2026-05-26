import Link from "next/link";
import { notFound } from "next/navigation";
import { getServices } from "@/lib/site-content";
import ServiceForm from "../_components/ServiceForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const services = await getServices();
  const service = services.find((s) => s.id === id);

  if (!service) notFound();

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/services" className="text-xs text-gray-500 hover:text-primary transition-colors">
          ← Torna ai servizi
        </Link>
        <h1 className="text-2xl font-bold text-primary mt-2">
          Modifica servizio
        </h1>
        <p className="text-sm text-gray-500 mt-0.5 font-mono">{service.slug}</p>
      </div>

      <ServiceForm mode="edit" initialData={service} />
    </div>
  );
}
