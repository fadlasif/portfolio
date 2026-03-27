/**
 * data.js — Portfolio Content
 * ─────────────────────────────
 * All personal content lives here.
 * Edit this file to update the portfolio without touching HTML or JS logic.
 *
 * Fadl Asif E — Software Engineer
 */

const PORTFOLIO_DATA = {

  /* ── Personal Info ───────────────────────────────── */
  personal: {
    name:       "Fadl Asif E",
    shortName:  "Fadl",
    title:      "Software Engineer",
    email:      "fadlasif123@gmail.com",
    phone:      "+91 9846325379",
    location:   "Calicut, Kerala, India",
    github:     "https://github.com/fadlasif",
    linkedin:   "https://linkedin.com/in/fadlasif",
    resume:     "Fadl_SEResume.pdf",
  },

  /* ── Typing animation titles ─────────────────────── */
  typedTitles: [
    "Software Engineer.",
    "AI Developer.",
    "Web Developer.",
    "Problem Solver.",
    "CS Graduate '25.",
  ],

  /* ── Projects ────────────────────────────────────── */
  projects: [
    {
      emoji: "🤖",
      name:  "EFFICODE — ML-Based Code Optimization Tool",
      desc:  "An AI-powered tool that analyses and optimises complex Python code using data structures and algorithms. Combines rule-based pattern detection, Random Forest for complexity analysis, CodeBERT for code restructuring, and T5 for natural-language explanations.",
      tags:  ["Python", "CodeBERT", "T5", "Random Forest", "ML", "DSA"],
      demo:  null,        // Replace with live URL
      github: "https://github.com/fadlasif",
    },
    {
      emoji: "📝",
      name:  "College Blogging Website",
      desc:  "A full-stack web platform enabling students to post about college events and share information in real time. Includes a dynamic commenting system for interactive peer discussions.",
      tags:  ["React", "Node.js", "HTML", "CSS", "Full-Stack"],
      demo:  null,
      github: "https://github.com/fadlasif",
    },
    {
      emoji: "⚙️",
      name:  "AutoParts Hub – E-commerce Platform",
      desc:  "A modern e-commerce platform for browsing and purchasing automotive parts with ease. Features smart search, categorized listings, and a smooth checkout experience. Ensures fast delivery, secure payments, and reliable OEM-quality products with hassle-free returns.",
      tags:  ["HTML", "CSS", "React", "MongoDB","Responsive Design"],
      demo:  null,       // null hides the Live Demo button
      github: "https://github.com/fadlasif/spareparts_project",
    },
  ],

  /* ── Skills grid ─────────────────────────────────── */
  skillGroups: [
    {
      label: "Languages",
      chips: ["Python", "Java", "C"],
    },
    {
      label: "Frontend",
      chips: ["HTML5", "CSS3", "React", "Figma"],
    },
    {
      label: "Backend",
      chips: ["Node.js", "PHP", "Laravel"],
    },
    {
      label: "AI / ML",
      chips: ["CodeBERT", "T5", "Random Forest"],
    },
    {
      label: "Database",
      chips: ["MySQL", "SQL"],
    },
    {
      label: "CS Fundamentals",
      chips: ["DSA", "DBMS", "OOP", "Operating Systems"],
    },
  ],

  /* ── Experience / Education timeline ─────────────── */
  timeline: [

    {
      date:    "Mar 2026 - Present",
      title:   "Software Engineer Intern",
      org:     "Appletlogic",
      points: [
        "Developed dynamic and responsive user interfaces using React.js and modern JavaScript (ES6+).",
        "Designed and optimized MongoDB schemas for efficient data storage and retrieval.",
      ],
    },

    {
      date:    "Nov 2025 – Dec 2025",
      title:   "Technical Executive Intern",
      org:     "Tertius Life Sciences — Tirur, Kerala",
      points: [
        "Integrated Zoho applications with Google Sheets to automate data transfer and streamline billing and packaging workflows.",
        "Designed and developed functional modules for the company's billing and packaging software.",
      ],
    },
  ],

  /* ── Certificates ────────────────────────────────── */
  certificates: [
    {
      icon: "🏅",
      name: "SQL & Relational Databases 101",
      org:  "IBM Developer Skills Network",
      link: "https://drive.google.com/file/d/1IuabvBXQgCLOnfl36DGd1HEFbtZJ8wFx/view",   // Replace with certificate URL
    },
    {
      icon: "🖥️",
      name: "3-Day Workshop on Web Development Using Node.js",
      org:  "CSI SB CEV",
      link: null,
    },
    {
      icon: "⚡",
      name: "HackFolio Hackathon",
      org:  "TinkerHub CEV",
      link: null,
    },
  ],

  /* ── Social / Contact links ──────────────────────── */
  socials: [
    { icon: "✉️",  label: "fadlasif123@gmail.com",    href: "mailto:fadlasif123@gmail.com" },
    { icon: "💼",  label: "linkedin.com/in/fadlasif",  href: "https://linkedin.com/in/fadlasif" },
    { icon: "🐙",  label: "github.com/fadlasif",       href: "https://github.com/fadlasif" },
    { icon: "📞",  label: "+91 98463 25379",            href: "tel:+919846325379" },
  ],

};