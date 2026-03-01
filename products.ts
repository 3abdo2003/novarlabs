export interface Product {
  slug: string;
  name: string;
  series: string;
  price: string;
  image: string;
  description: string;
  size: string;
}

export const peptides: Product[] = [
  {
    slug: 'cjc-ipamorelin',
    name: 'CJC-IPAMORELIN',
    series: 'GROWTH',
    price: '$78.00',
    image: '/CJC-IPAMORELIN-removebg-preview.png',
    size: '5 mg / vial',
    description:
      'Growth hormone-releasing hormone (GHRH) analog combined with a selective GH secretagogue. Research applications include studies on GH pulsatility, IGF-1 elevation, and metabolic parameters. The blend mimics natural somatotropic signaling with extended half-life.',
  },
  {
    slug: 'mots-c',
    name: 'MOTS-C',
    series: 'METABOLIC',
    price: '$85.00',
    image: '/MOTS-C-removebg-preview.png',
    size: '10 mg / vial',
    description:
      'Mitochondrial-derived peptide (14 aa) encoded in the 12S rRNA. Studied for its role in metabolic regulation, insulin sensitivity, and exercise capacity. Research focuses on mitochondrial stress response and age-related metabolic pathways.',
  },
  {
    slug: 'retatrutide',
    name: 'RETATRUTIDE',
    series: 'METABOLIC',
    price: '$89.00',
    image: '/RETATRUTIDE-removebg-preview.png',
    size: '10 mg / vial',
    description:
      'Triple agonist targeting GLP-1, GIP, and glucagon receptors. Used in metabolic and weight-related research. Supports studies on energy expenditure, glucose homeostasis, and receptor signaling cascades.',
  },
  {
    slug: 'aod-9604',
    name: 'AOD-9604',
    series: 'METABOLIC',
    price: '$82.00',
    image: '/AOD-9604-removebg-preview.png',
    size: '5 mg / vial',
    description:
      'C-terminal fragment (177–191) of growth hormone. Research indicates lipolytic and metabolic effects without full GH receptor activation. Studied for lipid metabolism and fat cell signaling in laboratory settings.',
  },
  {
    slug: 'bpc157-tb500',
    name: 'BPC157_TB500',
    series: 'REPAIR',
    price: '$95.00',
    image: '/BPC157_TB500-removebg-preview.png',
    size: '10 mg / vial',
    description:
      'Combination of Body Protection Compound and thymosin beta-4 fragment. Research applications include tissue repair, angiogenesis, cell migration, and wound-healing models. Used in studies on tendon, muscle, and vascular recovery.',
  },
  {
    slug: 'ghk-cu',
    name: 'GHK-CU',
    series: 'REPAIR',
    price: '$88.00',
    image: '/GHK-CU-removebg-preview.png',
    size: '5 mg / vial',
    description:
      'Copper-binding peptide complex (glycyl-l-histidyl-l-lysine). Studied for collagen synthesis, wound healing, antioxidant activity, and tissue remodeling. Used in dermatological and regenerative research.',
  },
  {
    slug: 'slu-pp-332',
    name: 'SLU-PP-332',
    series: 'RESEARCH',
    price: '$92.00',
    image: '/SLU-PP-332-removebg-preview.png',
    size: '5 mg / vial',
    description:
      'Research compound of interest in metabolic and signaling studies. For in vitro and in vivo laboratory use under appropriate protocols. Purity and stability verified for controlled research environments.',
  },
];

export const findPeptideBySlug = (slug: string): Product | undefined =>
  peptides.find((p) => p.slug === slug);

export const findPeptideByName = (name: string): Product | undefined =>
  peptides.find((p) => p.name === name);

