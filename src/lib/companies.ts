/**
 * Research data for the three shortlisted tour operators.
 *
 * Everything here was read from the companies' public websites and public
 * review platforms on 15 Nov 2026. Each fact carries a `basis` so the UI can
 * show where it came from. Update this file as discovery calls replace
 * website evidence with first-hand answers.
 */

export type CompanyId = "green" | "reddot" | "blue";

/** Where a fact comes from. */
export type Basis =
  | "site" // published on the company's own website
  | "platform" // a public review or listing platform
  | "reviews" // mentioned in guest reviews, not stated by the company
  | "inferred" // our reading of the evidence
  | "unpublished"; // looked for, not found

export const BASIS_LABEL: Record<Basis, string> = {
  site: "Company site",
  platform: "Review platform",
  reviews: "Guest reviews",
  inferred: "Our reading",
  unpublished: "Not published",
};

export type Fact = {
  text: string;
  detail?: string;
  basis: Basis;
};

/** Present / partly / absent / can't tell, used by every matrix. */
export type Status = "yes" | "partial" | "no" | "unknown";

export type Cell = { status: Status; note?: string };

export type ReviewPlatform = {
  platform: string;
  rating: string | null;
  count: number | null;
  note?: string;
};

export type PriceBand = {
  label: string;
  /** USD per person. */
  min: number;
  max: number;
  note: string;
};

export type TeamFunction =
  | "leadership"
  | "management"
  | "sales"
  | "operations"
  | "commercial"
  | "guides"
  | "hosts";

export const TEAM_FUNCTIONS: { id: TeamFunction; label: string; backOffice: boolean }[] = [
  { id: "leadership", label: "Leadership", backOffice: false },
  { id: "management", label: "Managers and advisers", backOffice: true },
  { id: "sales", label: "Sales and trip design", backOffice: true },
  { id: "operations", label: "Operations and reservations", backOffice: true },
  { id: "commercial", label: "Finance, marketing and support", backOffice: true },
  { id: "guides", label: "Guides and drivers", backOffice: false },
  { id: "hosts", label: "Local hosts", backOffice: false },
];

export type TeamCount = {
  /** People with a named profile on the company's own team page. */
  profiled: number;
  /** People evidenced another way: named in reviews, or pictured without a name. */
  other: number;
  note?: string;
};

/** Where a face sits in a photo, so a small tile can zoom in on it. */
export type PhotoFocus = {
  /** Face centre as a fraction of the photo's width and height. */
  x: number;
  y: number;
  /** How far to zoom in. 1 shows the photo's full width. */
  zoom: number;
  /** Photo width divided by height. Defaults to 3:4. */
  ratio?: number;
};

/** A person profiled on a company's public team page. */
export type TeamMember = {
  name: string;
  title: string;
  /** Photo URL on the company's own site. */
  photo?: string;
  /** For photos that are not head-and-shoulders: where the face is. */
  focus?: PhotoFocus;
  note?: string;
  /** The person's own LinkedIn profile URL, once confirmed. Without it the app links to a LinkedIn search. */
  linkedin?: string;
};

export type TeamGroup = {
  label: string;
  blurb?: string;
  members: TeamMember[];
};

export type TeamDirectory = {
  /** The page the profiles were read from. */
  source: string;
  groups: TeamGroup[];
};

export type JourneyStage = "discover" | "enquire" | "quote" | "pay" | "travel";

export const JOURNEY_STAGES: { id: JourneyStage; label: string; question: string }[] = [
  { id: "discover", label: "Discover", question: "What can a visitor see before talking to anyone?" },
  { id: "enquire", label: "Enquire", question: "How does a lead reach the company?" },
  { id: "quote", label: "Quote", question: "How is the trip priced and proposed?" },
  { id: "pay", label: "Pay", question: "How is the booking confirmed and paid?" },
  { id: "travel", label: "On trip", question: "What support exists once guests arrive?" },
];

export type Company = {
  id: CompanyId;
  slug: string;
  name: string;
  short: string;
  /** Logo files in public/logos, saved from the company's own website. */
  logo: {
    /** Square icon, used beside the name. */
    icon: string;
    /** Full logo with wordmark. */
    full: string;
    /** Pixel size of the full logo, for layout. */
    width: number;
    height: number;
  };
  url: string;
  domain: string;

  positioning: string;
  segment: string;

  snapshot: {
    based: Fact;
    founded: Fact;
    leadership: Fact;
    destinations: Fact;
    pricePoint: Fact;
    protection: Fact;
    website: Fact;
  };

  catalogue: {
    multiDay: { count: number; note: string };
    dayTours: { count: number; note: string };
    countries: { count: number; note: string };
    themes: string[];
    recognition: Fact[];
    content: Fact;
  };
  prices: PriceBand[];
  priceNote: string;

  team: {
    page: Fact;
    structure: Fact;
    offices: Fact;
    roles: string[];
    counts: Record<TeamFunction, TeamCount>;
    countsBasis: string;
    /** Named profiles from the team page, when they have been captured. */
    directory?: TeamDirectory;
  };

  journey: Record<JourneyStage, Fact>;
  /**
   * Whether a guest can complete each stage on the website itself:
   * yes = online, partial = partly, no = by conversation, unknown = not shown.
   */
  journeyOnline: Record<JourneyStage, Status>;
  reviews: ReviewPlatform[];
  reviewNote: string;
  supportPromise: Fact;
  responsePromise: Fact;

  pitch: {
    /** The verdict in a few words, for the overview. */
    headline: string;
    verdict: string;
    leadWith: string;
    modules: string[];
    watchOuts: string[];
  };
};

const GH_UPLOADS = "https://www.greenholidaytravels.com/wp-content/uploads/";
const BL_UPLOADS = "https://www.bluelankatours.com/wp-content/uploads/";
/** Blue Lanka's team photos are 1404 by 1836 pixels. */
const BL_RATIO = 1404 / 1836;
const RD_EXPERTS =
  "https://assets.reddottours.com/meet-the-team/our-destination-experts/sri-lanka/conversions/";

