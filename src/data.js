// ─────────────────────────────────────────────────────────────
//  EDIT THIS FILE to personalize your site.
//  Everything the pages display comes from here.
//  Populated from your CV (Data Engineer). Tweak anything freely.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Bhathiya Bandara',
  role: 'Senior Engineer · Data Engineering',
  tagline:
    'Senior Data engineer with 6+ years across banking and telecoms — owning data platforms and ELT/ETL systems end to end, from ingestion and modeling to reporting delivery, with a focus on reliable pipelines, SLAs, and performance.',
  location: 'Colombo, Sri Lanka',
  email: 'bhathiyabandara4@gmail.com',
  resumeUrl: '', // drop a PDF in /public (e.g. 'resume.pdf') and link it here
  // Headline metrics shown in the hero — quantified proof of impact.
  stats: [
    { value: '6+', label: 'Years in data engineering' },
    { value: '10+', label: 'Production ETL pipelines' },
    { value: '7.5×', label: 'Faster XML processing' },
    { value: '2021', label: 'GTS President Award' },
  ],
  socials: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/bhathiya-bandara-34385b159/' },
    { label: 'Email', url: 'mailto:bhathiyabandara4@gmail.com' },
  ],
}

export const about = {
  paragraphs: [
    'I am a senior data engineer at Sampath Bank, owning ETL pipeline design, reliability, and the engineering workflow across analytics and reporting workloads.',
    'Previously I was part of Huawei’s data-engineering team, where I earned the GTS President Award for Best New Employee (2021). I have a track record of owning data platforms and ELT/ETL systems end to end — with expert Python and SQL, pipeline SLAs and monitoring, and performance tuning — and I enjoy setting technical standards and mentoring engineers.',
  ],
  // Skills grouped by category (renders as labelled groups of pills).
  skillGroups: [
    { label: 'Core', items: ['ETL / ELT', 'Apache Airflow', 'Data Modeling', 'Data Warehousing'] },
    { label: 'Big Data', items: ['HDFS / Hadoop', 'Apache Spark'] },
    { label: 'Databases', items: ['Greenplum', 'PostgreSQL', 'Oracle SQL', 'SQL'] },
    { label: 'Languages', items: ['Python', 'Bash / Shell', 'C++', 'MATLAB'] },
    { label: 'Practices', items: ['SLAs & Monitoring', 'Performance Tuning', 'CI/CD'] },
    { label: 'Platforms', items: ['Linux', 'Huawei Cloud'] },
  ],
}

// The CV is experience-led rather than project-led, so these highlight
// signature initiatives. Edit titles/descriptions or add real project links.
export const projects = [
  {
    title: 'Enterprise Incremental ETL Platform',
    description:
      'Enterprise data pipeline framework for automated, reliable, and high-performance incremental data extraction from Oracle DB to Greenplum DWH. Orchestrated via Apache Airflow and powered by PySpark, featuring dual Date/Key incremental extraction engines, automated COUNT(1) trend reconciliation, self-healing data remediation, dynamic annual table partitioning, and automated HTML/CSV executive reporting.',
    tags: ['Apache Airflow', 'PySpark', 'Oracle SQL', 'Greenplum', 'Python', 'ETL / ELT'],
    image: '/projects/etl_architecture.jpg',
    images: [
      {
        url: '/projects/etl_architecture.jpg',
        caption: 'System Architecture — Apache Airflow orchestrates PySpark incremental extraction from Oracle DB to Greenplum DWH with automated COUNT(1) trend reconciliation and self-healing data remediation.',
      },
    ],
    liveUrl: '',
    codeUrl: '',
  },
  {
    title: 'Enterprise Server & Disk Usage Monitor',
    description:
      'Modular Django web application for internal system monitoring. Features real-time per-directory Greenplum disk space usage drill-downs, aggregated Change Data Capture (CDC) history trends, proportional share bars, and interactive treemap visualizations designed for offline enterprise environments.',
    tags: ['Django', 'Python', 'Greenplum', 'SQL', 'Chart.js', 'Treemap'],
    image: '/projects/monitoring_dashboard.jpg',
    images: [
      {
        url: '/projects/monitoring_dashboard.jpg',
        caption: 'Disk Usage Dashboard — Directory drill-down table with proportional share bars and historical CDC usage trend chart.',
      },
      {
        url: '/projects/monitoring_treemap.jpg',
        caption: 'Treemap Storage Modal — Color-coded area-proportional directory allocation visualization.',
      },
    ],
    liveUrl: '',
    codeUrl: '',
  },
  {
    title: 'XML Processing Optimization',
    description:
      'Cut XML processing time by ~7.5× — from 5 hours to 40 minutes — through query and script optimisation on production data workloads.',
    tags: ['SQL', 'Python', 'Performance Tuning'],
    liveUrl: '',
    codeUrl: '',
  },
  {
    title: 'Production ETL Platform',
    description:
      'Owned 10+ production ETL pipelines end to end — design, deployment, monitoring, and reliability — across analytics and reporting workloads.',
    tags: ['ETL / ELT', 'Airflow', 'Data Modeling'],
    liveUrl: '',
    codeUrl: '',
  },
]

export const experience = [
  {
    role: 'Technical Lead / Senior Data Engineer',
    company: 'Sampath Bank',
    period: 'Feb 2025 — Present',
    points: [
      'Owning ETL pipeline design, reliability, and the engineering workflow across analytics and reporting workloads.',
      'Cut XML processing time ~7.5× (5 hours → 40 minutes) through query and script optimisation.',
      'Owned 10+ production ETL pipelines end to end, and led the data-platform selection (RFC and PoC to recommendation).',
    ],
  },
  {
    role: 'Senior Telecommunications Engineer, Data Engineering',
    company: 'Huawei Technologies Lanka',
    period: 'Mar 2020 — Feb 2025',
    points: [
      'Earned the GTS President Award for Best New Employee (2021).',
      'Built data integrations into Hadoop / HDFS using Python and Linux (ETL), and wrote day-to-day SQL to query and analyse data from the HDFS big-data platform.',
      'Developed and deployed Bash / Python automation on Linux servers for data queries and platform-monitoring reports.',
      'Established monitoring, alerting, and SLAs across ETL pipelines, improving observability and reducing failure-resolution time; led root-cause investigation for data-quality and freshness issues.',
      'Hosted and presented monthly progress reviews with the customer. (Telecommunications Engineer, Data Engineering 2020–2023; Senior 2023–2025.)',
      'Single point of contact (SPOC) for the customer; authored FRS and HLD documents translating business requirements into technical specifications.',
    ],
  },
]
