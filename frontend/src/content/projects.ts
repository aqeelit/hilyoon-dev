// Hilyoon projects (portfolio). Source for MedPredix:
// "Medpredix - منصة التصوير الطبي مدعومة بالذكاء الاصطناعي.docx" (Sep 2025)
import type { Locale } from '@/types'

export interface ProjectPlan {
  name: string
  price: string
  period?: string
  audience: string
  features: string[]
  highlighted?: boolean
}

export interface ProjectContent {
  name: string
  tagline: string
  category: string
  summary: string
  status: string
  highlights: string[] // value propositions
  stats: { value: string; label: string }[]
  platforms: {
    title: string
    tech: string
    features: string[]
  }[]
  models: { name: string; modality: string; value: string; metric: string }[]
  featureGroups: { title: string; items: string[] }[]
  plans: ProjectPlan[]
  stack: string[]
  disclaimer: string
  ui: {
    projectsTitle: string
    projectsSubtitle: string
    viewProject: string
    backToProjects: string
    builtBy: string
    highlightsTitle: string
    platformsEyebrow: string
    platformsTitle: string
    interfaceLabel: string
    interfacePanels: [string, string, string]
    modelsEyebrow: string
    modelsTitle: string
    featuresEyebrow: string
    featuresTitle: string
    pricingEyebrow: string
    pricingTitle: string
    pricingNote: string
    audienceLabel: string
    stackTitle: string
    ctaTitle: string
    ctaDescription: string
    ctaButton: string
    demoButton: string
    illustration: string
  }
}

export interface Project {
  slug: string
  logo: string
  accent: { from: string; to: string } // project brand colors
  year: string
  contactEmail: string
  content: Record<Locale, ProjectContent>
}