export const COMPANIES: Company[] = [
  {
    id: "green",
    slug: "green-holiday",
    name: "Green Holiday Travels",
    short: "Green Holiday",
    logo: {
      icon: "/logos/green-holiday-icon.jpg",
      full: "/logos/green-holiday-logo.jpg",
      width: 800,
      height: 179,
    },
    url: "https://www.greenholidaytravels.com/",
    domain: "greenholidaytravels.com",

    positioning:
      "Colombo agency selling priced Sri Lanka packages and day tours, plus MICE, weddings and vehicle hire.",
    segment: "Budget to mid-range",

    snapshot: {
      based: {
        text: "Colombo 08, Sri Lanka",
        detail: "Registered office at Lake Drive. Trades as Green Holiday Centre (Pvt) Ltd.",
        basis: "site",
      },
      founded: {
        text: "Not published",
        detail: "No founding year on the site. Its three directors cite 16 to 25 years of experience each.",
        basis: "unpublished",
      },
      leadership: {
        text: "Three managing directors",
        detail: "Pradeep Daluwatte, Mahesh Rajakaruna and Jeyanthan Venkadesakurukkal.",
        basis: "site",
      },
      destinations: { text: "Sri Lanka only", basis: "site" },
      pricePoint: {
        text: "USD 59 to 364 per person",
        detail: "Day tours from USD 59. A 4-day tour is USD 283, a 5-day family tour USD 364.",
        basis: "site",
      },
      protection: {
        text: "Company reg. PV79072, SLTDA logo",
        detail: "States it is registered under the Government of Sri Lanka. No membership numbers.",
        basis: "site",
      },
      website: {
        text: "WordPress, custom theme",
        detail: "Google reviews widget and a 104-language translate widget.",
        basis: "site",
      },
    },

    catalogue: {
      multiDay: { count: 13, note: "Fixed packages of 4 to 12 days, some with prices" },
      dayTours: { count: 10, note: "All priced, USD 59 to 142" },
      countries: { count: 1, note: "Sri Lanka" },
      themes: [
        "Culture and coast",
        "Family",
        "Ramayana trail",
        "Pancha Ishwaram temples",
        "Beach stays",
        "MICE and business events",
        "Destination weddings",
      ],
      recognition: [
        { text: "No awards listed", basis: "unpublished" },
        { text: "SLTDA and Sri Lanka Travel logos shown", basis: "site" },
      ],
      content: {
        text: "Blog, plus 2026 Kandy Esala Perahera seat sales",
        basis: "site",
      },
    },
    prices: [
      { label: "Day tours", min: 59, max: 142, note: "10 day tours, all priced" },
      { label: "Multi-day packages", min: 283, max: 364, note: "The two packages that show a price (4 and 5 days)" },
    ],
    priceNote: "Most longer packages show no price.",

    team: {
      page: {
        text: "Team page with 28 profiles",
        detail: "3 managing directors, 12 managers and 13 operations staff, each with a photo and job title.",
        basis: "site",
      },
      structure: {
        text: "Board, department heads, then tour executives",
        detail: "\u201cThe same specialist will handle your trip from start to finish.\u201d",
        basis: "site",
      },
      offices: { text: "One office, Colombo 08", basis: "site" },
      roles: [
        "Managing Director (3)",
        "Head of Operations",
        "Transport Manager",
        "Finance Manager",
        "Digital Marketing Manager",
        "Senior Manager (2)",
        "Assistant Manager (4)",
        "Senior Tour Executive (4)",
        "Tour Executive (2)",
        "Tour Coordinator (2, one trainee)",
        "Assistant Accountant (2)",
        "Accounts Executive (3)",
        "Digital Marketing Assistant",
        "Consultant",
      ],
      counts: {
        leadership: { profiled: 3, other: 0, note: "Three managing directors" },
        management: { profiled: 7, other: 0, note: "2 senior managers, 4 assistant managers, 1 consultant" },
        sales: { profiled: 8, other: 0, note: "6 tour executives, 2 tour coordinators" },
        operations: { profiled: 2, other: 0, note: "Head of operations, transport manager" },
        commercial: { profiled: 8, other: 0, note: "6 in finance and accounts, 2 in digital marketing" },
        guides: { profiled: 0, other: 9, note: "Guides and chauffeurs named in guest reviews" },
        hosts: { profiled: 0, other: 0 },
      },
      countsBasis: "From the company team page",
      directory: {
        source: "https://www.greenholidaytravels.com/meet-the-team/",
        groups: [
          {
            label: "Board of Directors",
            blurb: "Leadership",
            members: [
              { name: "Pradeep Daluwatte", title: "Managing Director", photo: GH_UPLOADS + "2026/08/Mr.-Pradeep-scaled-e1792479408942-848x1024.jpg", note: "More than 25 years of experience" },
              { name: "Mahesh Rajakaruna", title: "Managing Director", photo: GH_UPLOADS + "2026/09/Mr.-Mahesh-683x1024.jpg", note: "Over 18 years in the travel industry" },
              { name: "Jeyanthan Venkadesakurukkal", title: "Managing Director", photo: GH_UPLOADS + "2026/08/WhatsApp-Image-2026-07-22-at-15.34.42-1-e1792479430205-750x1024.jpeg", note: "Over 16 years; described as passionate about technology" },
            ],
          },
          {
            label: "Management Team",
            blurb: "Heads of departments",
            members: [
              { name: "Dasith Wijewardena", title: "Head of Operations", photo: GH_UPLOADS + "2026/09/Dasith-scaled-e1792486253587-1024x1016.jpg" },
              { name: "Menaka Perera", title: "Finance Manager", photo: GH_UPLOADS + "2026/09/Menaka-scaled-e1792486989699-844x1024.jpg" },
              { name: "Upuli Pathirana", title: "Senior Manager", photo: GH_UPLOADS + "2026/09/Upuli-scaled-e1792487181887-1019x1024.jpg" },
              { name: "Lakshini Ariyadasa", title: "Senior Manager", photo: GH_UPLOADS + "2026/09/Lakshini-683x1024.jpg" },
              { name: "Dudley Ramesh", title: "Transport Manager", photo: GH_UPLOADS + "2026/09/Ramesh-scaled-e1792480249964-1002x1024.jpg" },
              { name: "Chamila Jayawardana", title: "Digital Marketing Manager", photo: GH_UPLOADS + "2026/09/Chamila-scaled-e1792486333691-1024x1007.jpg" },
              { name: "Dinusha Silva", title: "Assistant Manager", photo: GH_UPLOADS + "2026/09/Dinusha-scaled-e1792486354851-898x1024.jpg" },
              { name: "Dulanjalie Fernando", title: "Assistant Manager", photo: GH_UPLOADS + "2026/09/Dulanjalie-e1792486411864-770x1024.jpg" },
              { name: "Adiesha Umayangani", title: "Assistant Manager", photo: GH_UPLOADS + "2026/09/Adiesha-2-scaled-e1792485944126-791x1024.jpg" },
              { name: "Rashmi Bandara", title: "Assistant Manager", photo: GH_UPLOADS + "2026/09/Rashmi-683x1024.jpg" },
              { name: "Dhananjani Jayasinghe", title: "Assistant Accountant", photo: GH_UPLOADS + "2026/09/Dhananjani-scaled-e1792486303339-910x1024.jpg" },
              { name: "Niyomi Govindaraj", title: "Assistant Accountant", photo: GH_UPLOADS + "2026/09/Niyomi-scaled-e1792487122848-871x1024.jpg" },
            ],
          },
          {
            label: "Operations Team",
            blurb: "Day-to-day execution",
            members: [
              { name: "Tharuka Jeewanthi", title: "Senior Tour Executive", photo: GH_UPLOADS + "2026/09/Tharuka-scaled-e1792486643449-745x1024.jpg" },
              { name: "Prasad Gunarathna", title: "Senior Tour Executive", photo: GH_UPLOADS + "2026/09/Prasad-scaled-e1792484669543-973x1024.jpg" },
              { name: "Calvin Ravel", title: "Senior Tour Executive", photo: GH_UPLOADS + "2026/09/Calvin-scaled-e1792486071413-835x1024.jpg" },
              { name: "Nirosha Ekanayake", title: "Senior Tour Executive", photo: GH_UPLOADS + "2026/09/Nirosha-scaled-e1792486431563-791x1024.jpg" },
              { name: "Enrico Costa", title: "Tour Executive", photo: GH_UPLOADS + "2026/09/Enrico-scaled-e1792486475643-802x1024.jpg" },
              { name: "Lakshika Sandamali", title: "Accounts Executive", photo: GH_UPLOADS + "2026/09/Lakshika-scaled-e1792486817290-830x1024.jpg" },
              { name: "Himeshi Ukshala", title: "Accounts Executive", photo: GH_UPLOADS + "2026/09/Himeshi-scaled-e1792486547269-829x1024.jpg" },
              { name: "S. Dilshan", title: "Accounts Executive", photo: GH_UPLOADS + "2026/09/Dilshan-scaled-e1792486486950-854x1024.jpg" },
              { name: "Ishini Perera", title: "Digital Marketing Assistant", photo: GH_UPLOADS + "2026/09/DSC_4466-Enhanced-NR-scaled-e1792486683519-916x1024.jpg" },
              { name: "Kaveesha Thathsarani", title: "Tour Coordinator", photo: GH_UPLOADS + "2026/09/Kaveesha-scaled-e1792486751501-826x1024.jpg" },
              { name: "Ruchira Dulanka", title: "Tour Executive", photo: GH_UPLOADS + "2026/09/Dulanka-scaled-e1792486914322-896x1024.jpg" },
              { name: "Nihal Amarasinghe", title: "Consultant", photo: GH_UPLOADS + "2026/09/Mr.-Amarasinghe-scaled-e1792487049734-759x1024.jpg" },
              { name: "Senomi Herath", title: "Trainee Tour Coordinator", photo: GH_UPLOADS + "2026/10/senomi-576x1024.png" },
            ],
          },
        ],
      },
    },

    journey: {
      discover: {
        text: "Priced packages and day tours",
        detail: "Prices shown per person. Translate widget covers 104 languages.",
        basis: "site",
      },
      enquire: {
        text: "WhatsApp, phone, contact form, tailor-made request form",
        detail: "Day-tour pages have no date picker, cart or checkout.",
        basis: "site",
      },
      quote: {
        text: "Manual, by one specialist",
        detail: "No instant quote. The specialist stays with the trip to the end.",
        basis: "site",
      },
      pay: {
        text: "No payment method shown online",
        detail: "No gateway, deposit terms or booking conditions found.",
        basis: "unpublished",
      },
      travel: {
        text: "24/7 emergency support",
        detail: "WhatsApp line advertised as free call or chat, 24/7.",
        basis: "site",
      },
    },
    journeyOnline: { discover: "yes", enquire: "partial", quote: "no", pay: "unknown", travel: "no" },
    reviews: [
      { platform: "Google", rating: "4.6", count: 146 },
      { platform: "Tripadvisor", rating: "Excellent", count: 10 },
    ],
    reviewNote: "Reviews shown on the site date mostly from 2019 to 2024.",
    supportPromise: { text: "24/7 emergency support", basis: "site" },
    responsePromise: { text: "None published", basis: "unpublished" },

    pitch: {
      headline: "Priced tours, no checkout",
      verdict:
        "The cleanest product fit: fixed, priced tours sold through WhatsApp by a 25-person office team. Ticket sizes are the lowest on the shortlist.",
      leadWith: "A day-tour storefront with date selection, checkout and card payment.",
      modules: [
        "Day-tour and event-seat checkout",
        "Payment gateway",
        "Vehicle hire booking",
        "WhatsApp enquiry to booking handoff",
      ],
      watchOuts: [
        "Low price points may limit budget",
        "Company age and booking volume are unknown",
        "Site reviews are mostly older than two years",
      ],
    },
  },
  {
    id: "reddot",
    slug: "red-dot",
    name: "Red Dot Tours",
    short: "Red Dot",
    logo: {
      icon: "/logos/red-dot-icon.png",
      full: "/logos/red-dot-logo.svg",
      width: 1449,
      height: 207,
    },
    url: "https://www.reddottours.com/",
    domain: "reddottours.com",

    positioning:
      "UK-facing luxury specialist building every trip from scratch across the Indian subcontinent.",
    segment: "Luxury",

    snapshot: {
      based: {
        text: "Colombo, with a UK office",
        detail: "About 90% of the team is in Colombo. UK office in rural West Oxfordshire, by appointment.",
        basis: "site",
      },
      founded: {
        text: "2000",
        detail: "Per its Feefo listing. The site itself cites “20 years of experience”.",
        basis: "platform",
      },
      leadership: {
        text: "Not named on the site",
        detail: "The team page profiles consultants, not owners or directors.",
        basis: "unpublished",
      },
      destinations: {
        text: "6 countries",
        detail: "Sri Lanka, India, Maldives, Bhutan, Nepal and Egypt.",
        basis: "site",
      },
      pricePoint: {
        text: "USD 3,384 to 6,060 per person",
        detail: "Sample itineraries. The site says most clients spend GBP 3,500 to 15,000 per person.",
        basis: "site",
      },
      protection: {
        text: "ATOL 5517, ABTOT 5664",
        detail: "UK financial protection for flight-inclusive and land-only trips.",
        basis: "site",
      },
      website: {
        text: "Custom build",
        detail: "Trip Finder, live chat assistant, Payment Centre. Stack not identified.",
        basis: "inferred",
      },
    },

    catalogue: {
      multiDay: { count: 6, note: "Sample itineraries of 9 to 13 nights; every trip is built from scratch" },
      dayTours: { count: 0, note: "Not sold as a standalone product" },
      countries: { count: 6, note: "Sri Lanka, India, Maldives, Bhutan, Nepal, Egypt" },
      themes: [
        "Culture and history",
        "Wildlife and wilderness",
        "Families with small kids",
        "Teenagers",
        "Honeymoons",
        "Multigenerational",
        "Solo",
        "Positive travel",
      ],
      recognition: [
        { text: "Tripadvisor Travelers’ Choice", basis: "site" },
        { text: "Named a Top Travel Specialist 2027", basis: "site" },
        { text: "Conscious Travel Foundation member", basis: "site" },
      ],
      content: {
        text: "Journal with destination and restaurant guides",
        basis: "site",
      },
    },
    prices: [
      {
        label: "Sample itineraries",
        min: 3384,
        max: 6060,
        note: "Six samples, 9 to 13 nights, priced “from” per person",
      },
    ],
    priceNote: "Prices are starting points; nothing is sold off the shelf.",

    team: {
      page: {
        text: "Team page with 7 profiles",
        detail: "Also pictures 15 guides and 11 local hosts without names.",
        basis: "site",
      },
      structure: {
        text: "Travel designers by destination",
        detail: "The Colombo consultant team is described as all-female.",
        basis: "site",
      },
      offices: { text: "Colombo and West Oxfordshire, UK", basis: "site" },
      roles: [
        "Sri Lanka Travel Designer (6)",
        "Indian Subcontinent Sales and Service Manager (UK)",
        "Expert guides",
        "Local hosts",
      ],
      counts: {
        leadership: { profiled: 0, other: 0, note: "Not named" },
        management: { profiled: 0, other: 0 },
        sales: { profiled: 7, other: 0, note: "6 travel designers in Colombo, 1 manager in the UK" },
        operations: { profiled: 0, other: 0, note: "Not shown" },
        commercial: { profiled: 0, other: 0, note: "Not shown" },
        guides: { profiled: 0, other: 15, note: "Pictured without names: 7 Sri Lanka, 8 India" },
        hosts: { profiled: 0, other: 11, note: "Pictured without names: 4 Sri Lanka, 7 India" },
      },
      countsBasis: "From the company team page",
      directory: {
        source: "https://www.reddottours.com/about-us/meet-the-team",
        groups: [
          {
            label: "Destination experts",
            blurb: "Trip designers",
            members: [
              {
                name: "Jayandi Premachandra",
                title: "Sri Lanka Travel Designer",
                note: "Colombo office",
                photo: RD_EXPERTS + "destination-experts-img-4-card-sm.webp",
                focus: { x: 0.59, y: 0.39, zoom: 2.8 },
              },
              {
                name: "Dulmini Ekanayake",
                title: "Sri Lanka Travel Designer",
                note: "Colombo office",
                photo: RD_EXPERTS + "destination-experts-img-1-card-sm.webp",
                focus: { x: 0.59, y: 0.4, zoom: 3 },
              },
              {
                name: "Lahiru Kularatne",
                title: "Sri Lanka Travel Designer",
                note: "Colombo office",
                photo: RD_EXPERTS + "destination-experts-img-5-card-sm.webp",
                focus: { x: 0.51, y: 0.5, zoom: 3 },
              },
              {
                name: "Nicola Tranchell-Watson",
                title: "Sri Lanka Travel Designer",
                note: "Colombo office",
                photo: RD_EXPERTS + "destination-experts-img-6-card-sm.webp",
                focus: { x: 0.37, y: 0.22, zoom: 1.6 },
              },
              {
                name: "Samanthie Karunarathna",
                title: "Sri Lanka Travel Designer",
                note: "Colombo office",
                photo: RD_EXPERTS + "destination-experts-img-2-card-sm.webp",
                focus: { x: 0.29, y: 0.47, zoom: 2.6 },
              },
              {
                name: "Sithumini Nawodya",
                title: "Sri Lanka Travel Designer",
                note: "Colombo office",
                photo:
                  "https://assets.reddottours.com/meet-the-team/team-profiles/nawodya-sithumini/2026-09-08/team-card-480.webp",
                focus: { x: 0.5, y: 0.4, zoom: 3.2 },
              },
              {
                name: "Cherylle Sargent",
                title: "Indian Subcontinent Sales and Service Manager",
                note: "UK office",
                photo: RD_EXPERTS + "destination-experts-img-3-card-sm.webp",
                focus: { x: 0.29, y: 0.32, zoom: 1.7 },
              },
            ],
          },
        ],
      },
    },

    journey: {
      discover: {
        text: "Trip Finder and sample itineraries with starting prices",
        detail: "Browsing by destination, theme and traveller type.",
        basis: "site",
      },
      enquire: {
        text: "Two-step form, live chat, phone, email",
        detail:
          "Form captures destination, calendar dates, duration, party size and a budget band, then the preferred contact method (video call, phone, email or WhatsApp).",
        basis: "site",
      },
      quote: {
        text: "A travel designer builds the trip",
        detail: "No instant pricing. Chat consultants are online daily, 12pm to 9pm Sri Lanka time.",
        basis: "site",
      },
      pay: {
        text: "Online Payment Centre",
        detail: "Card payments through Paysafe and Stripe, backed by ATOL and ABTOT.",
        basis: "site",
      },
      travel: {
        text: "24-hour support, guest portal",
        detail: "The portal for itineraries is mentioned in a guest testimonial.",
        basis: "site",
      },
    },
    journeyOnline: { discover: "yes", enquire: "yes", quote: "no", pay: "yes", travel: "yes" },
    reviews: [
      { platform: "Tripadvisor", rating: "5.0", count: null, note: "Count not shown on the site" },
      { platform: "Feefo", rating: "4.9", count: null, note: "Count not shown on the site" },
    ],
    reviewNote: "Ratings are published; review counts are not.",
    supportPromise: { text: "24-hour support while travelling", basis: "site" },
    responsePromise: { text: "None published", basis: "unpublished" },

    pitch: {
      headline: "Already has the tooling",
      verdict:
        "The most advanced digitally. Payments, portal, chat and trip finder already exist, so we would be displacing something.",
      leadWith: "Only an integration or replacement case, after discovery confirms a pain point.",
      modules: [
        "Itinerary costing across six destinations",
        "Supplier and contract management",
        "Integration with the existing portal and payments",
      ],
      watchOuts: [
        "Incumbent tooling: Payment Centre, guest portal, live chat",
        "Nothing is sold as fixed inventory",
        "UK regulation (ATOL, ABTOT) raises compliance requirements",
      ],
    },
  },
  {
    id: "blue",
    slug: "blue-lanka",
    name: "Blue Lanka Tours",
    short: "Blue Lanka",
    logo: {
      icon: "/logos/blue-lanka-icon.png",
      full: "/logos/blue-lanka-logo.webp",
      width: 1217,
      height: 827,
    },
    url: "https://www.bluelankatours.com/",
    domain: "bluelankatours.com",

    positioning:
      "Award-winning Sri Lanka tour operator and DMC with a large review base and a published operations team.",
    segment: "Mid-range to luxury",

    snapshot: {
      based: {
        text: "Greater Colombo, Sri Lanka",
        detail: "No street address on the site. Tripadvisor lists it in Nugegoda, Western Province.",
        basis: "platform",
      },
      founded: {
        text: "2010",
        detail: "Page title reads “Since 2010”.",
        basis: "site",
      },
      leadership: {
        text: "Dinesh N. Perera, Founder and Managing Director",
        basis: "site",
      },
      destinations: {
        text: "Sri Lanka, plus Maldives packages",
        basis: "site",
      },
      pricePoint: {
        text: "No prices published",
        detail: "Every itinerary and day tour is quoted on request, from “wallet friendly” to 5-star.",
        basis: "unpublished",
      },
      protection: {
        text: "SLTDA-registered holiday company",
        detail: "Partner logos for TCCOC and WNPS.",
        basis: "site",
      },
      website: {
        text: "WordPress",
        detail: "Three-step enquiry form. Blog updated through October 2026.",
        basis: "site",
      },
    },

    catalogue: {
      multiDay: { count: 12, note: "Featured itineraries across 13 categories, none priced" },
      dayTours: { count: 19, note: "None priced; includes helicopter and balloon tours" },
      countries: { count: 2, note: "Sri Lanka and Maldives" },
      themes: [
        "Culture and heritage",
        "Wildlife",
        "Adventure and nature",
        "Family",
        "Romantic",
        "Luxury bespoke",
        "Wellness",
        "Sustainable",
        "Sports based",
        "North and east coast",
        "Special transit",
      ],
      recognition: [
        { text: "World Travel Awards, Leading Tour Operator in Sri Lanka: 2020, 2022, 2023", basis: "site" },
        { text: "Tripadvisor Travelers’ Choice: 2023, 2024 (Best of the Best), 2025", basis: "site" },
        { text: "Tripadvisor Community Impact Initiative: 2026", basis: "site" },
      ],
      content: {
        text: "Travel journal with posts from August to October 2026",
        basis: "site",
      },
    },
    prices: [],
    priceNote: "No prices anywhere on the site. Quotes follow an enquiry.",

    team: {
      page: {
        text: "Team page with 19 profiles",
        detail: "Founder, 11 office staff and 7 chauffeur guides.",
        basis: "site",
      },
      structure: {
        text: "Separate sales, design, reservations and support roles",
        detail: "The About page also lists an accountant and an accounts executive.",
        basis: "site",
      },
      offices: { text: "One office in Sri Lanka", basis: "site" },
      roles: [
        "Founder and Managing Director",
        "Senior Sales Manager",
        "Sales Manager",
        "Travel Experience Designer (4)",
        "Operation and Reservation Manager",
        "Assistant Operations and Reservation Manager",
        "Revenue Growth Specialist",
        "Journey Support Assistant",
        "PA to the Managing Director",
        "Chauffeur guides (7)",
      ],
      counts: {
        leadership: { profiled: 1, other: 0, note: "Founder and Managing Director" },
        management: { profiled: 0, other: 0 },
        sales: { profiled: 6, other: 0, note: "4 travel experience designers, 2 sales managers" },
        operations: { profiled: 2, other: 0, note: "Operations and reservations manager and assistant" },
        commercial: { profiled: 3, other: 0, note: "Revenue growth, journey support, PA to the MD" },
        guides: { profiled: 7, other: 0, note: "Chauffeur guides" },
        hosts: { profiled: 0, other: 0 },
      },
      countsBasis: "From the company team page",
      directory: {
        source: "https://www.bluelankatours.com/our-team/",
        groups: [
          {
            label: "Founder",
            members: [
              {
                name: "Dinesh N. Perera",
                title: "Founder and Managing Director",
                photo: BL_UPLOADS + "2026/06/Dinesh-3.webp",
                focus: { x: 0.66, y: 0.24, zoom: 1.9, ratio: 1988 / 2484 },
              },
            ],
          },
          {
            label: "Operational Team",
            blurb: "Journey curators",
            members: [
              {
                name: "Kavindi Maheshika",
                title: "Revenue Growth Specialist",
                photo: BL_UPLOADS + "2026/08/Kavindi-Maheshika-team.webp",
                focus: { x: 0.62, y: 0.3, zoom: 1.7, ratio: BL_RATIO },
              },
              {
                name: "Sharmila Dayawansha",
                title: "PA to the Managing Director",
                photo: BL_UPLOADS + "2026/07/Sharmila-Dayawansha-3.webp",
                focus: { x: 0.5, y: 0.22, zoom: 1.7, ratio: BL_RATIO },
              },
              {
                name: "Amesha Sankalpa",
                title: "Operation and Reservation Manager",
                photo: BL_UPLOADS + "2026/08/Amesha-Sankalpa-slider.webp",
                focus: { x: 0.6, y: 0.27, zoom: 1.7, ratio: BL_RATIO },
              },
              {
                name: "Umaya Lankanath",
                title: "Travel Experience Designer",
                photo: BL_UPLOADS + "2026/08/Umaya-Lankanath-slider.webp",
                focus: { x: 0.52, y: 0.26, zoom: 1.5, ratio: BL_RATIO },
              },
              {
                name: "Hashini Dharmappriya",
                title: "Sales Manager",
                photo: BL_UPLOADS + "2026/08/Hashini-Dharmapriya-slider.webp",
                focus: { x: 0.6, y: 0.3, zoom: 1.5, ratio: BL_RATIO },
              },
              {
                name: "Nadeera Walagedara",
                title: "Assistant Operations and Reservation Manager",
                photo: BL_UPLOADS + "2026/08/Nadeera-Welagedara-slider.webp",
                focus: { x: 0.52, y: 0.26, zoom: 1.5, ratio: BL_RATIO },
              },
              {
                name: "Sakunthala Yapa Bandara",
                title: "Travel Experience Designer",
                photo: BL_UPLOADS + "2026/08/Sakunthala-Yapa-Bandara-slider.webp",
                focus: { x: 0.52, y: 0.26, zoom: 1.5, ratio: BL_RATIO },
              },
              {
                name: "Yuresha Wijesekara",
                title: "Senior Sales Manager",
                photo: BL_UPLOADS + "2026/08/Yuresha-Wijesekara-slider.webp",
                focus: { x: 0.5, y: 0.25, zoom: 1.6, ratio: BL_RATIO },
              },
              {
                name: "Thusarindu Dhananjaya",
                title: "Travel Experience Designer",
                photo: BL_UPLOADS + "2026/08/Thusarindu-Dananjaya-slider.webp",
                focus: { x: 0.62, y: 0.32, zoom: 1.5, ratio: BL_RATIO },
              },
              {
                name: "Oshani Vihanga",
                title: "Journey Support Assistant",
                photo: BL_UPLOADS + "2026/08/Oshani-Vihanga-slider.webp",
                focus: { x: 0.52, y: 0.26, zoom: 1.5, ratio: BL_RATIO },
              },
              {
                name: "Lakshani Ekanayaka",
                title: "Travel Experience Designer",
                photo: BL_UPLOADS + "2026/08/Lakshani-Ekanayaka-slider.webp",
                focus: { x: 0.52, y: 0.26, zoom: 1.5, ratio: BL_RATIO },
              },
            ],
          },
          {
            label: "Chauffeur Guides",
            blurb: "Journey companions",
            members: [
              {
                name: "Keerthy Prakash",
                title: "Chauffeur Guide",
                photo: BL_UPLOADS + "2026/03/Keerthy-Prakash.webp",
                focus: { x: 0.5, y: 0.25, zoom: 1.6, ratio: BL_RATIO },
              },
              {
                name: "Rushantha Silva",
                title: "Chauffeur Guide",
                photo: BL_UPLOADS + "2026/03/Rushan-Silva.webp",
                focus: { x: 0.5, y: 0.25, zoom: 1.6, ratio: BL_RATIO },
              },
              {
                name: "Dilshan Rajudeen",
                title: "Chauffeur Guide",
                photo: BL_UPLOADS + "2025/12/Dilshan-Rajudeen.webp",
                focus: { x: 0.5, y: 0.25, zoom: 1.6, ratio: BL_RATIO },
              },
              {
                name: "Danushka Weerasekara",
                title: "Chauffeur Guide",
                photo: BL_UPLOADS + "2026/03/Dhanushka-Weerasekara.webp",
                focus: { x: 0.5, y: 0.25, zoom: 1.6, ratio: BL_RATIO },
              },
              {
                name: "Aruna Shantha",
                title: "Chauffeur Guide",
                photo: BL_UPLOADS + "2026/03/Aruna-Shantha.webp",
                focus: { x: 0.5, y: 0.25, zoom: 1.6, ratio: BL_RATIO },
              },
              {
                name: "Dilan Silva",
                title: "Chauffeur Guide",
                photo: BL_UPLOADS + "2026/03/Dilan-Silva.webp",
                focus: { x: 0.5, y: 0.25, zoom: 1.6, ratio: BL_RATIO },
              },
              {
                name: "Pathum Sathsara",
                title: "Chauffeur Guide",
                photo: BL_UPLOADS + "2026/03/Pathum-Sathsara.webp",
                focus: { x: 0.5, y: 0.25, zoom: 1.6, ratio: BL_RATIO },
              },
            ],
          },
        ],
      },
    },

    journey: {
      discover: {
        text: "Itineraries by 13 categories, 19 day tours, no prices",
        detail: "A portfolio of over 1,000 accommodation properties is cited.",
        basis: "site",
      },
      enquire: {
        text: "Three-step form, WhatsApp, phone, email",
        detail:
          "Form captures contact details, date, nights, adults and accommodation class, then notes and referral source.",
        basis: "site",
      },
      quote: {
        text: "Bespoke quote from a consultant",
        detail: "“Receive your bespoke holiday quote, then book online or over the phone.”",
        basis: "site",
      },
      pay: {
        text: "“Safe financial platform”, no detail",
        detail: "No gateway, checkout or deposit terms are visible before a quote.",
        basis: "site",
      },
      travel: {
        text: "24/7 customer service",
        detail: "Chauffeur guide meets guests at the airport with itinerary and hotel details.",
        basis: "site",
      },
    },
    journeyOnline: { discover: "partial", enquire: "yes", quote: "no", pay: "partial", travel: "no" },
    reviews: [
      { platform: "Tripadvisor", rating: "5.0", count: 3200, note: "Badge figure; the company reports nearly all five-star" },
      { platform: "Trustpilot", rating: "4.9", count: 230, note: "Badge figure; Trustpilot pages show 222 to 227" },
    ],
    reviewNote: "By far the largest public review base on the shortlist.",
    supportPromise: { text: "24/7 customer service", basis: "site" },
    responsePromise: { text: "None published", basis: "unpublished" },

    pitch: {
      headline: "High demand, manual quoting",
      verdict:
        "High demand handled by quote and email: the strongest case for a booking system on the shortlist.",
      leadWith:
        "A quote-to-book engine for tailor-made trips, with online checkout for day tours, transfers and train tickets.",
      modules: [
        "Itinerary builder with instant costing",
        "Day-tour, transfer and train-ticket checkout",
        "Payment gateway and deposits",
        "B2B agent portal for the DMC arm",
        "Guest trip portal",
      ],
      watchOuts: [
        "No public prices may be a deliberate bespoke stance",
        "Existing back-office tooling is unknown",
        "WordPress site will need a booking front-end integration",
      ],
    },
  },
];

