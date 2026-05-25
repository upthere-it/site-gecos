import Link from "next/link";
import { getServices } from "@/lib/site-content";
import AdminDeleteButton from "./_components/AdminDeleteButton";

export const dynamic = "force-dynamic";

export default function AdminServicesPage() {
  const services = getServices();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">Servizi</h1>
          <p className="text-sm text-gray-500 mt-1">
            {services.length} servizi configurati
          </p>
        </div>
        <Link href="/admin/services/new" className="btn-accent">
          + NUOVO SERVIZIO
        </Link>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide w-12">
                Ord.
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
                Titolo
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                Slug
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                Label
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                  {service.order}
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-primary">{service.title}</span>
                  <span className="block text-xs text-gray-400 mt-0.5 line-clamp-1">
                    {service.subtitle}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs hidden md:table-cell">
                  {service.slug}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="inline-block bg-secondary/20 text-primary text-xs font-bold px-2 py-0.5 uppercase tracking-wide">
                    {service.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/services/${service.id}`}
                      className="text-xs font-bold text-primary border border-primary px-3 py-1.5 hover:bg-primary hover:text-white transition-colors"
                    >
                      MODIFICA
                    </Link>
                    <AdminDeleteButton serviceId={service.id} serviceName={service.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {services.length === 0 && (
          <div className="px-4 py-12 text-center text-gray-400">
            Nessun servizio configurato.{" "}
            <Link href="/admin/services/new" className="text-primary underline">
              Crea il primo
            </Link>
            .
          </div>
        )}
      </div>
    </div>
  );
}