const medpredix: Project = {
  slug: 'medpredix',
  logo: '/projects/medpredix/logo.svg',
  accent: { from: '#06b6d4', to: '#10b981' },
  year: '2025',
  contactEmail: 'office@hilyoon.com',
  content: {
    en: {
      name: 'MedPredix',
      tagline: 'AI-powered medical imaging platform',
      category: 'Healthcare · Medical imaging AI',
      summary:
        'MedPredix combines deep learning with professional-grade DICOM viewing in a dual-platform product: a modern web application and a powerful desktop viewer, both with built-in AI diagnostic assistance — from image upload to AI analysis to a finished medical report.',
      status: 'Built by Hilyoon · In production',
      highlights: [
        'Up to 97% diagnostic accuracy across X-ray, MRI and CT using state-of-the-art deep learning models',
        'Enterprise-grade security with built-in HIPAA and GDPR compliance features',
        'Available on the web and on desktop',
        'End-to-end workflow: image upload, AI analysis and professional report generation',
        'Scales from individual doctors to large healthcare organizations',
      ],
      stats: [
        { value: '97%', label: 'Diagnostic accuracy' },
        { value: '3', label: 'Imaging modalities' },
        { value: '2', label: 'Platforms: web & desktop' },
      ],
      platforms: [
        {
          title: 'Web platform',
          tech: 'Next.js · React',
          features: [
            'Modern three-panel interface: Sources (files), Analysis (AI processing) and Studio (reports)',
            'Case-based workflow with a dashboard that organizes studies by case',
            'Real-time AI analysis with instant feedback and confidence scoring',
            'Standardized medical report generation with export',
          ],
        },
        {
          title: 'Desktop application',
          tech: 'Python · PyQt6',
          features: [
            'Professional DICOM viewer with medical measurement tools and 2D/3D visualization',
            'Local processing that works offline in secure environments',
            'Zoom, pan and window/level adjustment',
            'Runs on Windows and macOS',
          ],
        },
      ],
      models: [
        { name: 'Pneumonia detection', modality: 'Chest X-ray', value: '94%+', metric: 'accuracy' },
        { name: 'Brain tumor classification', modality: 'Brain MRI', value: '92%+', metric: 'across 4 tumor types' },
        { name: 'Colon cancer detection', modality: 'Colon CT', value: '98%+', metric: 'sensitivity' },
      ],
      featureGroups: [
        {
          title: 'Medical imaging',
          items: [
            'Full DICOM support with metadata extraction and conversion',
            'Multi-modality: X-ray (chest), MRI (brain), CT (colon) — extensible to more',
            'Measurements, annotations and comparison tools',
          ],
        },
        {
          title: 'AI-assisted diagnosis',
          items: [
            'Automatic image classification and routing to the right model',
            'Confidence scoring with visual highlighting',
            'Results presented in the proper clinical context',
          ],
        },
        {
          title: 'Professional reporting',
          items: [
            'Automatic standardized medical reports',
            'AI-assisted prescription generation',
            'Export to PDF, email and print',
          ],
        },
        {
          title: 'Security & compliance',
          items: [
            'HIPAA / GDPR features: encryption, audit logs, access control',
            'JWT authentication with role-based access',
            'Encrypted, secure data storage',
          ],
        },
      ],
      plans: [
        {
          name: 'Free',
          price: '$0',
          audience: 'Individual doctors, students, small clinics',
          features: ['Local DICOM viewing', 'Basic processing tools', 'Limited AI analysis (100 credits/month)', 'No cloud or advanced features'],
        },
        {
          name: 'Premium',
          price: '$150',
          period: '/month',
          audience: 'Individual radiologists, small and medium practices',
          features: ['Full AI analysis (3,000 credits/month)', 'Cloud storage & sync', 'Professional reports & PDF export', '24/7 technical support'],
          highlighted: true,
        },
        {
          name: 'Teams',
          price: '$450',
          period: '/month',
          audience: 'Medium-sized medical groups, radiology departments',
          features: ['Multi-user collaboration', 'Centralized management & billing', 'Shared workspaces & case management', 'Advanced analytics & usage tracking', 'API access for integration'],
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          audience: 'Hospitals, health systems, teleradiology companies',
          features: ['Enterprise-wide deployment', 'Custom integrations (PACS, EMR, HIS)', 'Dedicated support & training', 'White-label options', 'Service level agreements (SLA)'],
        },
      ],
      stack: ['Next.js', 'React', 'Python', 'PyQt6', 'Deep learning', 'DICOM', 'REST API', 'JWT'],
      disclaimer:
        'Accuracy figures as reported by the MedPredix team. MedPredix is a diagnostic-support tool and does not replace clinical judgment.',
      ui: {
        projectsTitle: 'Our projects',
        projectsSubtitle: 'Products we have designed, engineered and shipped end to end.',
        viewProject: 'View project',
        backToProjects: 'All projects',
        builtBy: 'Built by Hilyoon',
        highlightsTitle: 'Why MedPredix',
        platformsEyebrow: 'Platform',
        platformsTitle: 'One product, two platforms',
        interfaceLabel: 'MedPredix web workspace',
        interfacePanels: ['Sources', 'Analysis', 'Studio'],
        modelsEyebrow: 'AI models',
        modelsTitle: 'Specialized deep learning models',
        featuresEyebrow: 'Capabilities',
        featuresTitle: 'Everything from the scan to the report',
        pricingEyebrow: 'Business model',
        pricingTitle: 'Plans for every size of practice',
        pricingNote: 'Prices in USD.',
        audienceLabel: 'For',
        stackTitle: 'Technology',
        ctaTitle: 'Interested in MedPredix?',
        ctaDescription: 'Talk to our business development team about a demo, a pilot or an enterprise deployment.',
        ctaButton: 'Contact business development',
        demoButton: 'Request a demo',
        illustration: 'Illustration',
      },
    },

    ro: {
      name: 'MedPredix',
      tagline: 'Platformă de imagistică medicală bazată pe AI',
      category: 'Sănătate · AI pentru imagistică medicală',
      summary:
        'MedPredix combină învățarea profundă cu vizualizarea DICOM profesională într-un produs pe două platforme: o aplicație web modernă și un vizualizator desktop puternic, ambele cu asistență de diagnostic AI integrată — de la încărcarea imaginii la analiza AI și raportul medical final.',
      status: 'Construit de Hilyoon · În producție',
      highlights: [
        'Acuratețe diagnostică de până la 97% pentru radiografii, RMN și CT, folosind modele avansate de învățare profundă',
        'Securitate de nivel enterprise cu funcții integrate de conformitate HIPAA și GDPR',
        'Disponibil pe web și pe desktop',
        'Flux complet: încărcarea imaginilor, analiza AI și generarea de rapoarte profesionale',
        'Se adaptează de la medici individuali la organizații medicale mari',
      ],
      stats: [
        { value: '97%', label: 'Acuratețe diagnostică' },
        { value: '3', label: 'Modalități imagistice' },
        { value: '2', label: 'Platforme: web și desktop' },
      ],
      platforms: [
        {
          title: 'Platforma web',
          tech: 'Next.js · React',
          features: [
            'Interfață modernă pe trei panouri: Surse (fișiere), Analiză (procesare AI) și Studio (rapoarte)',
            'Flux de lucru pe cazuri, cu un panou care organizează studiile pe caz',
            'Analiză AI în timp real, cu feedback instant și scor de încredere',
            'Generare de rapoarte medicale standardizate, cu export',
          ],
        },
        {
          title: 'Aplicația desktop',
          tech: 'Python · PyQt6',
          features: [
            'Vizualizator DICOM profesional cu instrumente de măsurare și vizualizare 2D/3D',
            'Procesare locală care funcționează offline în medii securizate',
            'Zoom, deplasare și ajustare fereastră/nivel',
            'Rulează pe Windows și macOS',
          ],
        },
      ],
      models: [
        { name: 'Detectarea pneumoniei', modality: 'Radiografie toracică', value: '94%+', metric: 'acuratețe' },
        { name: 'Clasificarea tumorilor cerebrale', modality: 'RMN cerebral', value: '92%+', metric: 'pentru 4 tipuri de tumori' },
        { name: 'Detectarea cancerului de colon', modality: 'CT colon', value: '98%+', metric: 'sensibilitate' },
      ],
      featureGroups: [
        {
          title: 'Imagistică medicală',
          items: [
            'Suport DICOM complet, cu extragere de metadate și conversie',
            'Multi-modalitate: radiografie (torace), RMN (creier), CT (colon) — extensibil',
            'Măsurători, adnotări și instrumente de comparație',
          ],
        },
        {
          title: 'Diagnostic asistat de AI',
          items: [
            'Clasificare automată a imaginilor și direcționare către modelul potrivit',
            'Scor de încredere cu evidențiere vizuală',
            'Rezultate prezentate în contextul clinic corect',
          ],
        },
        {
          title: 'Rapoarte profesionale',
          items: [
            'Rapoarte medicale standardizate generate automat',
            'Generare de prescripții asistată de AI',
            'Export PDF, email și tipărire',
          ],
        },
        {
          title: 'Securitate și conformitate',
          items: [
            'Funcții HIPAA / GDPR: criptare, jurnale de audit, control acces',
            'Autentificare JWT cu acces pe roluri',
            'Stocare criptată și securizată a datelor',
          ],
        },
      ],
      plans: [
        {
          name: 'Gratuit',
          price: '$0',
          audience: 'Medici individuali, studenți, clinici mici',
          features: ['Vizualizare DICOM locală', 'Instrumente de bază', 'Analiză AI limitată (100 credite/lună)', 'Fără cloud sau funcții avansate'],
        },
        {
          name: 'Premium',
          price: '$150',
          period: '/lună',
          audience: 'Radiologi individuali, cabinete mici și medii',
          features: ['Analiză AI completă (3.000 credite/lună)', 'Stocare cloud și sincronizare', 'Rapoarte profesionale și export PDF', 'Suport tehnic 24/7'],
          highlighted: true,
        },
        {
          name: 'Echipe',
          price: '$450',
          period: '/lună',
          audience: 'Grupuri medicale medii, departamente de radiologie',
          features: ['Colaborare multi-utilizator', 'Administrare și facturare centralizate', 'Spații de lucru comune și gestionarea cazurilor', 'Analize avansate și urmărirea utilizării', 'Acces API pentru integrare'],
        },
        {
          name: 'Enterprise',
          price: 'Personalizat',
          audience: 'Spitale, sisteme de sănătate, companii de teleradiologie',
          features: ['Implementare la nivel de organizație', 'Integrări personalizate (PACS, EMR, HIS)', 'Suport și instruire dedicate', 'Opțiuni white-label', 'Acorduri de nivel de serviciu (SLA)'],
        },
      ],
      stack: ['Next.js', 'React', 'Python', 'PyQt6', 'Învățare profundă', 'DICOM', 'REST API', 'JWT'],
      disclaimer:
        'Cifrele de acuratețe sunt raportate de echipa MedPredix. MedPredix este un instrument de suport pentru diagnostic și nu înlocuiește judecata clinică.',
      ui: {
        projectsTitle: 'Proiectele noastre',
        projectsSubtitle: 'Produse pe care le-am proiectat, construit și lansat de la cap la coadă.',
        viewProject: 'Vezi proiectul',
        backToProjects: 'Toate proiectele',
        builtBy: 'Construit de Hilyoon',
        highlightsTitle: 'De ce MedPredix',
        platformsEyebrow: 'Platformă',
        platformsTitle: 'Un produs, două platforme',
        interfaceLabel: 'Spațiul de lucru web MedPredix',
        interfacePanels: ['Surse', 'Analiză', 'Studio'],
        modelsEyebrow: 'Modele AI',
        modelsTitle: 'Modele specializate de învățare profundă',
        featuresEyebrow: 'Capabilități',
        featuresTitle: 'Totul, de la scanare la raport',
        pricingEyebrow: 'Model de afaceri',
        pricingTitle: 'Planuri pentru orice dimensiune de cabinet',
        pricingNote: 'Prețuri în USD.',
        audienceLabel: 'Pentru',
        stackTitle: 'Tehnologie',
        ctaTitle: 'Te interesează MedPredix?',
        ctaDescription: 'Discută cu echipa noastră de dezvoltare a afacerilor despre un demo, un pilot sau o implementare enterprise.',
        ctaButton: 'Contactează echipa de afaceri',
        demoButton: 'Solicită un demo',
        illustration: 'Ilustrație',
      },
    },

    ar: {
      name: 'MedPredix',
      tagline: 'منصة طبية متكاملة للتصوير الطبي مدعومة بالذكاء الاصطناعي',
      category: 'الرعاية الصحية · ذكاء اصطناعي للتصوير الطبي',
      summary:
        'تجمع MedPredix بين تقنيات التعلم العميق المتقدمة وإمكانيات عرض DICOM عالية المستوى، من خلال بنية ثنائية المنصة: تطبيق ويب متطور وعارض سطح مكتب قوي، كلاهما مدمج بقدرات تشخيصية قائمة على الذكاء الاصطناعي — من رفع الصور حتى التحليل وتوليد التقرير الطبي.',
      status: 'من تطوير هيليون · قيد التشغيل',
      highlights: [
        'دقة تشخيصية تصل إلى 97% عبر الأشعة السينية والرنين المغناطيسي والتصوير المقطعي باستخدام نماذج تعلم عميق متطورة',
        'أمان بمستوى المؤسسات مع توافق مدمج مع HIPAA وGDPR',
        'إمكانية الوصول عبر منصات متعددة (ويب وسطح مكتب)',
        'تكامل شامل لسير العمل من رفع الصور حتى التحليل بالذكاء الاصطناعي وتوليد التقارير الطبية الاحترافية',
        'بنية قابلة للتوسع تدعم الأطباء الأفراد وحتى المؤسسات الطبية الكبرى',
      ],
      stats: [
        { value: '97%', label: 'دقة تشخيصية' },
        { value: '3', label: 'أنواع تصوير طبي' },
        { value: '2', label: 'منصتان: ويب وسطح مكتب' },
      ],
      platforms: [
        {
          title: 'منصة الويب',
          tech: 'Next.js · React',
          features: [
            'واجهة حديثة ثلاثية الألواح: المصادر (إدارة الملفات)، التحليل (المعالجة بالذكاء الاصطناعي)، والاستوديو (توليد التقارير)',
            'سير عمل قائم على الحالات مع لوحة تحكم بديهية لتنظيم الدراسات',
            'تحليل فوري بالذكاء الاصطناعي مع ملاحظات آنية وتقييم لمستوى الثقة',
            'توليد تقارير طبية قياسية مع إمكانيات التصدير',
          ],
        },
        {
          title: 'تطبيق سطح المكتب',
          tech: 'Python · PyQt6',
          features: [
            'عارض DICOM احترافي مع أدوات قياس طبية متقدمة وعرض ثنائي وثلاثي الأبعاد',
            'معالجة محلية للعمل دون اتصال بالإنترنت',
            'أدوات التكبير والتحريك وضبط النوافذ والمستويات',
            'يعمل على Windows وmacOS',
          ],
        },
      ],
      models: [
        { name: 'كشف الالتهاب الرئوي', modality: 'أشعة الصدر السينية', value: '94%+', metric: 'دقة' },
        { name: 'تصنيف أورام الدماغ', modality: 'رنين الدماغ المغناطيسي', value: '92%+', metric: 'عبر 4 أنواع من الأورام' },
        { name: 'كشف سرطان القولون', modality: 'التصوير المقطعي للقولون', value: '98%+', metric: 'حساسية' },
      ],
      featureGroups: [
        {
          title: 'التميز في التصوير الطبي',
          items: [
            'دعم كامل لمعيار DICOM مع استخراج البيانات الوصفية والتحويل',
            'تحليل متعدد الوسائط: أشعة سينية (الصدر)، رنين (الدماغ)، مقطعي (القولون) مع قابلية التوسع',
            'أدوات عرض احترافية مع القياسات والتعليقات والمقارنة',
          ],
        },
        {
          title: 'التشخيص المدعوم بالذكاء الاصطناعي',
          items: [
            'تصنيف ذكي للصور وتوجيه تلقائي للنموذج المناسب',
            'تقييم الثقة في القرارات مع إبراز بصري',
            'عرض النتائج ضمن السياق السريري الصحيح',
          ],
        },
        {
          title: 'نظام التقارير الاحترافية',
          items: [
            'توليد تقارير طبية قياسية تلقائياً',
            'توليد الوصفات العلاجية (الروشتة) بمساعدة الذكاء الاصطناعي',
            'تصدير PDF وإرسال بالبريد الإلكتروني وطباعة',
          ],
        },
        {
          title: 'الأمان والامتثال المؤسسي',
          items: [
            'توافق مع HIPAA وGDPR: تشفير وسجلات تدقيق وتحكم بالوصول',
            'مصادقة آمنة عبر JWT مع تحكم بالأدوار',
            'حماية البيانات بالتشفير والتخزين الآمن',
          ],
        },
      ],
      plans: [
        {
          name: 'المجانية',
          price: '$0',
          audience: 'الأطباء الأفراد، الطلاب، العيادات الصغيرة',
          features: ['عرض محلي لملفات DICOM', 'أدوات معالجة أساسية', 'تحليل محدود بالذكاء الاصطناعي (100 نقطة/شهر)', 'بدون سحابة أو ميزات متقدمة'],
        },
        {
          name: 'المميزة',
          price: '$150',
          period: '/شهر',
          audience: 'أطباء الأشعة الأفراد والممارسات الصغيرة والمتوسطة',
          features: ['تحليل كامل بالذكاء الاصطناعي (3000 نقطة/شهر)', 'تخزين سحابي ومزامنة', 'تقارير احترافية وتصدير PDF', 'دعم فني على مدار الساعة'],
          highlighted: true,
        },
        {
          name: 'الفرق',
          price: '$450',
          period: '/شهر',
          audience: 'المجموعات الطبية المتوسطة وأقسام الأشعة',
          features: ['تعاون متعدد المستخدمين', 'إدارة وفوترة مركزية', 'مساحات عمل مشتركة وإدارة الحالات', 'تحليلات متقدمة وتتبع الاستخدام', 'وصول API للتكامل'],
        },
        {
          name: 'المؤسسات',
          price: 'سعر مخصص',
          audience: 'المستشفيات وأنظمة الرعاية الصحية وشركات الأشعة عن بُعد',
          features: ['نشر على مستوى المؤسسات', 'تكاملات مخصصة (PACS، EMR، HIS)', 'دعم وتدريب مخصص', 'خيارات العلامة البيضاء', 'اتفاقيات مستوى الخدمة (SLA)'],
        },
      ],
      stack: ['Next.js', 'React', 'Python', 'PyQt6', 'التعلم العميق', 'DICOM', 'REST API', 'JWT'],
      disclaimer:
        'أرقام الدقة وفق ما أفاد به فريق MedPredix. MedPredix أداة مساندة للتشخيص ولا تحل محل التقييم السريري للطبيب.',
      ui: {
        projectsTitle: 'مشاريعنا',
        projectsSubtitle: 'منتجات صممناها وطورناها وأطلقناها بالكامل.',
        viewProject: 'عرض المشروع',
        backToProjects: 'كل المشاريع',
        builtBy: 'من تطوير هيليون',
        highlightsTitle: 'لماذا MedPredix',
        platformsEyebrow: 'المنصة',
        platformsTitle: 'منتج واحد على منصتين',
        interfaceLabel: 'مساحة عمل MedPredix على الويب',
        interfacePanels: ['المصادر', 'التحليل', 'الاستوديو'],
        modelsEyebrow: 'نماذج الذكاء الاصطناعي',
        modelsTitle: 'نماذج تعلم عميق متخصصة',
        featuresEyebrow: 'الإمكانات',
        featuresTitle: 'كل ما تحتاجه من الصورة حتى التقرير',
        pricingEyebrow: 'نموذج العمل',
        pricingTitle: 'خطط تناسب كل حجم ممارسة طبية',
        pricingNote: 'الأسعار بالدولار الأمريكي.',
        audienceLabel: 'مناسبة لـ',
        stackTitle: 'التقنيات',
        ctaTitle: 'مهتم بـ MedPredix؟',
        ctaDescription: 'تواصل مع فريق تطوير الأعمال لطلب عرض توضيحي أو تجربة أو نشر على مستوى المؤسسة.',
        ctaButton: 'تواصل مع تطوير الأعمال',
        demoButton: 'اطلب عرضاً توضيحياً',
        illustration: 'رسم توضيحي',
      },
    },
  },
}

export const projects: Project[] = [medpredix]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