export const COMPANY_BY_ID = Object.fromEntries(COMPANIES.map((c) => [c.id, c])) as Record<
  CompanyId,
  Company
>;

/* -------------------------------------------------------------------------- */
/* Matrices                                                                    */
/* -------------------------------------------------------------------------- */

export type MatrixRow = {
  label: string;
  hint?: string;
  cells: Record<CompanyId, Cell>;
};

export const SERVICE_LINES: MatrixRow[] = [
  {
    label: "Tailor-made tours",
    cells: {
      green: { status: "yes" },
      reddot: { status: "yes", note: "The whole business" },
      blue: { status: "yes" },
    },
  },
  {
    label: "Day tours and excursions",
    cells: {
      green: { status: "yes", note: "10, priced" },
      reddot: { status: "no", note: "Only inside trips" },
      blue: { status: "yes", note: "19, unpriced" },
    },
  },
  {
    label: "Hotel booking",
    cells: {
      green: { status: "yes" },
      reddot: { status: "yes", note: "Curated collection" },
      blue: { status: "yes", note: "1,000+ properties" },
    },
  },
  {
    label: "Transfers and vehicle hire",
    cells: {
      green: { status: "yes", note: "Vehicle selection page" },
      reddot: { status: "partial", note: "Drivers within trips" },
      blue: { status: "yes", note: "Transfers page" },
    },
  },
  {
    label: "Train tickets",
    cells: {
      green: { status: "no" },
      reddot: { status: "no" },
      blue: { status: "yes" },
    },
  },
  {
    label: "MICE and business events",
    cells: {
      green: { status: "yes" },
      reddot: { status: "no" },
      blue: { status: "partial", note: "Through DMC services" },
    },
  },
  {
    label: "Weddings and event seats",
    cells: {
      green: { status: "yes", note: "Weddings, Perahera seats" },
      reddot: { status: "no", note: "Honeymoons only" },
      blue: { status: "no" },
    },
  },
  {
    label: "DMC services for other agents",
    cells: {
      green: { status: "no" },
      reddot: { status: "no" },
      blue: { status: "yes", note: "Logistics, suppliers, accounting" },
    },
  },
  {
    label: "Multi-country trips",
    cells: {
      green: { status: "no" },
      reddot: { status: "yes", note: "6 countries" },
      blue: { status: "partial", note: "Maldives add-on" },
    },
  },
  {
    label: "Flight-inclusive packages",
    cells: {
      green: { status: "no" },
      reddot: { status: "yes", note: "ATOL protected" },
      blue: { status: "no" },
    },
  },
];

