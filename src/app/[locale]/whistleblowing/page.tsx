import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Whistleblowing – GE.CO.S. S.r.l.",
  description:
    "Canale di segnalazione Whistleblowing di GE.CO.S. S.r.l. ai sensi del D.Lgs. 24/2023 – protezione dei segnalanti e procedura di segnalazione.",
  robots: "noindex,nofollow",
};

export default function WhistleblowingPage() {
  const RAGIONE_SOCIALE = "GE.CO.S. S.r.l.";
  const EMAIL_SGI = "sgi@gecospomezia.it";
  const EMAIL_INFO = "info@gecospomezia.it";

  return (
    <>
      <Header />
      <main className="max-w-[1140px] mx-auto px-6 py-20">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
          Whistleblowing
        </h1>
        <p className="text-sm text-warning font-semibold uppercase tracking-widest mb-10">
          D.Lgs. 24/2023 – Protezione dei segnalanti
        </p>

        <div className="space-y-6 text-primary/80 text-sm md:text-base leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">Cos&apos;è il Whistleblowing</h2>
            <p>
              Il termine <strong>Whistleblowing</strong> indica la segnalazione
              di violazioni di disposizioni normative nazionali o dell&apos;Unione
              Europea di cui il segnalante sia venuto a conoscenza nell&apos;ambito
              del proprio contesto lavorativo.
            </p>
            <p className="mt-3">
              {RAGIONE_SOCIALE} ha istituito un canale di segnalazione interno
              in attuazione del <strong>D.Lgs. 10 marzo 2023, n. 24</strong>,
              che recepisce la Direttiva UE 2019/1937 del Parlamento europeo e
              del Consiglio, relativa alla protezione delle persone che
              segnalano violazioni del diritto dell&apos;Unione.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3 mt-8">Chi può segnalare</h2>
            <p>Possono effettuare segnalazioni le seguenti categorie di soggetti:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Lavoratori dipendenti e collaboratori</li>
              <li>Lavoratori autonomi e consulenti</li>
              <li>Azionisti, soci e titolari di cariche sociali</li>
              <li>Stagisti, tirocinanti e volontari</li>
              <li>Soggetti il cui rapporto di lavoro non ha ancora avuto inizio (se le informazioni sono state acquisite in fase di selezione)</li>
              <li>Soggetti il cui rapporto di lavoro è cessato</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3 mt-8">Cosa si può segnalare</h2>
            <p>
              Le segnalazioni devono riguardare comportamenti, atti od omissioni
              che ledono l&apos;interesse pubblico o l&apos;integrità dell&apos;ente, ed in
              particolare violazioni relative a:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Appalti pubblici</li>
              <li>Servizi, prodotti e mercati finanziari</li>
              <li>Prevenzione del riciclaggio e del finanziamento del terrorismo</li>
              <li>Sicurezza e conformità dei prodotti</li>
              <li>Sicurezza dei trasporti</li>
              <li>Tutela dell&apos;ambiente</li>
              <li>Radioprotezione e sicurezza nucleare</li>
              <li>Sicurezza degli alimenti e dei mangimi, salute e benessere degli animali</li>
              <li>Salute pubblica</li>
              <li>Protezione dei consumatori</li>
              <li>Tutela della vita privata e protezione dei dati personali</li>
              <li>Sicurezza delle reti e dei sistemi informativi</li>
              <li>Violazioni che ledono gli interessi finanziari dell&apos;Unione Europea</li>
              <li>Violazioni riguardanti il mercato interno</li>
              <li>Violazioni del Modello Organizzativo 231</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3 mt-8">Come effettuare una segnalazione</h2>
            <p>
              Per effettuare una segnalazione interna è possibile utilizzare
              uno dei seguenti canali:
            </p>
            <div className="mt-4 space-y-4">
              <div className="border border-gray-200 rounded-md p-4">
                <p className="font-semibold text-primary mb-1">Modulo scritto</p>
                <p>
                  Compilare il modulo cartaceo disponibile per il download e
                  consegnarlo in busta chiusa al Responsabile del Sistema di
                  Gestione Integrato, con l&apos;indicazione in busta{" "}
                  <em>&quot;Riservata – Segnalazione Whistleblowing&quot;</em>.
                </p>
              </div>
              <div className="border border-gray-200 rounded-md p-4">
                <p className="font-semibold text-primary mb-1">Email riservata</p>
                <p>
                  Inviare la segnalazione all&apos;indirizzo dedicato:{" "}
                  <a href={`mailto:${EMAIL_SGI}`} className="text-primary underline">
                    {EMAIL_SGI}
                  </a>
                  {" "}con oggetto <em>&quot;Segnalazione Whistleblowing – Riservata&quot;</em>.
                </p>
              </div>
              <div className="border border-gray-200 rounded-md p-4">
                <p className="font-semibold text-primary mb-1">Incontro diretto</p>
                <p>
                  È possibile richiedere un incontro diretto con il
                  Responsabile della gestione delle segnalazioni entro un
                  termine ragionevole da concordare.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3 mt-8">Protezione del segnalante</h2>
            <p>
              {RAGIONE_SOCIALE} garantisce la riservatezza dell&apos;identità del
              segnalante e di tutte le informazioni relative alla segnalazione,
              anche in caso di segnalazione anonima.
            </p>
            <p className="mt-3">
              È <strong>vietato</strong>, anche solo tentare o minacciare, di
              porre in essere ritorsioni nei confronti dei soggetti che hanno
              effettuato una segnalazione in buona fede. Sono considerate
              ritorsioni, a titolo esemplificativo:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Il licenziamento, la sospensione o misure equivalenti</li>
              <li>La retrocessione di grado o la mancata promozione</li>
              <li>Il mutamento di funzioni, cambiamento del luogo di lavoro o riduzione dello stipendio</li>
              <li>La discriminazione o comunque il trattamento sfavorevole</li>
              <li>La mancata conversione di un contratto di lavoro a termine in un contratto permanente</li>
              <li>Il danno alla reputazione, in particolare sui social media</li>
              <li>Le coercizioni, le intimidazioni o le molestie</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3 mt-8">Gestione delle segnalazioni</h2>
            <p>
              Il Responsabile della gestione delle segnalazioni, ricevuta la
              segnalazione, provvede a:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Rilasciare avviso di ricevimento entro <strong>7 giorni</strong></li>
              <li>Comunicare con il segnalante e, se necessario, richiedere informazioni integrative</li>
              <li>Svolgere le verifiche necessarie con diligenza e imparzialità</li>
              <li>Fornire riscontro entro <strong>3 mesi</strong> dalla data dell&apos;avviso di ricevimento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3 mt-8">Informativa sulla privacy</h2>
            <p>
              I dati personali raccolti nell&apos;ambito della gestione delle
              segnalazioni whistleblowing sono trattati da {RAGIONE_SOCIALE} in
              qualità di Titolare del Trattamento, ai sensi del Regolamento UE
              2016/679 (GDPR) e del D.Lgs. 24/2023, al fine esclusivo di
              gestire le segnalazioni pervenute.
            </p>
            <p className="mt-3">
              I dati vengono conservati per il tempo strettamente necessario alla
              gestione della segnalazione e comunque non oltre{" "}
              <strong>5 anni</strong> dalla data di comunicazione dell&apos;esito
              finale della procedura. L&apos;accesso ai dati è limitato ai soli
              soggetti autorizzati preposti alla gestione delle segnalazioni.
            </p>
            <p className="mt-3">
              Per esercitare i propri diritti in materia di protezione dei dati
              personali è possibile contattare il Titolare del Trattamento
              all&apos;indirizzo:{" "}
              <a href={`mailto:${EMAIL_INFO}`} className="text-primary underline">
                {EMAIL_INFO}
              </a>
              .
            </p>
          </section>

          <section className="mt-10 p-6 bg-secondary-50 border border-secondary-200 rounded-md">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-warning text-2xl mt-0.5 shrink-0">
                download
              </span>
              <div>
                <p className="font-bold text-primary mb-1">Modulo di segnalazione</p>
                <p className="text-sm mb-3">
                  Scarica il modulo ufficiale per effettuare una segnalazione
                  in forma scritta e consegnalo al Responsabile SGI in busta
                  chiusa.
                </p>
                <a
                  href="#"
                  className="btn-accent inline-flex text-sm"
                >
                  Scarica modulo (PDF)
                </a>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
