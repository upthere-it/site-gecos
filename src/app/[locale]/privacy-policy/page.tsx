import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | GE.CO.S. S.r.l.",
  robots: { index: false },
};

export default function PrivacyPolicyPage() {
  const DOMINIO = "gecospomezia.it";
  const RAGIONE_SOCIALE = "GE.CO.S. S.r.l.";
  const EMAIL = "info@gecospomezia.it";

  return (
    <>
      <Header />
      <main className="max-w-[1140px] mx-auto px-6 py-20">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-primary/80 text-sm md:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-primary">
            Politica sulla riservatezza
          </h2>

          <p>
            Il sito {DOMINIO} è di proprietà di {RAGIONE_SOCIALE}, titolare del
            trattamento dei Suoi dati personali.
          </p>

          <p>
            Abbiamo adottato questa politica sulla privacy, la quale determina
            il trattamento delle informazioni raccolte da {DOMINIO}, oltre che i
            motivi per raccolta di certi dati personali a Lei correlati.
            Pertanto, deve leggere questa politica sulla riservatezza prima di
            usare il sito {DOMINIO}.
          </p>

          <p>
            Trattiamo i Suoi dati personali e garantiamo riservatezza e
            sicurezza degli stessi.
          </p>

          <h2 className="text-xl font-bold text-primary mt-8">
            Informazioni personali raccolte
          </h2>

          <p>
            Quando visita {DOMINIO}, raccogliamo automaticamente certe
            informazioni sul dispositivo, incluse informazioni su browser web,
            indirizzo IP, fuso orario e cookie installati sul dispositivo.
            Inoltre, navigando sul sito, raccogliamo informazioni sulle pagine
            web o i prodotti visualizzati, siti web o termini di ricerca di
            riferimento verso il sito e come Lei interagisce con il sito.
            Indichiamo tali informazioni raccolte automaticamente come
            &quot;informazioni sul dispositivo&quot;. Inoltre, potremmo raccogliere dati
            personali che ci fornisce (inclusi senza limitazione nome, cognome,
            indirizzo, informazioni di pagamento ecc.) durante la registrazione
            per soddisfare l&apos;accordo.
          </p>

          <h2 className="text-xl font-bold text-primary mt-8">
            Perché trattiamo i dati?
          </h2>

          <p>
            La sicurezza dei dati dei clienti è una nostra priorità, pertanto
            trattiamo solo i dati degli utenti strettamente necessari per
            gestire il sito. Le informazioni raccolte automaticamente vengono
            utilizzate solo per identificare casi potenziali di abuso e
            stabilire statistiche sull&apos;uso del sito.
          </p>

          <p>
            Le è consentito visitare il sito senza rivelare informazioni,
            tramite le quali potrebbe essere identificato personalmente. Se,
            tuttavia, desidera utilizzare alcune delle funzioni del sito, o
            desidera ricevere newsletter o fornire altri dettagli compilando un
            modulo, potrebbe doverci fornire dati personali come email, nome,
            cognome, città di residenza, organizzazione e numero di telefono.
            Gli utenti che non sanno quali informazioni sono obbligatorie,
            possono contattarci a{" "}
            <a href={`mailto:${EMAIL}`} className="text-primary underline">
              {EMAIL}
            </a>
            .
          </p>

          <h2 className="text-xl font-bold text-primary mt-8">I Suoi diritti</h2>

          <p>
            Se è residente nell&apos;Unione Europea, dispone dei seguenti diritti
            sui dati personali:
          </p>

          <ul className="list-disc pl-6 space-y-1">
            <li>Il diritto di essere informato</li>
            <li>Il diritto all&apos;accesso</li>
            <li>Il diritto di modifica</li>
            <li>Il diritto di eliminazione</li>
            <li>Il diritto di limitazione del trattamento</li>
            <li>Il diritto di portabilità dei dati</li>
            <li>Il diritto di obiezione</li>
            <li>
              Il diritto in relazione a decisione e profilazione automatizzata
            </li>
          </ul>

          <p>
            Per esercitare questi diritti, si prega di contattarci tramite le
            informazioni di contatto sotto.
          </p>

          <h2 className="text-xl font-bold text-primary mt-8">
            Collegamenti ad altri siti
          </h2>

          <p>
            Il nostro sito potrebbe contenere collegamenti ad altri siti non
            gestiti o controllati da noi. Notare che non siamo responsabili per
            le pratiche sulla riservatezza di altri siti o di terzi.
          </p>

          <h2 className="text-xl font-bold text-primary mt-8">
            Sicurezza delle informazioni
          </h2>

          <p>
            Proteggiamo le informazioni fornite su server informatici
            controllati, un ambiente sicuro protetto da accesso, uso o
            divulgazione non autorizzata. Nonostante ciò, nessuna trasmissione
            dei dati tramite Internet o rete wireless può essere completamente
            garantita come sicura.
          </p>

          <h2 className="text-xl font-bold text-primary mt-8">
            Avvertenza legale
          </h2>

          <p>
            Divulgheremo informazioni raccolte, usate o ricevute se richiesto o
            consentito dalla legge, come per rispettare ordini di tribunali o
            procedure legali simili.
          </p>

          <h2 className="text-xl font-bold text-primary mt-8">
            Informazioni di contatto
          </h2>

          <p>
            Per qualsiasi questione correlata ai diritti individuali o alle
            informazioni personali, può inviare un&apos;email a{" "}
            <a href={`mailto:${EMAIL}`} className="text-primary underline">
              {EMAIL}
            </a>
            .
          </p>

          <h2 className="text-xl font-bold text-primary mt-8">
            Whistleblowing
          </h2>

          <p>
            Per il trattamento dei dati personali connessi alle segnalazioni
            effettuate tramite il canale whistleblowing, si rinvia alla
            specifica &quot;Informativa Privacy Whistleblowing&quot; disponibile nella
            sezione dedicata del sito.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