export const CHANNELS: MatrixRow[] = [
  {
    label: "Phone",
    cells: {
      green: { status: "yes" },
      reddot: { status: "yes", note: "UK and global lines" },
      blue: { status: "yes" },
    },
  },
  {
    label: "WhatsApp",
    cells: {
      green: { status: "yes", note: "24/7 call or chat" },
      reddot: { status: "partial", note: "On request in the form" },
      blue: { status: "yes" },
    },
  },
  {
    label: "Email",
    cells: {
      green: { status: "yes" },
      reddot: { status: "yes" },
      blue: { status: "yes" },
    },
  },
  {
    label: "Structured enquiry form",
    hint: "Captures dates, party and budget, not only a message",
    cells: {
      green: { status: "partial", note: "Basic request form" },
      reddot: { status: "yes", note: "2 steps, budget bands" },
      blue: { status: "yes", note: "3 steps" },
    },
  },
  {
    label: "Live chat",
    cells: {
      green: { status: "no" },
      reddot: { status: "yes", note: "Assistant plus consultants" },
      blue: { status: "no" },
    },
  },
  {
    label: "Video consultation",
    cells: {
      green: { status: "no" },
      reddot: { status: "yes" },
      blue: { status: "no" },
    },
  },
  {
    label: "Newsletter",
    cells: {
      green: { status: "yes" },
      reddot: { status: "yes" },
      blue: { status: "yes" },
    },
  },
];

