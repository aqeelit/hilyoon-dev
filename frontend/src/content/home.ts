// All homepage + site chrome copy, per locale.
import type { Locale } from '@/types'

export type IconName =
  | 'sparkles' | 'bot' | 'database' | 'eye' | 'brain' | 'server' | 'plug' | 'compass'
  | 'target' | 'layers' | 'shield' | 'trending'
  | 'heart' | 'landmark' | 'shopping' | 'factory' | 'truck' | 'building'

export interface NavItem { label: string; href: string; description?: string }

export interface HomeContent {
  nav: {
    services: string
    industries: string
    approach: string
    projects: string
    blog: string
    contact: string
    cta: string
    allServices: string
  }
  hero: {
    eyebrow: string
    title: string
    highlight: string
    description: string
    proof: string[]
    primary: string
    secondary: string
    tabsLabel: string
    demos: {
      tab: string
      title: string
      subtitle: string
      metric: string
      metricLabel: string
      steps: { label: string; status: 'done' | 'verified' | 'review' | 'queued' }[]
      reviewer: string
    }[]
    statusLabels: Record<'done' | 'verified' | 'review' | 'queued', string>
    replay: string
    example: string
  }
  stack: { title: string }
  solutions: {
    eyebrow: string
    title: string
    description: string
    items: { industry: string; title: string; description: string; tags: string[] }[]
  }
  approach: {
    eyebrow: string
    title: string
    description: string
    items: { icon: IconName; title: string; description: string }[]
    stats: { value: string; label: string }[]
  }
  services: {
    eyebrow: string
    title: string
    description: string
    learnMore: string
    items: { icon: IconName; title: string; description: string }[]
  }
  industries: {
    eyebrow: string
    title: string
    items: { icon: IconName; name: string; useCases: string[] }[]
  }
  why: {
    eyebrow: string
    title: string
    items: { title: string; description: string }[]
  }
  cta: { title: string; description: string; button: string }
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] }
  contact: {
    eyebrow: string
    title: string
    description: string
    email: string
    responseTime: string
    form: {
      name: string
      email: string
      company: string
      message: string
      submit: string
      note: string
    }
  }
  footer: {
    tagline: string
    columns: { title: string; links: NavItem[] }[]
    rights: string
  }
}

