import type { FaqItem } from "./faq-datasource";

/**
 * Dati mock usati in ambiente non-prod (APP_ENV !== 'prod').
 * Rispecchiano i servizi reali di GE.CO.S. S.r.l.
 */
export const FAQ_MOCK_ITEMS: FaqItem[] = [
  {
    id: 1,
    title: "In quali zone operate?",
    content:
      "<p>GE.CO.S. S.r.l. opera principalmente nel <strong>Lazio</strong> e nelle regioni limitrofe, con base operativa a <strong>Pomezia (RM)</strong>. Per interventi straordinari siamo in grado di operare su tutto il territorio nazionale.</p>",
    description: null,
    icon: "",
  },
  {
    id: 2,
    title: "Quali enti pubblici assistete?",
    content:
      "<p>Collaboriamo con comuni, province, enti parco, aziende municipalizzate e gestori di infrastrutture. Tra i nostri clienti figurano <strong>ANAS Gruppo FS Italiane</strong>, <strong>ACEA S.p.A.</strong> e diverse amministrazioni comunali del territorio.</p>",
    description: null,
    icon: "",
  },
  {
    id: 3,
    title: "Come posso richiedere un preventivo?",
    content:
      "<p>Potete contattarci telefonicamente ai numeri <strong>069107142</strong> o <strong>0691603098</strong>, oppure compilare il modulo di contatto sul nostro sito. Il nostro team vi ricontatterà nel più breve tempo possibile per valutare insieme le vostre esigenze.</p>",
    description: null,
    icon: "",
  },
  {
    id: 4,
    title: "Quali certificazioni possedete?",
    content:
      "<p>GE.CO.S. S.r.l. è in possesso delle seguenti certificazioni:</p><ul><li><strong>ISO 9001:2015</strong> — gestione della qualità</li><li><strong>EMAS</strong> — sostenibilità ambientale (Eco-Management and Audit Scheme)</li><li><strong>UNI/PDR 125:2022</strong> — parità di genere</li></ul>",
    description: null,
    icon: "",
  },
  {
    id: 5,
    title: "Effettuate interventi di emergenza?",
    content:
      "<p>Sì, siamo attrezzati per rispondere a interventi urgenti come:</p><ul><li>Abbattimento di alberi pericolanti</li><li>Rimozione di rami spezzati post-tempesta</li><li>Altri interventi di pronto intervento sul verde</li></ul>",
    description: null,
    icon: "",
  },
  {
    id: 6,
    title: "Gestite anche aree boschive e forestali?",
    content:
      "<p>Sì, la gestione di aree boschive e forestali è uno dei nostri core business. Siamo specializzati in:</p><ul><li>Pulizia e decespugliamento</li><li>Prevenzione incendi boschivi</li><li>Interventi di forestazione e rimboschimento</li></ul>",
    description: null,
    icon: "",
  },
  {
    id: 7,
    title: "Offrite servizi cimiteriali?",
    content:
      "<p>Sì, gestiamo la manutenzione ordinaria di <strong>aree cimiteriali comunali</strong>: pulizia, taglio erba, cura delle aree verdi e raccolta rifiuti vegetali nel rispetto delle normative ambientali vigenti.</p>",
    description: null,
    icon: "",
  },
];