/** What a booking system would provide, against what each site shows today. */
export const CAPABILITIES: MatrixRow[] = [
  {
    label: "Published prices",
    hint: "A visitor can see what a product costs",
    cells: {
      green: { status: "yes", note: "Day tours, some packages" },
      reddot: { status: "partial", note: "“From” prices on samples" },
      blue: { status: "no" },
    },
  },
  {
    label: "Date and availability selection",
    cells: {
      green: { status: "no" },
      reddot: { status: "partial", note: "Calendar in the enquiry form" },
      blue: { status: "no", note: "Free-text date field" },
    },
  },
  {
    label: "Instant quote or itinerary builder",
    cells: {
      green: { status: "no" },
      reddot: { status: "no", note: "Trip Finder is browse only" },
      blue: { status: "no" },
    },
  },
  {
    label: "Online checkout for fixed products",
    hint: "Day tours, transfers, tickets, event seats",
    cells: {
      green: { status: "no", note: "10 priced tours, no cart" },
      reddot: { status: "no", note: "No fixed products" },
      blue: { status: "no", note: "19 tours, transfers, trains" },
    },
  },
  {
    label: "Online payment",
    cells: {
      green: { status: "no" },
      reddot: { status: "yes", note: "Paysafe and Stripe" },
      blue: { status: "partial", note: "Mentioned, not shown" },
    },
  },
  {
    label: "Guest trip portal",
    cells: {
      green: { status: "no" },
      reddot: { status: "yes", note: "Per a guest testimonial" },
      blue: { status: "no", note: "Documents handed over on arrival" },
    },
  },
  {
    label: "Assisted online sales",
    hint: "Chat that can move a lead toward a booking",
    cells: {
      green: { status: "partial", note: "WhatsApp" },
      reddot: { status: "yes", note: "Live chat assistant" },
      blue: { status: "partial", note: "WhatsApp" },
    },
  },
  {
    label: "Agent or B2B portal",
    cells: {
      green: { status: "no" },
      reddot: { status: "no" },
      blue: { status: "no", note: "DMC sold by enquiry" },
    },
  },
  {
    label: "Back-office system",
    hint: "Inventory, supplier contracts, accounting",
    cells: {
      green: { status: "unknown" },
      reddot: { status: "unknown" },
      blue: { status: "unknown" },
    },
  },
];