const en: HomeContent = {
  nav: {
    services: 'Services',
    industries: 'Industries',
    approach: 'Approach',
    projects: 'Projects',
    blog: 'Blog',
    contact: 'Contact',
    cta: 'Book a consultation',
    allServices: 'All services',
  },
  hero: {
    eyebrow: 'AI Engineering Company',
    title: 'We engineer AI systems that',
    highlight: 'run inside your business',
    description:
      'Hilyoon designs, builds and operates production-grade AI — from LLM applications and autonomous agents to computer vision and ML pipelines — integrated with the tools your teams already use.',
    proof: ['Pilot in 4–6 weeks', 'Production-first engineering', 'Your data stays yours'],
    primary: 'Book a consultation',
    secondary: 'Explore services',
    tabsLabel: 'See an agent at work',
    demos: [
      {
        tab: 'Finance',
        title: 'Invoice Agent',
        subtitle: 'Accounts payable automation',
        metric: '−65%',
        metricLabel: 'processing time',
        steps: [
          { label: 'Invoice received from inbox', status: 'done' },
          { label: 'Fields extracted & classified', status: 'done' },
          { label: 'Matched against purchase order', status: 'verified' },
          { label: 'Mismatch flagged for approval', status: 'review' },
          { label: 'Posted to ERP', status: 'queued' },
        ],
        reviewer: 'Human-in-the-loop approval',
      },
      {
        tab: 'Support',
        title: 'Support Agent',
        subtitle: 'Multilingual customer service',
        metric: '70%',
        metricLabel: 'tickets auto-resolved',
        steps: [
          { label: 'Ticket arrives (EN / RO / AR)', status: 'done' },
          { label: 'Intent & sentiment detected', status: 'done' },
          { label: 'Answer drafted from knowledge base', status: 'verified' },
          { label: 'Refund request escalated', status: 'review' },
          { label: 'CRM updated & customer notified', status: 'queued' },
        ],
        reviewer: 'Escalates edge cases to your team',
      },
      {
        tab: 'Operations',
        title: 'Inspection Agent',
        subtitle: 'Computer vision quality control',
        metric: '98%',
        metricLabel: 'defect detection',
        steps: [
          { label: 'Image captured on the line', status: 'done' },
          { label: 'Defects segmented by vision model', status: 'done' },
          { label: 'Severity scored against spec', status: 'verified' },
          { label: 'Borderline part sent to inspector', status: 'review' },
          { label: 'Quality report exported', status: 'queued' },
        ],
        reviewer: 'Inspector confirms borderline cases',
      },
    ],
    statusLabels: { done: 'Done', verified: 'Verified', review: 'Review', queued: 'Queued' },
    replay: 'Replay',
    example: 'Example workflow',
  },
  stack: { title: 'Engineering with the modern AI stack' },
  solutions: {
    eyebrow: 'What we build',
    title: 'AI solutions engineered for real workflows',
    description: 'Practical systems that remove manual work, connect to your existing software and keep humans in control.',
    items: [
      {
        industry: 'Document intelligence',
        title: 'Turn unstructured documents into structured data',
        description: 'Extraction, classification and validation pipelines for invoices, contracts, forms and reports.',
        tags: ['LLMs', 'OCR', 'RAG'],
      },
      {
        industry: 'AI agents',
        title: 'Agents that complete multi-step tasks end to end',
        description: 'Tool-using agents that read, decide and act across your CRM, ERP, email and internal APIs.',
        tags: ['Agents', 'Tool use', 'Workflows'],
      },
      {
        industry: 'Computer vision',
        title: 'See and measure what matters in images and video',
        description: 'Detection, segmentation and inspection models deployed to the cloud or the edge.',
        tags: ['Vision', 'Edge AI', 'MLOps'],
      },
    ],
  },
  approach: {
    eyebrow: 'Our approach',
    title: 'From idea to production — without the guesswork',
    description: 'A focused engineering process that proves value early and scales what works.',
    items: [
      { icon: 'target', title: 'Focused pilot', description: 'We start with one high-value workflow and prove measurable impact in weeks, not quarters.' },
      { icon: 'layers', title: 'End-to-end engineering', description: 'Data pipelines, models, integrations, deployment and monitoring — one team owns it all.' },
      { icon: 'shield', title: 'Secure by design', description: 'Private deployments, access controls and audit trails built in from day one.' },
      { icon: 'trending', title: 'Measurable outcomes', description: 'Every project ships with clear KPIs, so you know exactly what the AI is delivering.' },
    ],
    stats: [
      { value: '4–6 wks', label: 'From kickoff to working pilot' },
      { value: '3', label: 'Languages supported: EN · RO · AR' },
      { value: '24/7', label: 'Monitoring of production systems' },
    ],
  },
  services: {
    eyebrow: 'Services',
    title: 'AI engineering services, built around your workflow',
    description: 'Senior engineers who take AI from prototype to reliable production software.',
    learnMore: 'Discuss your project',
    items: [
      { icon: 'sparkles', title: 'Generative AI & LLM Apps', description: 'Copilots, assistants and content systems built on leading LLMs, tuned for accuracy and cost.' },
      { icon: 'bot', title: 'AI Agent Development', description: 'Autonomous and human-in-the-loop agents that use tools and APIs to finish real tasks.' },
      { icon: 'database', title: 'RAG & Knowledge Systems', description: 'Retrieval pipelines and vector search that ground answers in your own documents and data.' },
      { icon: 'eye', title: 'Computer Vision', description: 'Detection, OCR, segmentation and visual inspection for images, video and documents.' },
      { icon: 'brain', title: 'Machine Learning Engineering', description: 'Forecasting, classification and recommendation models trained on your data.' },
      { icon: 'server', title: 'MLOps & Deployment', description: 'CI/CD for models, evaluation, observability and scalable cloud or on-premise serving.' },
      { icon: 'plug', title: 'AI Integration & Automation', description: 'Connect AI to your ERP, CRM, helpdesk and internal systems to automate workflows.' },
      { icon: 'compass', title: 'AI Strategy & Proof of Concept', description: 'Identify the highest-ROI use cases and validate them quickly with a working prototype.' },
    ],
  },
  industries: {
    eyebrow: 'Industries',
    title: 'Domain-aware AI for your industry',
    items: [
      { icon: 'heart', name: 'Healthcare', useCases: ['Clinical documentation', 'Medical coding', 'Patient triage'] },
      { icon: 'landmark', name: 'Finance & Insurance', useCases: ['Claims processing', 'Fraud detection', 'KYC automation'] },
      { icon: 'shopping', name: 'Retail & E-commerce', useCases: ['Product search', 'Demand forecasting', 'Support agents'] },
      { icon: 'factory', name: 'Manufacturing', useCases: ['Visual inspection', 'Predictive maintenance', 'BOM extraction'] },
      { icon: 'truck', name: 'Logistics', useCases: ['Route optimization', 'Document automation', 'ETA prediction'] },
      { icon: 'building', name: 'Real Estate', useCases: ['Lease abstraction', 'Valuation models', 'Tenant assistants'] },
    ],
  },
  why: {
    eyebrow: 'Why Hilyoon',
    title: 'What makes Hilyoon a different AI engineering partner',
    items: [
      { title: 'Proof before scale', description: 'We validate impact on a real workflow before you commit to a large build.' },
      { title: 'Production, not demos', description: 'Evaluation, guardrails, monitoring and fallbacks are part of every delivery.' },
      { title: 'Multilingual by default', description: 'Systems designed for English, Romanian and Arabic users — including right-to-left interfaces.' },
      { title: 'You own the result', description: 'Your code, your models, your data. No lock-in, full documentation and handover.' },
    ],
  },
  cta: {
    title: 'Ready to put AI to work in your business?',
    description: 'Book a free strategy call. We will map your highest-impact use case and outline a pilot plan.',
    button: 'Book a consultation',
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Frequently asked questions',
    items: [
      { q: 'What does an AI engineering company do?', a: 'We design, build, deploy and maintain AI systems — LLM applications, agents, computer vision and ML models — and integrate them with your existing software so they deliver value in daily operations.' },
      { q: 'How long does it take to see results?', a: 'Most engagements start with a focused pilot that delivers a working system on real data in 4–6 weeks. Full production rollouts typically follow in 2–4 months depending on scope.' },
      { q: 'How much does an AI project cost?', a: 'Cost depends on scope, data and integrations. After a short discovery call we provide a written estimate with fixed milestones, so there are no surprises.' },
      { q: 'Can the AI run on our own infrastructure?', a: 'Yes. We deploy to your cloud account or on-premise, and can use open-weight models when data must never leave your environment.' },
      { q: 'Do you support Arabic and Romanian?', a: 'Yes. We build multilingual systems and interfaces in English, Romanian and Arabic, including full right-to-left support.' },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title: "Let's talk about your AI project",
    description: 'Tell us what you want to automate or build. A senior engineer will reply with next steps.',
    email: 'hello@hilyoon.com',
    responseTime: 'We reply within one business day.',
    form: {
      name: 'Full name',
      email: 'Work email',
      company: 'Company',
      message: 'What would you like to build?',
      submit: 'Send message',
      note: 'This opens your email app with the message ready to send.',
    },
  },
  footer: {
    tagline: 'AI engineering company building production-grade LLM applications, agents and machine learning systems.',
    columns: [
      {
        title: 'Services',
        links: [
          { label: 'Generative AI & LLM Apps', href: '#services' },
          { label: 'AI Agent Development', href: '#services' },
          { label: 'RAG & Knowledge Systems', href: '#services' },
          { label: 'Computer Vision', href: '#services' },
          { label: 'MLOps & Deployment', href: '#services' },
        ],
      },
      {
        title: 'Industries',
        links: [
          { label: 'Healthcare', href: '#industries' },
          { label: 'Finance & Insurance', href: '#industries' },
          { label: 'Retail & E-commerce', href: '#industries' },
          { label: 'Manufacturing', href: '#industries' },
          { label: 'Logistics', href: '#industries' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'Projects', href: '/projects' },
          { label: 'Our approach', href: '#approach' },
          { label: 'Why Hilyoon', href: '#why' },
          { label: 'Blog', href: '/blog' },
          { label: 'FAQ', href: '#faq' },
          { label: 'Contact', href: '#contact' },
        ],
      },
    ],
    rights: 'All rights reserved.',
  },
}

const ro: HomeContent = {
  nav: {
    services: 'Servicii',
    industries: 'Industrii',
    approach: 'Abordare',
    projects: 'Proiecte',
    blog: 'Blog',
    contact: 'Contact',
    cta: 'Programează o consultanță',
    allServices: 'Toate serviciile',
  },
  hero: {
    eyebrow: 'Companie de inginerie AI',
    title: 'Construim sisteme AI care',
    highlight: 'funcționează în afacerea ta',
    description:
      'Hilyoon proiectează, dezvoltă și operează AI de producție — de la aplicații LLM și agenți autonomi la viziune computerizată și pipeline-uri ML — integrate cu instrumentele pe care echipele tale le folosesc deja.',
    proof: ['Pilot în 4–6 săptămâni', 'Inginerie orientată spre producție', 'Datele tale rămân ale tale'],
    primary: 'Programează o consultanță',
    secondary: 'Vezi serviciile',
    tabsLabel: 'Vezi un agent în acțiune',
    demos: [
      {
        tab: 'Finanțe',
        title: 'Agent pentru facturi',
        subtitle: 'Automatizarea plăților către furnizori',
        metric: '−65%',
        metricLabel: 'timp de procesare',
        steps: [
          { label: 'Factură primită pe email', status: 'done' },
          { label: 'Câmpuri extrase și clasificate', status: 'done' },
          { label: 'Verificată cu comanda de achiziție', status: 'verified' },
          { label: 'Neconcordanță trimisă spre aprobare', status: 'review' },
          { label: 'Înregistrată în ERP', status: 'queued' },
        ],
        reviewer: 'Aprobare cu om în buclă',
      },
      {
        tab: 'Suport',
        title: 'Agent de suport',
        subtitle: 'Servicii clienți multilingve',
        metric: '70%',
        metricLabel: 'tichete rezolvate automat',
        steps: [
          { label: 'Tichet primit (EN / RO / AR)', status: 'done' },
          { label: 'Intenție și sentiment detectate', status: 'done' },
          { label: 'Răspuns redactat din baza de cunoștințe', status: 'verified' },
          { label: 'Cerere de rambursare escaladată', status: 'review' },
          { label: 'CRM actualizat și client notificat', status: 'queued' },
        ],
        reviewer: 'Cazurile speciale ajung la echipa ta',
      },
      {
        tab: 'Operațiuni',
        title: 'Agent de inspecție',
        subtitle: 'Control calitate cu viziune computerizată',
        metric: '98%',
        metricLabel: 'detecție defecte',
        steps: [
          { label: 'Imagine capturată pe linie', status: 'done' },
          { label: 'Defecte segmentate de modelul vizual', status: 'done' },
          { label: 'Severitate evaluată conform specificației', status: 'verified' },
          { label: 'Piesă la limită trimisă inspectorului', status: 'review' },
          { label: 'Raport de calitate exportat', status: 'queued' },
        ],
        reviewer: 'Inspectorul confirmă cazurile la limită',
      },
    ],
    statusLabels: { done: 'Gata', verified: 'Verificat', review: 'Revizuire', queued: 'În coadă' },
    replay: 'Reia',
    example: 'Exemplu de flux',
  },
  stack: { title: 'Lucrăm cu tehnologiile AI moderne' },
  solutions: {
    eyebrow: 'Ce construim',
    title: 'Soluții AI create pentru fluxuri de lucru reale',
    description: 'Sisteme practice care elimină munca manuală, se conectează la software-ul existent și țin oamenii în control.',
    items: [
      {
        industry: 'Inteligența documentelor',
        title: 'Transformă documentele nestructurate în date structurate',
        description: 'Pipeline-uri de extragere, clasificare și validare pentru facturi, contracte, formulare și rapoarte.',
        tags: ['LLM', 'OCR', 'RAG'],
      },
      {
        industry: 'Agenți AI',
        title: 'Agenți care finalizează sarcini în mai mulți pași',
        description: 'Agenți care citesc, decid și acționează în CRM, ERP, email și API-urile interne.',
        tags: ['Agenți', 'Instrumente', 'Fluxuri'],
      },
      {
        industry: 'Viziune computerizată',
        title: 'Vezi și măsoară ce contează în imagini și video',
        description: 'Modele de detecție, segmentare și inspecție, implementate în cloud sau la margine.',
        tags: ['Viziune', 'Edge AI', 'MLOps'],
      },
    ],
  },
  approach: {
    eyebrow: 'Abordarea noastră',
    title: 'De la idee la producție — fără presupuneri',
    description: 'Un proces de inginerie concentrat care dovedește valoarea devreme și scalează ce funcționează.',
    items: [
      { icon: 'target', title: 'Pilot concentrat', description: 'Pornim de la un singur flux valoros și demonstrăm impactul în săptămâni, nu trimestre.' },
      { icon: 'layers', title: 'Inginerie completă', description: 'Date, modele, integrări, implementare și monitorizare — o singură echipă răspunde de tot.' },
      { icon: 'shield', title: 'Securitate din proiectare', description: 'Implementări private, controlul accesului și jurnale de audit încă din prima zi.' },
      { icon: 'trending', title: 'Rezultate măsurabile', description: 'Fiecare proiect are KPI clari, ca să știi exact ce livrează AI-ul.' },
    ],
    stats: [
      { value: '4–6 săpt.', label: 'De la start la pilot funcțional' },
      { value: '3', label: 'Limbi suportate: EN · RO · AR' },
      { value: '24/7', label: 'Monitorizarea sistemelor în producție' },
    ],
  },
  services: {
    eyebrow: 'Servicii',
    title: 'Servicii de inginerie AI, construite în jurul fluxului tău',
    description: 'Ingineri seniori care duc AI-ul de la prototip la software de producție fiabil.',
    learnMore: 'Discută proiectul',
    items: [
      { icon: 'sparkles', title: 'AI generativ și aplicații LLM', description: 'Copiloți, asistenți și sisteme de conținut pe LLM-uri de top, optimizate pentru acuratețe și cost.' },
      { icon: 'bot', title: 'Dezvoltare agenți AI', description: 'Agenți autonomi sau cu om în buclă care folosesc instrumente și API-uri pentru sarcini reale.' },
      { icon: 'database', title: 'RAG și sisteme de cunoștințe', description: 'Căutare vectorială și pipeline-uri de regăsire bazate pe documentele și datele tale.' },
      { icon: 'eye', title: 'Viziune computerizată', description: 'Detecție, OCR, segmentare și inspecție vizuală pentru imagini, video și documente.' },
      { icon: 'brain', title: 'Inginerie machine learning', description: 'Modele de prognoză, clasificare și recomandare antrenate pe datele tale.' },
      { icon: 'server', title: 'MLOps și implementare', description: 'CI/CD pentru modele, evaluare, observabilitate și servire scalabilă în cloud sau on-premise.' },
      { icon: 'plug', title: 'Integrare și automatizare AI', description: 'Conectăm AI-ul la ERP, CRM, helpdesk și sistemele interne pentru a automatiza fluxuri.' },
      { icon: 'compass', title: 'Strategie AI și proof of concept', description: 'Identificăm cazurile cu cel mai mare ROI și le validăm rapid cu un prototip funcțional.' },
    ],
  },
  industries: {
    eyebrow: 'Industrii',
    title: 'AI care înțelege domeniul tău',
    items: [
      { icon: 'heart', name: 'Sănătate', useCases: ['Documentație clinică', 'Codificare medicală', 'Triaj pacienți'] },
      { icon: 'landmark', name: 'Finanțe și asigurări', useCases: ['Procesare daune', 'Detectare fraude', 'Automatizare KYC'] },
      { icon: 'shopping', name: 'Retail și e-commerce', useCases: ['Căutare produse', 'Prognoza cererii', 'Agenți de suport'] },
      { icon: 'factory', name: 'Producție', useCases: ['Inspecție vizuală', 'Mentenanță predictivă', 'Extragere BOM'] },
      { icon: 'truck', name: 'Logistică', useCases: ['Optimizare rute', 'Automatizare documente', 'Predicție ETA'] },
      { icon: 'building', name: 'Imobiliare', useCases: ['Rezumat contracte', 'Modele de evaluare', 'Asistenți chiriași'] },
    ],
  },
  why: {
    eyebrow: 'De ce Hilyoon',
    title: 'Ce face din Hilyoon un partener diferit de inginerie AI',
    items: [
      { title: 'Dovadă înainte de scalare', description: 'Validăm impactul pe un flux real înainte să te angajezi la un proiect mare.' },
      { title: 'Producție, nu demonstrații', description: 'Evaluare, limite de siguranță, monitorizare și soluții de rezervă în fiecare livrare.' },
      { title: 'Multilingv din start', description: 'Sisteme pentru utilizatori în engleză, română și arabă — inclusiv interfețe de la dreapta la stânga.' },
      { title: 'Rezultatul îți aparține', description: 'Codul, modelele și datele sunt ale tale. Fără blocaje, cu documentație completă și predare.' },
    ],
  },
  cta: {
    title: 'Ești gata să pui AI-ul la lucru în afacerea ta?',
    description: 'Programează un apel strategic gratuit. Identificăm cazul cu cel mai mare impact și schițăm un plan de pilot.',
    button: 'Programează o consultanță',
  },
  faq: {
    eyebrow: 'Întrebări frecvente',
    title: 'Întrebări frecvente',
    items: [
      { q: 'Ce face o companie de inginerie AI?', a: 'Proiectăm, construim, implementăm și întreținem sisteme AI — aplicații LLM, agenți, viziune computerizată și modele ML — integrate cu software-ul existent pentru a aduce valoare zilnic.' },
      { q: 'În cât timp vedem rezultate?', a: 'Majoritatea colaborărilor încep cu un pilot care livrează un sistem funcțional pe date reale în 4–6 săptămâni. Lansarea completă urmează de obicei în 2–4 luni.' },
      { q: 'Cât costă un proiect AI?', a: 'Costul depinde de scop, date și integrări. După un scurt apel de descoperire oferim o estimare scrisă cu etape fixe, fără surprize.' },
      { q: 'Poate rula AI-ul pe infrastructura noastră?', a: 'Da. Implementăm în contul tău de cloud sau on-premise și putem folosi modele open-weight când datele nu trebuie să părăsească mediul tău.' },
      { q: 'Suportați araba și româna?', a: 'Da. Construim sisteme și interfețe multilingve în engleză, română și arabă, inclusiv suport complet de la dreapta la stânga.' },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Hai să vorbim despre proiectul tău AI',
    description: 'Spune-ne ce vrei să automatizezi sau să construiești. Un inginer senior îți răspunde cu pașii următori.',
    email: 'hello@hilyoon.com',
    responseTime: 'Răspundem în cel mult o zi lucrătoare.',
    form: {
      name: 'Nume complet',
      email: 'Email de serviciu',
      company: 'Companie',
      message: 'Ce ai dori să construiești?',
      submit: 'Trimite mesajul',
      note: 'Se deschide aplicația de email cu mesajul pregătit.',
    },
  },
  footer: {
    tagline: 'Companie de inginerie AI care construiește aplicații LLM, agenți și sisteme machine learning de producție.',
    columns: [
      {
        title: 'Servicii',
        links: [
          { label: 'AI generativ și LLM', href: '#services' },
          { label: 'Dezvoltare agenți AI', href: '#services' },
          { label: 'RAG și cunoștințe', href: '#services' },
          { label: 'Viziune computerizată', href: '#services' },
          { label: 'MLOps și implementare', href: '#services' },
        ],
      },
      {
        title: 'Industrii',
        links: [
          { label: 'Sănătate', href: '#industries' },
          { label: 'Finanțe și asigurări', href: '#industries' },
          { label: 'Retail și e-commerce', href: '#industries' },
          { label: 'Producție', href: '#industries' },
          { label: 'Logistică', href: '#industries' },
        ],
      },
      {
        title: 'Companie',
        links: [
          { label: 'Proiecte', href: '/projects' },
          { label: 'Abordarea noastră', href: '#approach' },
          { label: 'De ce Hilyoon', href: '#why' },
          { label: 'Blog', href: '/blog' },
          { label: 'Întrebări frecvente', href: '#faq' },
          { label: 'Contact', href: '#contact' },
        ],
      },
    ],
    rights: 'Toate drepturile rezervate.',
  },
}

const ar: HomeContent = {
  nav: {
    services: 'الخدمات',
    industries: 'القطاعات',
    approach: 'منهجيتنا',
    projects: 'مشاريعنا',
    blog: 'المدونة',
    contact: 'تواصل معنا',
    cta: 'احجز استشارة',
    allServices: 'جميع الخدمات',
  },
  hero: {
    eyebrow: 'شركة هندسة ذكاء اصطناعي',
    title: 'نبني أنظمة ذكاء اصطناعي',
    highlight: 'تعمل داخل أعمالك',
    description:
      'تصمم هيليون وتبني وتشغّل حلول ذكاء اصطناعي جاهزة للإنتاج — من تطبيقات النماذج اللغوية والوكلاء الأذكياء إلى الرؤية الحاسوبية وخطوط تعلم الآلة — مدمجة مع الأدوات التي يستخدمها فريقك بالفعل.',
    proof: ['نموذج تجريبي خلال 4–6 أسابيع', 'هندسة موجهة للإنتاج', 'بياناتك تبقى ملكك'],
    primary: 'احجز استشارة',
    secondary: 'استكشف الخدمات',
    tabsLabel: 'شاهد وكيلاً أثناء العمل',
    demos: [
      {
        tab: 'المالية',
        title: 'وكيل الفواتير',
        subtitle: 'أتمتة الحسابات الدائنة',
        metric: '−65%',
        metricLabel: 'وقت المعالجة',
        steps: [
          { label: 'استلام الفاتورة من البريد', status: 'done' },
          { label: 'استخراج الحقول وتصنيفها', status: 'done' },
          { label: 'مطابقتها مع أمر الشراء', status: 'verified' },
          { label: 'إحالة الاختلاف للموافقة', status: 'review' },
          { label: 'ترحيلها إلى نظام ERP', status: 'queued' },
        ],
        reviewer: 'موافقة بشرية ضمن الحلقة',
      },
      {
        tab: 'الدعم',
        title: 'وكيل الدعم',
        subtitle: 'خدمة عملاء متعددة اللغات',
        metric: '70%',
        metricLabel: 'تذاكر تُحل تلقائياً',
        steps: [
          { label: 'وصول تذكرة (EN / RO / AR)', status: 'done' },
          { label: 'تحديد النية والمشاعر', status: 'done' },
          { label: 'صياغة الرد من قاعدة المعرفة', status: 'verified' },
          { label: 'تصعيد طلب الاسترداد', status: 'review' },
          { label: 'تحديث CRM وإشعار العميل', status: 'queued' },
        ],
        reviewer: 'يحيل الحالات الخاصة إلى فريقك',
      },
      {
        tab: 'العمليات',
        title: 'وكيل الفحص',
        subtitle: 'مراقبة الجودة بالرؤية الحاسوبية',
        metric: '98%',
        metricLabel: 'اكتشاف العيوب',
        steps: [
          { label: 'التقاط صورة على خط الإنتاج', status: 'done' },
          { label: 'تحديد العيوب بنموذج الرؤية', status: 'done' },
          { label: 'تقييم الخطورة وفق المواصفات', status: 'verified' },
          { label: 'إرسال القطعة الحدّية للمفتش', status: 'review' },
          { label: 'تصدير تقرير الجودة', status: 'queued' },
        ],
        reviewer: 'المفتش يؤكد الحالات الحدّية',
      },
    ],
    statusLabels: { done: 'تم', verified: 'تم التحقق', review: 'مراجعة', queued: 'في الانتظار' },
    replay: 'إعادة',
    example: 'مثال على سير عمل',
  },
  stack: { title: 'نعمل بأحدث تقنيات الذكاء الاصطناعي' },
  solutions: {
    eyebrow: 'ماذا نبني',
    title: 'حلول ذكاء اصطناعي مصممة لسير العمل الحقيقي',
    description: 'أنظمة عملية تلغي العمل اليدوي وتتكامل مع برمجياتك الحالية وتُبقي القرار بيد البشر.',
    items: [
      {
        industry: 'ذكاء المستندات',
        title: 'حوّل المستندات غير المنظمة إلى بيانات منظمة',
        description: 'خطوط استخراج وتصنيف وتحقق للفواتير والعقود والنماذج والتقارير.',
        tags: ['LLM', 'OCR', 'RAG'],
      },
      {
        industry: 'وكلاء الذكاء الاصطناعي',
        title: 'وكلاء ينجزون المهام متعددة الخطوات بالكامل',
        description: 'وكلاء يقرؤون ويقررون وينفذون عبر CRM وERP والبريد وواجهاتك البرمجية الداخلية.',
        tags: ['وكلاء', 'أدوات', 'سير عمل'],
      },
      {
        industry: 'الرؤية الحاسوبية',
        title: 'رؤية وقياس ما يهم في الصور والفيديو',
        description: 'نماذج كشف وتقسيم وفحص تُنشر على السحابة أو على الأجهزة الطرفية.',
        tags: ['رؤية', 'Edge AI', 'MLOps'],
      },
    ],
  },
  approach: {
    eyebrow: 'منهجيتنا',
    title: 'من الفكرة إلى الإنتاج — دون تخمين',
    description: 'عملية هندسية مركّزة تثبت القيمة مبكراً وتوسّع ما ينجح.',
    items: [
      { icon: 'target', title: 'نموذج تجريبي مركّز', description: 'نبدأ بسير عمل واحد عالي القيمة ونثبت الأثر خلال أسابيع لا أرباع سنة.' },
      { icon: 'layers', title: 'هندسة متكاملة', description: 'البيانات والنماذج والتكامل والنشر والمراقبة — فريق واحد مسؤول عن كل شيء.' },
      { icon: 'shield', title: 'أمان منذ التصميم', description: 'نشر خاص وصلاحيات وصول وسجلات تدقيق منذ اليوم الأول.' },
      { icon: 'trending', title: 'نتائج قابلة للقياس', description: 'لكل مشروع مؤشرات أداء واضحة لتعرف بدقة ما يقدمه الذكاء الاصطناعي.' },
    ],
    stats: [
      { value: '4–6 أسابيع', label: 'من الانطلاق إلى نموذج يعمل' },
      { value: '3', label: 'لغات مدعومة: EN · RO · AR' },
      { value: '24/7', label: 'مراقبة الأنظمة في الإنتاج' },
    ],
  },
  services: {
    eyebrow: 'الخدمات',
    title: 'خدمات هندسة الذكاء الاصطناعي حول سير عملك',
    description: 'مهندسون خبراء ينقلون الذكاء الاصطناعي من النموذج الأولي إلى برمجيات إنتاج موثوقة.',
    learnMore: 'ناقش مشروعك',
    items: [
      { icon: 'sparkles', title: 'الذكاء التوليدي وتطبيقات LLM', description: 'مساعدون وأنظمة محتوى مبنية على أفضل النماذج اللغوية، مضبوطة للدقة والتكلفة.' },
      { icon: 'bot', title: 'تطوير وكلاء الذكاء الاصطناعي', description: 'وكلاء مستقلون أو بإشراف بشري يستخدمون الأدوات والواجهات لإنجاز مهام حقيقية.' },
      { icon: 'database', title: 'RAG وأنظمة المعرفة', description: 'بحث متجهي وخطوط استرجاع تستند إلى مستنداتك وبياناتك الخاصة.' },
      { icon: 'eye', title: 'الرؤية الحاسوبية', description: 'كشف وتعرّف ضوئي على النصوص وتقسيم وفحص بصري للصور والفيديو والمستندات.' },
      { icon: 'brain', title: 'هندسة تعلم الآلة', description: 'نماذج تنبؤ وتصنيف وتوصية مدرّبة على بياناتك.' },
      { icon: 'server', title: 'MLOps والنشر', description: 'تكامل ونشر مستمر للنماذج وتقييم ومراقبة وتشغيل قابل للتوسع سحابياً أو محلياً.' },
      { icon: 'plug', title: 'تكامل وأتمتة الذكاء الاصطناعي', description: 'نربط الذكاء الاصطناعي بأنظمة ERP وCRM والدعم والأنظمة الداخلية لأتمتة العمل.' },
      { icon: 'compass', title: 'استراتيجية وإثبات مفهوم', description: 'نحدد حالات الاستخدام الأعلى عائداً ونتحقق منها بسرعة بنموذج يعمل.' },
    ],
  },
  industries: {
    eyebrow: 'القطاعات',
    title: 'ذكاء اصطناعي يفهم قطاعك',
    items: [
      { icon: 'heart', name: 'الرعاية الصحية', useCases: ['التوثيق السريري', 'الترميز الطبي', 'فرز المرضى'] },
      { icon: 'landmark', name: 'المالية والتأمين', useCases: ['معالجة المطالبات', 'كشف الاحتيال', 'أتمتة اعرف عميلك'] },
      { icon: 'shopping', name: 'التجزئة والتجارة الإلكترونية', useCases: ['البحث عن المنتجات', 'توقع الطلب', 'وكلاء الدعم'] },
      { icon: 'factory', name: 'التصنيع', useCases: ['الفحص البصري', 'الصيانة التنبؤية', 'استخراج قوائم المواد'] },
      { icon: 'truck', name: 'الخدمات اللوجستية', useCases: ['تحسين المسارات', 'أتمتة المستندات', 'توقع وقت الوصول'] },
      { icon: 'building', name: 'العقارات', useCases: ['تلخيص عقود الإيجار', 'نماذج التقييم', 'مساعدو المستأجرين'] },
    ],
  },
  why: {
    eyebrow: 'لماذا هيليون',
    title: 'ما الذي يجعل هيليون شريكاً مختلفاً في هندسة الذكاء الاصطناعي',
    items: [
      { title: 'الإثبات قبل التوسع', description: 'نتحقق من الأثر على سير عمل حقيقي قبل أن تلتزم بمشروع كبير.' },
      { title: 'إنتاج لا عروض تجريبية', description: 'التقييم وضوابط الأمان والمراقبة والبدائل جزء من كل تسليم.' },
      { title: 'متعدد اللغات افتراضياً', description: 'أنظمة مصممة لمستخدمي الإنجليزية والرومانية والعربية — بما في ذلك الواجهات من اليمين لليسار.' },
      { title: 'النتيجة ملكك', description: 'الكود والنماذج والبيانات لك. دون احتكار، مع توثيق كامل وتسليم.' },
    ],
  },
  cta: {
    title: 'هل أنت مستعد لتشغيل الذكاء الاصطناعي في أعمالك؟',
    description: 'احجز مكالمة استراتيجية مجانية. سنحدد حالة الاستخدام الأعلى أثراً ونضع خطة للنموذج التجريبي.',
    button: 'احجز استشارة',
  },
  faq: {
    eyebrow: 'الأسئلة الشائعة',
    title: 'الأسئلة الشائعة',
    items: [
      { q: 'ماذا تفعل شركة هندسة الذكاء الاصطناعي؟', a: 'نصمم ونبني وننشر ونصون أنظمة الذكاء الاصطناعي — تطبيقات النماذج اللغوية والوكلاء والرؤية الحاسوبية ونماذج تعلم الآلة — ونربطها ببرمجياتك الحالية لتحقق قيمة في العمل اليومي.' },
      { q: 'متى نرى النتائج؟', a: 'تبدأ معظم المشاريع بنموذج تجريبي مركّز يقدم نظاماً يعمل على بيانات حقيقية خلال 4–6 أسابيع، ويليه الإطلاق الكامل عادة خلال 2–4 أشهر حسب النطاق.' },
      { q: 'كم تبلغ تكلفة مشروع ذكاء اصطناعي؟', a: 'تعتمد التكلفة على النطاق والبيانات والتكاملات. بعد مكالمة استكشافية قصيرة نقدم تقديراً مكتوباً بمراحل ثابتة دون مفاجآت.' },
      { q: 'هل يمكن تشغيل الذكاء الاصطناعي على بنيتنا التحتية؟', a: 'نعم. ننشر على حسابك السحابي أو محلياً، ويمكننا استخدام نماذج مفتوحة الأوزان عندما يجب ألا تغادر البيانات بيئتك.' },
      { q: 'هل تدعمون العربية والرومانية؟', a: 'نعم. نبني أنظمة وواجهات متعددة اللغات بالإنجليزية والرومانية والعربية مع دعم كامل للكتابة من اليمين لليسار.' },
    ],
  },
  contact: {
    eyebrow: 'تواصل معنا',
    title: 'لنتحدث عن مشروع الذكاء الاصطناعي الخاص بك',
    description: 'أخبرنا بما تريد أتمتته أو بناءه، وسيرد عليك مهندس خبير بالخطوات التالية.',
    email: 'hello@hilyoon.com',
    responseTime: 'نرد خلال يوم عمل واحد.',
    form: {
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني للعمل',
      company: 'الشركة',
      message: 'ما الذي تود بناءه؟',
      submit: 'إرسال الرسالة',
      note: 'سيفتح تطبيق البريد لديك والرسالة جاهزة للإرسال.',
    },
  },
  footer: {
    tagline: 'شركة هندسة ذكاء اصطناعي تبني تطبيقات النماذج اللغوية والوكلاء وأنظمة تعلم الآلة الجاهزة للإنتاج.',
    columns: [
      {
        title: 'الخدمات',
        links: [
          { label: 'الذكاء التوليدي وLLM', href: '#services' },
          { label: 'تطوير الوكلاء', href: '#services' },
          { label: 'RAG وأنظمة المعرفة', href: '#services' },
          { label: 'الرؤية الحاسوبية', href: '#services' },
          { label: 'MLOps والنشر', href: '#services' },
        ],
      },
      {
        title: 'القطاعات',
        links: [
          { label: 'الرعاية الصحية', href: '#industries' },
          { label: 'المالية والتأمين', href: '#industries' },
          { label: 'التجزئة والتجارة', href: '#industries' },
          { label: 'التصنيع', href: '#industries' },
          { label: 'الخدمات اللوجستية', href: '#industries' },
        ],
      },
      {
        title: 'الشركة',
        links: [
          { label: 'مشاريعنا', href: '/projects' },
          { label: 'منهجيتنا', href: '#approach' },
          { label: 'لماذا هيليون', href: '#why' },
          { label: 'المدونة', href: '/blog' },
          { label: 'الأسئلة الشائعة', href: '#faq' },
          { label: 'تواصل معنا', href: '#contact' },
        ],
      },
    ],
    rights: 'جميع الحقوق محفوظة.',
  },
}

export const homeContent: Record<Locale, HomeContent> = { en, ro, ar }

export function getHomeContent(locale: Locale): HomeContent {
  return homeContent[locale] ?? homeContent.en
}

export const techStack = [
  'OpenAI', 'Anthropic Claude', 'Llama', 'Mistral', 'LangChain', 'LlamaIndex', 'Hugging Face',
  'PyTorch', 'TensorFlow', 'scikit-learn', 'pgvector', 'Pinecone', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'Google Cloud', 'FastAPI', 'Next.js',
]
