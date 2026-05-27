export type CompanyCategory = 'core' | 'growth';

export interface Company {
  ticker: string;
  name: string;
  category: CompanyCategory;
  website: string;
  description: string;
  sector: string;
  thesis?: string;
  riskRating?: 'Low' | 'Medium' | 'High';
  tam?: string;
}

export const COMPANIES: Company[] = [
  {
    ticker: 'AMD',
    name: 'Advanced Micro Devices',
    category: 'growth',
    website: 'https://www.amd.com',
    sector: 'Semiconductors',
    description: 'Designs and markets CPUs, GPUs, and data center processors. A key AI infrastructure beneficiary competing directly with Nvidia and Intel.',
    thesis: 'MI300X AI accelerator ramp + x86 CPU share gains from Intel. AI data center TAM expanding rapidly with AMD taking meaningful share.',
    riskRating: 'High',
    tam: '$400B+ AI accelerator market by 2027',
  },
  {
    ticker: 'MU',
    name: 'Micron Technology',
    category: 'growth',
    website: 'https://www.micron.com',
    sector: 'Semiconductors',
    description: 'One of the world\'s leading manufacturers of DRAM, NAND flash, and high-bandwidth memory (HBM) for AI systems.',
    thesis: 'HBM3E demand from AI training GPUs driving a structural memory supercycle. Pricing power and margin expansion ahead.',
    riskRating: 'High',
    tam: '$200B+ memory market, HBM growing 50%+ annually',
  },
  {
    ticker: 'ELF',
    name: 'e.l.f. Beauty',
    category: 'growth',
    website: 'https://www.elfcosmetics.com',
    sector: 'Consumer',
    description: 'Value-focused cosmetics brand disrupting prestige beauty with mass-market pricing and viral social media strategy.',
    thesis: 'Consistent market share gains vs. legacy beauty brands. Strong Gen Z brand loyalty + international expansion still early innings.',
    riskRating: 'Medium',
    tam: '$580B global beauty market',
  },
  {
    ticker: 'NOW',
    name: 'ServiceNow',
    category: 'core',
    website: 'https://www.servicenow.com',
    sector: 'Enterprise Software',
    description: 'Leading cloud platform for enterprise workflow automation and IT service management, with a growing AI product suite.',
    thesis: 'Deep enterprise moats with high switching costs. AI features (Now Assist) expanding ARPU across existing base.',
    riskRating: 'Medium',
    tam: '$220B IT workflow automation market',
  },
  {
    ticker: 'CRM',
    name: 'Salesforce',
    category: 'core',
    website: 'https://www.salesforce.com',
    sector: 'Enterprise Software',
    description: 'The world\'s #1 CRM platform, serving over 150,000 companies with sales, service, marketing, and AI-powered tools.',
    thesis: 'Agentforce AI platform launch opens a new monetization frontier. Data Cloud differentiates Salesforce in the AI era.',
    riskRating: 'Low',
    tam: '$200B+ CRM and customer data market',
  },
  {
    ticker: 'DOCU',
    name: 'DocuSign',
    category: 'growth',
    website: 'https://www.docusign.com',
    sector: 'Enterprise Software',
    description: 'Dominant e-signature platform expanding into intelligent agreement management and contract lifecycle workflows.',
    thesis: 'IAM (Intelligent Agreement Management) platform pivots DocuSign from a point solution to a platform. Valuation still reasonable post-reset.',
    riskRating: 'Medium',
    tam: '$50B+ agreement management market',
  },
  {
    ticker: 'CVX',
    name: 'Chevron',
    category: 'core',
    website: 'https://www.chevron.com',
    sector: 'Energy',
    description: 'One of the largest integrated oil & gas companies globally, with upstream, downstream, and LNG operations spanning 180+ countries.',
    thesis: 'Disciplined capital returns via buybacks and dividend. Hess acquisition adds Guyana production upside at attractive economics.',
    riskRating: 'Low',
    tam: 'Global oil & gas: $5T+ annual revenue industry',
  },
  {
    ticker: 'COST',
    name: 'Costco',
    category: 'core',
    website: 'https://www.costco.com',
    sector: 'Consumer Staples',
    description: 'Membership-based warehouse retailer with best-in-class customer loyalty, operating in 14 countries with 130M+ members.',
    thesis: 'Membership fee stream provides recession-resistant revenue. International expansion and e-commerce still growing meaningfully.',
    riskRating: 'Low',
    tam: 'Global retail: $25T market',
  },
  {
    ticker: 'CAKE',
    name: 'Cheesecake Factory',
    category: 'core',
    website: 'https://www.thecheesecakefactory.com',
    sector: 'Restaurants',
    description: 'Iconic full-service restaurant chain operating 200+ locations plus Fox Restaurant Concepts and North Italia brands.',
    thesis: 'Licensing expansion model (licensing in Middle East, Asia) adds asset-light growth. Menu innovation and off-premise sales growing.',
    riskRating: 'Medium',
    tam: 'U.S. full-service dining: $300B+ market',
  },
];

export const GROWTH_TICKERS = ['AMD', 'MU', 'ELF', 'DOCU'];
export const ALL_TICKERS = COMPANIES.map(c => c.ticker);

export const METRIC_EXPLANATIONS: Record<string, { label: string; explanation: string; good: string; bad: string }> = {
  pe: {
    label: 'P/E Ratio',
    explanation: 'Price divided by earnings per share. Shows how much investors pay per dollar of profit.',
    good: 'Lower P/E can signal undervaluation (especially for value stocks)',
    bad: 'Very high P/E means high expectations — a miss on earnings can hurt the stock',
  },
  forwardPe: {
    label: 'Forward P/E',
    explanation: 'Price divided by next 12 months expected earnings. More forward-looking than trailing P/E.',
    good: 'Forward P/E lower than trailing P/E suggests earnings are expected to grow',
    bad: 'Based on analyst estimates that may be too optimistic',
  },
  ps: {
    label: 'P/S Ratio',
    explanation: 'Price divided by annual revenue per share. Useful for high-growth companies not yet profitable.',
    good: 'Low P/S relative to peers may indicate undervaluation',
    bad: 'Revenue without profits can be misleading — always pair with margins',
  },
  pb: {
    label: 'P/B Ratio',
    explanation: 'Price divided by book value (assets minus liabilities). Shows what investors pay vs. accounting value.',
    good: 'Below 1.0 can signal deep value (assets worth more than market cap)',
    bad: 'High P/B expected for software/tech companies with few tangible assets',
  },
  evEbitda: {
    label: 'EV/EBITDA',
    explanation: 'Enterprise value divided by earnings before interest, taxes, depreciation. Capital-structure neutral valuation.',
    good: 'Better than P/E for comparing companies with different debt levels',
    bad: 'Strips out real expenses like capex — doesn\'t tell the full story',
  },
  debtEquity: {
    label: 'Debt/Equity',
    explanation: 'Total debt divided by shareholder equity. Measures financial leverage and risk.',
    good: 'Below 0.5 is generally considered conservative and safe',
    bad: 'Above 2.0 means the company is highly leveraged — risky in downturns',
  },
};