/* -------------------------------------------------------------------------- */
/* Cross-shortlist findings and discovery                                      */
/* -------------------------------------------------------------------------- */

export type Finding = {
  title: string;
  body: string;
  companies: CompanyId[];
};

export const FINDINGS: Finding[] = [
  {
    title: "Nobody can book a fixed product online",
    body: "Green Holiday prices 10 day tours and Blue Lanka lists 19, yet neither has a date picker, cart or checkout. Every sale starts as a message.",
    companies: ["green", "blue"],
  },
  {
    title: "Only Red Dot takes payment on its site",
    body: "Red Dot runs a Payment Centre on Paysafe and Stripe. Green Holiday shows no payment method, and Blue Lanka mentions a safe financial platform without showing it.",
    companies: ["green", "reddot", "blue"],
  },
  {
    title: "No one promises a response time",
    body: "All three advertise round-the-clock support for guests in the country. None tells a new lead how quickly a quote will arrive.",
    companies: ["green", "reddot", "blue"],
  },
  {
    title: "Blue Lanka carries about 22 times Green Holiday’s review volume",
    body: "Roughly 3,430 public reviews against 156. Red Dot publishes ratings of 4.9 and 5.0 but not the counts behind them.",
    companies: ["green", "reddot", "blue"],
  },
];

export const DISCOVERY_QUESTIONS: { question: string; why: string }[] = [
  {
    question: "How many enquiries and confirmed bookings in a typical month?",
    why: "Review counts are our only volume proxy today.",
  },
  {
    question: "What do you use now to build quotes, hold inventory and invoice?",
    why: "Back-office tooling is invisible from every site.",
  },
  {
    question: "How long does a first quote take, and who writes it?",
    why: "No company publishes a response time.",
  },
  {
    question: "How are deposits and balances collected and reconciled?",
    why: "Only Red Dot shows a payment flow.",
  },
  {
    question: "Which products would you sell without a conversation if you could?",
    why: "Tests the appetite for day-tour and transfer checkout.",
  },
  {
    question: "Who signs off on software, and what is the budget cycle?",
    why: "Red Dot names no owner or director; the other two do.",
  },
];

/* -------------------------------------------------------------------------- */
/* Sources                                                                     */
/* -------------------------------------------------------------------------- */

export const CAPTURED_ON = "15 Nov 2026";

export const SOURCES: { company: CompanyId; label: string; url: string; used: string }[] = [
  {
    company: "green",
    label: "Home page",
    url: "https://www.greenholidaytravels.com/",
    used: "Services, packages, prices, contact channels, Google rating",
  },
  {
    company: "green",
    label: "About us",
    url: "https://www.greenholidaytravels.com/about-us/",
    used: "Registration, support promises, guides named in reviews, Tripadvisor count",
  },
  {
    company: "green",
    label: "Meet the team",
    url: "https://www.greenholidaytravels.com/meet-the-team/",
    used: "28 team profiles: names, job titles, photos, directors' experience",
  },
  {
    company: "green",
    label: "One day tours",
    url: "https://www.greenholidaytravels.com/one-day-tours/",
    used: "Day-tour count, price range, booking method",
  },
  {
    company: "reddot",
    label: "Home page",
    url: "https://www.reddottours.com/",
    used: "Destinations, sample itineraries, prices, protection, chat hours",
  },
  {
    company: "reddot",
    label: "About us",
    url: "https://reddottours.com/about-us",
    used: "Offices, team description, payment providers, support",
  },
  {
    company: "reddot",
    label: "Meet the team",
    url: "https://www.reddottours.com/about-us/meet-the-team",
    used: "7 team profiles with photos, guide and host counts",
  },
  {
    company: "reddot",
    label: "Plan your trip",
    url: "https://www.reddottours.com/plan-your-trip",
    used: "Enquiry form steps and fields, typical client spend",
  },
  {
    company: "reddot",
    label: "Customer reviews",
    url: "https://www.reddottours.com/customer-reviews",
    used: "Published ratings",
  },
  {
    company: "reddot",
    label: "Feefo listing",
    url: "https://www.feefo.com/en-GB/reviews/red-dot-tours",
    used: "Founding year, Feefo rating",
  },
  {
    company: "blue",
    label: "Home page",
    url: "https://www.bluelankatours.com/",
    used: "Services, itineraries, day tours, awards, review badges",
  },
  {
    company: "blue",
    label: "About",
    url: "https://www.bluelankatours.com/about/",
    used: "Founding year, leadership, accommodation portfolio, registration",
  },
  {
    company: "blue",
    label: "Our team",
    url: "https://www.bluelankatours.com/our-team/",
    used: "19 team profiles: names, job titles, photos",
  },
  {
    company: "blue",
    label: "Tailor-made tours",
    url: "https://www.bluelankatours.com/tailor-made-tours/",
    used: "Enquiry form steps and fields, booking process",
  },
  {
    company: "blue",
    label: "Trustpilot",
    url: "https://uk.trustpilot.com/review/bluelankatours.com",
    used: "Trustpilot rating and review count",
  },
];
