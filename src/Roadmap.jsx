import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  GraduationCap,
  Lightbulb,
  PlayCircle,
  RotateCcw,
  Target,
  Trophy,
  X,
} from "lucide-react";


// =========================================================
// RESOURCE LIBRARY
// =========================================================

const RESOURCE_LIBRARY = {

  react: {
    title: "React.js",

    description:
      "Build modern interactive frontend applications using reusable components, state and events.",

    notes: [
      "React components and JSX",
      "Props and component composition",
      "State and event handling",
      "useState and useEffect",
      "Forms and controlled components",
      "API integration in React",
    ],

    tutorialTitle: "React official learning path",

    tutorialUrl:
      "https://react.dev/learn",

    notesUrl:
      "https://react.dev/learn",

    practice: [
      "Create a reusable profile card component.",
      "Build a form using controlled inputs.",
      "Create a small dashboard using multiple components.",
    ],

    quiz: [
      {
        question:
          "What is the main building block of a React application?",
        options: [
          "Components",
          "Database tables",
          "Python classes",
          "SQL queries",
        ],
        answer: "Components",
      },
      {
        question:
          "Which React Hook is commonly used to store component state?",
        options: [
          "useState",
          "useRoute",
          "useSQL",
          "useHTML",
        ],
        answer: "useState",
      },
      {
        question:
          "What is JSX primarily used for in React?",
        options: [
          "Writing UI markup inside JavaScript",
          "Creating SQL tables",
          "Running Python code",
          "Creating database indexes",
        ],
        answer: "Writing UI markup inside JavaScript",
      },
    ],
  },


  javascript: {
    title: "JavaScript",

    description:
      "Strengthen the programming fundamentals needed for interactive web applications.",

    notes: [
      "Variables and data types",
      "Functions and arrow functions",
      "Arrays and objects",
      "DOM manipulation",
      "Events",
      "Promises and async/await",
    ],

    tutorialTitle: "MDN JavaScript Guide",

    tutorialUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",

    notesUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",

    practice: [
      "Build a dynamic to-do list.",
      "Create a form with validation.",
      "Fetch data from a public REST API.",
    ],

    quiz: [
      {
        question:
          "Which keyword creates a block-scoped variable that can be reassigned?",
        options: [
          "let",
          "class",
          "import",
          "return",
        ],
        answer: "let",
      },
      {
        question:
          "Which method converts JSON text into a JavaScript object?",
        options: [
          "JSON.parse()",
          "JSON.convert()",
          "JSON.object()",
          "JSON.read()",
        ],
        answer: "JSON.parse()",
      },
      {
        question:
          "Which feature is commonly used for handling asynchronous operations?",
        options: [
          "Promises",
          "HTML tags",
          "CSS selectors",
          "SQL joins",
        ],
        answer: "Promises",
      },
    ],
  },


  html: {
    title: "HTML",

    description:
      "Learn semantic page structure and the elements used to build accessible web pages.",

    notes: [
      "Semantic HTML",
      "Forms and inputs",
      "Links and navigation",
      "Tables",
      "Images and media",
      "Accessibility basics",
    ],

    tutorialTitle: "MDN HTML learning",

    tutorialUrl:
      "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",

    notesUrl:
      "https://developer.mozilla.org/en-US/docs/Web/HTML",

    practice: [
      "Create a semantic portfolio page.",
      "Build a registration form.",
      "Create a responsive navigation structure.",
    ],

    quiz: [
      {
        question:
          "Which element is intended for the main navigation of a page?",
        options: [
          "<nav>",
          "<data>",
          "<mainbox>",
          "<navigate>",
        ],
        answer: "<nav>",
      },
      {
        question:
          "Which attribute provides alternative text for an image?",
        options: [
          "alt",
          "srcset",
          "titleonly",
          "description",
        ],
        answer: "alt",
      },
      {
        question:
          "Which element represents the main content of a document?",
        options: [
          "<main>",
          "<content>",
          "<bodymain>",
          "<sectionmain>",
        ],
        answer: "<main>",
      },
    ],
  },


  css: {
    title: "CSS",

    description:
      "Build clean, responsive and professional interfaces using modern CSS.",

    notes: [
      "Selectors",
      "Box model",
      "Flexbox",
      "CSS Grid",
      "Responsive design",
      "Animations and transitions",
    ],

    tutorialTitle: "MDN CSS learning",

    tutorialUrl:
      "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics",

    notesUrl:
      "https://developer.mozilla.org/en-US/docs/Web/CSS",

    practice: [
      "Create a responsive landing page.",
      "Build a dashboard layout using Grid.",
      "Recreate a professional card-based interface.",
    ],

    quiz: [
      {
        question:
          "Which CSS layout system is designed for two-dimensional layouts?",
        options: [
          "CSS Grid",
          "HTML",
          "JSON",
          "SQL",
        ],
        answer: "CSS Grid",
      },
      {
        question:
          "Which property changes the text color?",
        options: [
          "color",
          "font-color",
          "text-paint",
          "foreground",
        ],
        answer: "color",
      },
      {
        question:
          "Which CSS feature is commonly used to create flexible one-dimensional layouts?",
        options: [
          "Flexbox",
          "SQL",
          "DOM",
          "JSON",
        ],
        answer: "Flexbox",
      },
    ],
  },


  sql: {
    title: "SQL",

    description:
      "Work confidently with relational databases and retrieve useful information from structured data.",

    notes: [
      "SELECT and filtering",
      "WHERE conditions",
      "GROUP BY",
      "ORDER BY",
      "JOIN operations",
      "Aggregate functions",
    ],

    tutorialTitle: "SQL tutorial",

    tutorialUrl:
      "https://www.w3schools.com/sql/",

    notesUrl:
      "https://www.w3schools.com/sql/",

    practice: [
      "Create a student database.",
      "Write queries using JOIN.",
      "Build a small project database and write analytical queries.",
    ],

    quiz: [
      {
        question:
          "Which SQL command is used to retrieve data?",
        options: [
          "SELECT",
          "GETDATA",
          "FETCHTABLE",
          "READ",
        ],
        answer: "SELECT",
      },
      {
        question:
          "Which clause filters rows?",
        options: [
          "WHERE",
          "FILTER",
          "HAVINGROW",
          "LIMITBY",
        ],
        answer: "WHERE",
      },
      {
        question:
          "Which SQL operation combines rows from related tables?",
        options: [
          "JOIN",
          "MERGEHTML",
          "CONNECT",
          "LINK",
        ],
        answer: "JOIN",
      },
    ],
  },


  python: {
    title: "Python",

    description:
      "Strengthen Python fundamentals for automation, backend development and AI-related work.",

    notes: [
      "Variables and data types",
      "Lists, tuples and dictionaries",
      "Functions",
      "Loops and conditions",
      "Object-oriented programming",
      "File handling",
    ],

    tutorialTitle: "Python official tutorial",

    tutorialUrl:
      "https://docs.python.org/3/tutorial/",

    notesUrl:
      "https://docs.python.org/3/tutorial/",

    practice: [
      "Build a command-line student management system.",
      "Read and process a CSV file.",
      "Create a small Flask API using Python.",
    ],

    quiz: [
      {
        question:
          "Which Python data structure stores key-value pairs?",
        options: [
          "Dictionary",
          "Tuple",
          "Set only",
          "String",
        ],
        answer: "Dictionary",
      },
      {
        question:
          "Which keyword defines a function?",
        options: [
          "def",
          "function",
          "func",
          "method",
        ],
        answer: "def",
      },
      {
        question:
          "Which library is commonly used to work with CSV files?",
        options: [
          "csv",
          "html",
          "react",
          "css",
        ],
        answer: "csv",
      },
    ],
  },


  git: {
    title: "Git",

    description:
      "Learn version control so you can safely manage changes in your projects.",

    notes: [
      "Repositories",
      "Commits",
      "Branches",
      "Merging",
      "Pull requests",
      "Undoing changes",
    ],

    tutorialTitle: "Git official documentation",

    tutorialUrl:
      "https://git-scm.com/docs",

    notesUrl:
      "https://git-scm.com/book/en/v2",

    practice: [
      "Create a Git repository for a project.",
      "Make meaningful commits.",
      "Create a feature branch and merge it.",
    ],

    quiz: [
      {
        question:
          "Which command creates a Git repository in the current folder?",
        options: [
          "git init",
          "git start",
          "git create",
          "git repo",
        ],
        answer: "git init",
      },
      {
        question:
          "Which command records staged changes?",
        options: [
          "git commit",
          "git record",
          "git save",
          "git push-only",
        ],
        answer: "git commit",
      },
      {
        question:
          "Which command downloads changes from a remote repository?",
        options: [
          "git pull",
          "git download",
          "git receive",
          "git sync-only",
        ],
        answer: "git pull",
      },
    ],
  },


  github: {
    title: "GitHub",

    description:
      "Learn how to manage projects, repositories and collaboration workflows professionally.",

    notes: [
      "Repositories",
      "README files",
      "Issues",
      "Branches",
      "Pull requests",
      "GitHub Pages",
    ],

    tutorialTitle: "GitHub Skills",

    tutorialUrl:
      "https://skills.github.com/",

    notesUrl:
      "https://docs.github.com/en/get-started",

    practice: [
      "Create a professional repository.",
      "Write a project README.",
      "Deploy a portfolio using GitHub Pages.",
    ],

    quiz: [
      {
        question:
          "What is a GitHub repository mainly used for?",
        options: [
          "Hosting and managing project files and version history",
          "Only storing images",
          "Only creating databases",
          "Only running SQL",
        ],
        answer:
          "Hosting and managing project files and version history",
      },
      {
        question:
          "What file commonly explains how to use a GitHub project?",
        options: [
          "README.md",
          "PROJECT.sql",
          "START.css",
          "ABOUT.exe",
        ],
        answer: "README.md",
      },
      {
        question:
          "What feature is commonly used to publish a static portfolio?",
        options: [
          "GitHub Pages",
          "GitHub Tables",
          "GitHub SQL",
          "GitHub Forms",
        ],
        answer: "GitHub Pages",
      },
    ],
  },


  aws: {
    title: "Amazon Web Services (AWS)",

    description:
      "Understand cloud fundamentals and how applications can be deployed using AWS services.",

    notes: [
      "Cloud computing fundamentals",
      "AWS regions and availability zones",
      "EC2 basics",
      "S3 basics",
      "IAM fundamentals",
      "Cloud deployment concepts",
    ],

    tutorialTitle: "AWS official training",

    tutorialUrl:
      "https://aws.amazon.com/training/",

    notesUrl:
      "https://aws.amazon.com/training/",

    practice: [
      "Create an AWS learning account.",
      "Deploy a simple static website using S3.",
      "Study how an application could be deployed using EC2.",
    ],

    quiz: [
      {
        question:
          "Which AWS service is designed for object storage?",
        options: [
          "Amazon S3",
          "Amazon EC2",
          "Amazon IAM",
          "Amazon Route UI",
        ],
        answer: "Amazon S3",
      },
      {
        question:
          "What does EC2 primarily provide?",
        options: [
          "Virtual servers",
          "Only object storage",
          "Only database tables",
          "Only DNS records",
        ],
        answer: "Virtual servers",
      },
      {
        question:
          "Which AWS service manages identities and permissions?",
        options: [
          "IAM",
          "S3",
          "EC2",
          "CloudFront only",
        ],
        answer: "IAM",
      },
    ],
  },


  kafka: {
    title: "Apache Kafka",

    description:
      "Learn the fundamentals of event streaming, producers, consumers and topics.",

    notes: [
      "Kafka architecture",
      "Topics",
      "Partitions",
      "Producers",
      "Consumers",
      "Consumer groups",
    ],

    tutorialTitle: "Apache Kafka getting started",

    tutorialUrl:
      "https://kafka.apache.org/getting-started",

    notesUrl:
      "https://kafka.apache.org/intro",

    practice: [
      "Understand producer and consumer flow.",
      "Create a sample topic.",
      "Build a small event-streaming demonstration.",
    ],

    quiz: [
      {
        question:
          "What is a Kafka topic?",
        options: [
          "A category or stream where records are stored",
          "A programming language",
          "A database table only",
          "A UI component",
        ],
        answer:
          "A category or stream where records are stored",
      },
      {
        question:
          "Which component publishes records to Kafka?",
        options: [
          "Producer",
          "Consumer",
          "Partition manager",
          "Dashboard",
        ],
        answer: "Producer",
      },
      {
        question:
          "Which component reads records from Kafka?",
        options: [
          "Consumer",
          "Producer",
          "Compiler",
          "Router",
        ],
        answer: "Consumer",
      },
    ],
  },


  jira: {
    title: "Atlassian Jira",

    description:
      "Learn how Jira is used to plan, track and manage software development work.",

    notes: [
      "Projects and spaces",
      "Work items",
      "Boards",
      "Backlogs",
      "Sprints",
      "Workflow and status tracking",
    ],

    tutorialTitle: "Jira beginner tutorial",

    tutorialUrl:
      "https://learning.atlassian.com/learning/collection/topic/atlassian-answered-jira-tutorial-for-beginners",

    notesUrl:
      "https://support.atlassian.com/jira-software-cloud/docs/get-started-with-jira-software-cloud/",

    practice: [
      "Create a sample software project.",
      "Create work items for a website project.",
      "Organize tasks into a sprint board.",
    ],

    quiz: [
      {
        question:
          "What is Jira commonly used for?",
        options: [
          "Planning and tracking work",
          "Writing HTML only",
          "Managing SQL tables only",
          "Editing photographs",
        ],
        answer:
          "Planning and tracking work",
      },
      {
        question:
          "What is a sprint in Agile work?",
        options: [
          "A time-boxed period for completing planned work",
          "A database server",
          "A programming language",
          "A Git repository",
        ],
        answer:
          "A time-boxed period for completing planned work",
      },
      {
        question:
          "What can a Jira board help a team visualize?",
        options: [
          "Work items and their progress",
          "Only source code",
          "Only database schemas",
          "Only certificates",
        ],
        answer:
          "Work items and their progress",
      },
    ],
  },


  rest: {
    title: "REST API",

    description:
      "Learn how frontend applications communicate with backend services.",

    notes: [
      "HTTP methods",
      "GET, POST, PUT and DELETE",
      "Request and response",
      "JSON",
      "Status codes",
      "API authentication basics",
    ],

    tutorialTitle: "MDN HTTP and API concepts",

    tutorialUrl:
      "https://developer.mozilla.org/en-US/docs/Web/HTTP",

    notesUrl:
      "https://developer.mozilla.org/en-US/docs/Web/HTTP",

    practice: [
      "Create a small REST API.",
      "Connect a React frontend to an API.",
      "Handle loading, success and error states.",
    ],

    quiz: [
      {
        question:
          "Which HTTP method is commonly used to retrieve data?",
        options: [
          "GET",
          "POST",
          "DELETE",
          "PATCH-only",
        ],
        answer: "GET",
      },
      {
        question:
          "Which format is commonly used to exchange structured API data?",
        options: [
          "JSON",
          "JPEG",
          "MP3",
          "EXE",
        ],
        answer: "JSON",
      },
      {
        question:
          "Which HTTP status commonly indicates a successful request?",
        options: [
          "200",
          "404",
          "500",
          "403",
        ],
        answer: "200",
      },
    ],
  },


  excel: {
    title: "Microsoft Excel",

    description:
      "Develop practical spreadsheet skills for data handling and analysis.",

    notes: [
      "Formulas",
      "Functions",
      "Sorting and filtering",
      "Tables",
      "Charts",
      "Pivot tables",
    ],

    tutorialTitle: "Microsoft Excel learning",

    tutorialUrl:
      "https://support.microsoft.com/en-us/excel",

    notesUrl:
      "https://support.microsoft.com/en-us/excel",

    practice: [
      "Create a student performance sheet.",
      "Use formulas to calculate results.",
      "Create a dashboard using charts and pivot tables.",
    ],

    quiz: [
      {
        question:
          "Which Excel feature summarizes data interactively?",
        options: [
          "PivotTable",
          "TextBox",
          "WordArt",
          "Page Break",
        ],
        answer: "PivotTable",
      },
      {
        question:
          "Which function calculates the arithmetic mean?",
        options: [
          "AVERAGE",
          "TOTAL",
          "MEANROW",
          "CALC",
        ],
        answer: "AVERAGE",
      },
      {
        question:
          "Which feature can display data visually?",
        options: [
          "Charts",
          "Comments only",
          "Page margins",
          "Headers only",
        ],
        answer: "Charts",
      },
    ],
  },


  powerbi: {
    title: "Power BI",

    description:
      "Build interactive dashboards and reports from structured data.",

    notes: [
      "Data import",
      "Data transformation",
      "Relationships",
      "Measures",
      "Visualizations",
      "Dashboard design",
    ],

    tutorialTitle: "Microsoft Power BI learning",

    tutorialUrl:
      "https://learn.microsoft.com/en-us/training/powerplatform/power-bi/",

    notesUrl:
      "https://learn.microsoft.com/en-us/power-bi/",

    practice: [
      "Import a CSV dataset.",
      "Create relationships between tables.",
      "Build a dashboard with useful KPIs.",
    ],

    quiz: [
      {
        question:
          "What is Power BI primarily used for?",
        options: [
          "Data visualization and business intelligence",
          "Operating system development",
          "HTML compilation",
          "Version control",
        ],
        answer:
          "Data visualization and business intelligence",
      },
      {
        question:
          "What is a Power BI report mainly composed of?",
        options: [
          "Visualizations and report pages",
          "Git branches",
          "HTML files only",
          "Java classes only",
        ],
        answer:
          "Visualizations and report pages",
      },
      {
        question:
          "What is a measure used for in Power BI?",
        options: [
          "A calculation used in analysis",
          "A CSS style",
          "A Git commit",
          "A JavaScript event",
        ],
        answer:
          "A calculation used in analysis",
      },
    ],
  },
};


// =========================================================
// GENERIC FALLBACK
// =========================================================

function getResource(skillName) {

  const value = String(
    skillName || ""
  ).toLowerCase().trim();

  if (
    value.includes("react")
  ) {
    return RESOURCE_LIBRARY.react;
  }

  if (
    value.includes("javascript")
    || value === "js"
  ) {
    return RESOURCE_LIBRARY.javascript;
  }

  if (
    value.includes("html")
  ) {
    return RESOURCE_LIBRARY.html;
  }

  if (
    value.includes("css")
  ) {
    return RESOURCE_LIBRARY.css;
  }

  if (
    value.includes("sql")
    || value.includes("database")
  ) {
    return RESOURCE_LIBRARY.sql;
  }

  if (
    value.includes("python")
  ) {
    return RESOURCE_LIBRARY.python;
  }

  if (
    value === "git"
    || value.includes("version control")
  ) {
    return RESOURCE_LIBRARY.git;
  }

  if (
    value.includes("github")
  ) {
    return RESOURCE_LIBRARY.github;
  }

  if (
    value.includes("amazon web services")
    || value === "aws"
  ) {
    return RESOURCE_LIBRARY.aws;
  }

  if (
    value.includes("kafka")
  ) {
    return RESOURCE_LIBRARY.kafka;
  }

  if (
    value.includes("jira")
    || value.includes("atlassian")
  ) {
    return RESOURCE_LIBRARY.jira;
  }

  if (
    value.includes("rest api")
    || value.includes("rest")
  ) {
    return RESOURCE_LIBRARY.rest;
  }

  if (
    value.includes("excel")
  ) {
    return RESOURCE_LIBRARY.excel;
  }

  if (
    value.includes("power bi")
  ) {
    return RESOURCE_LIBRARY.powerbi;
  }

  return {
    title: skillName,

    description:
      `Build practical knowledge and evidence for ${skillName}.`,

    notes: [
      `Understand the fundamentals of ${skillName}.`,
      `Learn the important concepts of ${skillName}.`,
      `Study common real-world applications.`,
      `Practice the skill through a small project.`,
    ],

    tutorialTitle:
      `${skillName} learning resources`,

    tutorialUrl:
      `https://www.google.com/search?q=${encodeURIComponent(
        skillName + " tutorial"
      )}`,

    notesUrl:
      `https://www.google.com/search?q=${encodeURIComponent(
        skillName + " notes"
      )}`,

    practice: [
      `Complete beginner exercises for ${skillName}.`,
      `Build a small practical task using ${skillName}.`,
      `Apply ${skillName} in a project.`,
    ],

    quiz: [],
  };
}


// =========================================================
// ROADMAP COMPONENT
// =========================================================

function Roadmap({
  roadmapData,
  onBack,
}) {

  const [expandedSkill, setExpandedSkill] =
    useState(null);

  const [completedSkills, setCompletedSkills] =
    useState([]);

  const [quizSkill, setQuizSkill] =
    useState(null);

  const [tutorialSkill, setTutorialSkill] =
    useState(null);

  const [quizAnswers, setQuizAnswers] =
    useState({});

  const [quizSubmitted, setQuizSubmitted] =
    useState(false);


  // -------------------------------------------------------
  // SKILL LIST
  // -------------------------------------------------------

  const skills = useMemo(() => {

    const partial =
      roadmapData?.partial_skills || [];

    const missing =
      roadmapData?.missing_skills || [];

    const all = [
      ...partial,
      ...missing,
    ];

    const unique = [];

    const seen = new Set();

    all.forEach((skill) => {

      const name =
        skill?.name ||
        skill?.title ||
        "";

      if (!name) return;

      const key =
        name.toLowerCase().trim();

      if (seen.has(key)) return;

      seen.add(key);

      unique.push(skill);
    });

    return unique;

  }, [roadmapData]);


  // -------------------------------------------------------
  // COMPLETION
  // -------------------------------------------------------

  const toggleCompleted = (
    skillName
  ) => {

    setCompletedSkills((previous) => {

      if (
        previous.includes(skillName)
      ) {

        return previous.filter(
          (item) =>
            item !== skillName
        );

      }

      return [
        ...previous,
        skillName,
      ];

    });

  };


  // -------------------------------------------------------
  // QUIZ
  // -------------------------------------------------------

  const openQuiz = (
    skill
  ) => {

    setQuizSkill(skill);

    setQuizAnswers({});

    setQuizSubmitted(false);

  };


  const closeQuiz = () => {

    setQuizSkill(null);

    setQuizAnswers({});

    setQuizSubmitted(false);

  };


  const selectQuizAnswer = (
    questionIndex,
    answer
  ) => {

    if (quizSubmitted) return;

    setQuizAnswers(
      (previous) => ({
        ...previous,
        [questionIndex]: answer,
      })
    );

  };


  const submitQuiz = () => {

    setQuizSubmitted(true);

  };


  const calculateQuizScore = () => {

    if (!quizSkill) return 0;

    const resource =
      getResource(
        quizSkill.name
      );

    if (!resource.quiz.length) {
      return 0;
    }

    let score = 0;

    resource.quiz.forEach(
      (question, index) => {

        if (
          quizAnswers[index]
          ===
          question.answer
        ) {

          score += 1;

        }

      }
    );

    return score;

  };


  const completeFromQuiz = () => {

    if (!quizSkill) return;

    const score =
      calculateQuizScore();

    const resource =
      getResource(
        quizSkill.name
      );

    if (
      score === resource.quiz.length
    ) {

      toggleCompleted(
        quizSkill.name
      );

    }

    closeQuiz();

  };


  // -------------------------------------------------------
  // TUTORIAL
  // -------------------------------------------------------

  const openTutorial = (
    skill
  ) => {

    setTutorialSkill(skill);

  };


  const closeTutorial = () => {

    setTutorialSkill(null);

  };


  // -------------------------------------------------------
  // PROGRESS
  // -------------------------------------------------------

  const completedCount =
    completedSkills.length;

  const totalCount =
    skills.length;

  const progress =
    totalCount > 0
      ? Math.round(
          (
            completedCount
            /
            totalCount
          ) * 100
        )
      : 0;


  const readiness =
    roadmapData?.readiness_score ??
    roadmapData?.career_readiness_score ??
    0;


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <div className="roadmap-page">

      <style>{`

        * {
          box-sizing: border-box;
        }

        .roadmap-page {
          min-height: 100vh;
          background:
            linear-gradient(
              180deg,
              #f8fafc 0%,
              #f4f7fb 100%
            );
          color: #172033;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .roadmap-container {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
          padding: 28px 0 80px;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .back-button {
          border: 0;
          background: transparent;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #52617a;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          padding: 8px 0;
        }

        .back-button:hover {
          color: #2447d8;
        }

        .brand-label {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #66738a;
          font-size: 14px;
          font-weight: 600;
        }

        .hero {
          background: #ffffff;
          border: 1px solid #e5eaf1;
          border-radius: 24px;
          padding: 34px;
          box-shadow:
            0 12px 35px rgba(15, 23, 42, 0.06);
          margin-bottom: 22px;
        }

        .hero-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            270px;
          gap: 30px;
          align-items: center;
        }

        .eyebrow {
          color: #3156e8;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .09em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .hero h1 {
          margin: 0;
          font-size: 31px;
          line-height: 1.15;
          letter-spacing: -0.025em;
          color: #172033;
        }

        .hero p {
          margin: 12px 0 0;
          color: #68758b;
          font-size: 15px;
          line-height: 1.7;
          max-width: 720px;
        }

        .score-box {
          border: 1px solid #e3e8f0;
          border-radius: 20px;
          padding: 20px;
          background: #fbfcfe;
        }

        .score-top {
          display: flex;
          align-items: end;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .score-label {
          color: #738096;
          font-size: 12px;
          font-weight: 700;
        }

        .score-number {
          color: #172033;
          font-size: 34px;
          font-weight: 800;
        }

        .progress-track {
          width: 100%;
          height: 8px;
          border-radius: 99px;
          background: #e9edf4;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 99px;
          background: #3156e8;
          transition: width .3s ease;
        }

        .score-caption {
          margin-top: 10px;
          color: #7b879a;
          font-size: 12px;
        }

        .learning-progress {
          background: #ffffff;
          border: 1px solid #e5eaf1;
          border-radius: 20px;
          padding: 20px 24px;
          margin-bottom: 22px;
        }

        .learning-progress-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .learning-progress-title {
          font-size: 14px;
          font-weight: 750;
        }

        .learning-progress-value {
          color: #3156e8;
          font-size: 14px;
          font-weight: 800;
        }

        .section-title {
          margin: 28px 0 14px;
          font-size: 18px;
          font-weight: 800;
        }

        .skill-card {
          background: #ffffff;
          border: 1px solid #e2e7ef;
          border-radius: 20px;
          margin-bottom: 14px;
          overflow: hidden;
          transition:
            border-color .2s ease,
            box-shadow .2s ease;
        }

        .skill-card:hover {
          border-color: #cbd5e5;
          box-shadow:
            0 10px 28px rgba(15, 23, 42, 0.055);
        }

        .skill-header {
          display: grid;
          grid-template-columns: 48px minmax(0, 1fr) auto;
          gap: 16px;
          align-items: center;
          padding: 22px 24px;
          cursor: pointer;
        }

        .skill-number {
          width: 42px;
          height: 42px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eef2ff;
          color: #3156e8;
          font-size: 13px;
          font-weight: 850;
        }

        .skill-info {
          min-width: 0;
        }

        .skill-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 5px;
        }

        .skill-status {
          font-size: 10px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: #c56b00;
        }

        .skill-duration {
          color: #8a95a7;
          font-size: 11px;
        }

        .skill-name {
          margin: 0;
          color: #182238;
          font-size: 19px;
          font-weight: 750;
        }

        .skill-evidence {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 9px;
        }

        .evidence-label {
          color: #788499;
          font-size: 11px;
        }

        .mini-track {
          width: 150px;
          height: 6px;
          border-radius: 99px;
          background: #edf0f5;
          overflow: hidden;
        }

        .mini-fill {
          height: 100%;
          background: #3156e8;
          border-radius: 99px;
        }

        .evidence-score {
          color: #26344c;
          font-size: 11px;
          font-weight: 800;
        }

        .skill-actions {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .icon-button {
          width: 38px;
          height: 38px;
          border: 1px solid #e1e6ee;
          background: #ffffff;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #68758a;
          cursor: pointer;
        }

        .icon-button:hover {
          color: #3156e8;
          border-color: #cbd5e5;
          background: #f8faff;
        }

        .completed-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #16855c;
          font-size: 12px;
          font-weight: 750;
          margin-right: 6px;
        }

        .skill-body {
          border-top: 1px solid #edf0f4;
          padding: 24px;
          background: #fbfcfe;
        }

        .skill-intro {
          display: flex;
          justify-content: space-between;
          align-items: start;
          gap: 20px;
          margin-bottom: 20px;
        }

        .skill-description {
          margin: 0;
          color: #69768b;
          line-height: 1.65;
          font-size: 14px;
          max-width: 780px;
        }

        .complete-button {
          white-space: nowrap;
          border: 0;
          background: #3156e8;
          color: white;
          padding: 11px 16px;
          border-radius: 11px;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .complete-button:hover {
          background: #2447d8;
        }

        .complete-button.done {
          background: #e8f7f0;
          color: #16855c;
        }

        .resource-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 15px;
        }

        .resource-card {
          background: #ffffff;
          border: 1px solid #e3e8ef;
          border-radius: 16px;
          padding: 19px;
          min-height: 210px;
        }

        .resource-icon {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 13px;
        }

        .resource-icon.notes {
          background: #eef2ff;
          color: #3156e8;
        }

        .resource-icon.tutorial {
          background: #ecf8f2;
          color: #16855c;
        }

        .resource-icon.assessment {
          background: #fff4e7;
          color: #c56b00;
        }

        .resource-card h3 {
          margin: 0 0 6px;
          color: #172033;
          font-size: 15px;
        }

        .resource-card p {
          margin: 0 0 14px;
          color: #778399;
          font-size: 12px;
          line-height: 1.6;
        }

        .resource-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .resource-list li {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          margin-bottom: 9px;
          color: #59667c;
          font-size: 12px;
          line-height: 1.45;
        }

        .resource-list li svg {
          flex: 0 0 auto;
          color: #3156e8;
          margin-top: 2px;
        }

        .resource-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid #dfe5ed;
          background: #ffffff;
          color: #3156e8;
          padding: 9px 12px;
          border-radius: 9px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 750;
        }

        .resource-link:hover {
          background: #f7f9ff;
        }

        .quiz-button {
          width: 100%;
          border: 0;
          background: #fff0dd;
          color: #a85d00;
          padding: 11px 12px;
          border-radius: 9px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 800;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 7px;
        }

        .quiz-button:hover {
          background: #ffe8c9;
        }

        .no-quiz {
          color: #8a95a7;
          font-size: 12px;
          line-height: 1.5;
        }

        .next-section {
          margin-top: 26px;
          background: #172033;
          color: #ffffff;
          border-radius: 20px;
          padding: 24px 26px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .next-section h3 {
          margin: 0 0 5px;
          font-size: 16px;
        }

        .next-section p {
          margin: 0;
          color: #aeb9ca;
          font-size: 12px;
        }

        .next-progress {
          min-width: 210px;
        }

        .next-progress .progress-track {
          background: rgba(255,255,255,.15);
        }

        .next-progress .progress-fill {
          background: #ffffff;
        }

        /* MODALS */

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, .52);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
        }

        .modal {
          width: min(720px, 100%);
          max-height: 88vh;
          overflow-y: auto;
          background: #ffffff;
          border-radius: 22px;
          box-shadow:
            0 25px 80px rgba(15, 23, 42, .25);
        }

        .modal-header {
          padding: 23px 25px;
          border-bottom: 1px solid #e7ebf1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .modal-title {
          margin: 0;
          font-size: 19px;
          font-weight: 800;
        }

        .modal-subtitle {
          margin: 4px 0 0;
          color: #778399;
          font-size: 12px;
        }

        .modal-body {
          padding: 25px;
        }

        .tutorial-hero {
          background: #f6f8ff;
          border: 1px solid #e0e6ff;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 18px;
        }

        .tutorial-hero h3 {
          margin: 0 0 8px;
          color: #25345c;
          font-size: 16px;
        }

        .tutorial-hero p {
          margin: 0;
          color: #65728a;
          font-size: 13px;
          line-height: 1.6;
        }

        .tutorial-step {
          display: flex;
          gap: 12px;
          margin-bottom: 15px;
        }

        .tutorial-step-number {
          width: 27px;
          height: 27px;
          border-radius: 50%;
          background: #eef2ff;
          color: #3156e8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          flex: 0 0 auto;
        }

        .tutorial-step strong {
          display: block;
          margin-bottom: 3px;
          font-size: 13px;
        }

        .tutorial-step span {
          color: #778399;
          font-size: 12px;
          line-height: 1.5;
        }

        .modal-footer {
          padding: 18px 25px;
          border-top: 1px solid #e7ebf1;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .secondary-button {
          border: 1px solid #dfe4ec;
          background: #ffffff;
          color: #52617a;
          border-radius: 10px;
          padding: 10px 15px;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
        }

        .primary-button {
          border: 0;
          background: #3156e8;
          color: #ffffff;
          border-radius: 10px;
          padding: 10px 15px;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .quiz-question {
          border: 1px solid #e4e8ef;
          border-radius: 15px;
          padding: 18px;
          margin-bottom: 15px;
        }

        .question-number {
          color: #3156e8;
          font-size: 11px;
          font-weight: 850;
          text-transform: uppercase;
          margin-bottom: 7px;
        }

        .question-text {
          color: #202c42;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.5;
          margin-bottom: 13px;
        }

        .quiz-option {
          width: 100%;
          text-align: left;
          border: 1px solid #e1e6ee;
          background: #ffffff;
          color: #52617a;
          border-radius: 10px;
          padding: 11px 13px;
          margin-top: 7px;
          cursor: pointer;
          font-size: 12px;
        }

        .quiz-option:hover {
          border-color: #aebbe0;
          background: #f8faff;
        }

        .quiz-option.selected {
          border-color: #3156e8;
          background: #eef2ff;
          color: #2447d8;
        }

        .quiz-option.correct {
          border-color: #55b58d;
          background: #ecf8f2;
          color: #126f4d;
        }

        .quiz-option.wrong {
          border-color: #e48b8b;
          background: #fff0f0;
          color: #a83c3c;
        }

        .quiz-result {
          border-radius: 15px;
          padding: 18px;
          margin-top: 15px;
          background: #f6f8fb;
          border: 1px solid #e3e8ef;
        }

        .quiz-result-score {
          font-size: 27px;
          font-weight: 850;
          color: #172033;
        }

        .quiz-result p {
          margin: 5px 0 0;
          color: #718096;
          font-size: 12px;
        }

        @media (max-width: 850px) {

          .hero-grid {
            grid-template-columns: 1fr;
          }

          .resource-grid {
            grid-template-columns: 1fr;
          }

          .skill-header {
            grid-template-columns:
              42px minmax(0, 1fr);
          }

          .skill-actions {
            grid-column: 2;
          }

          .skill-intro {
            flex-direction: column;
          }

          .next-section {
            flex-direction: column;
            align-items: stretch;
          }

          .next-progress {
            min-width: 0;
          }

        }

        @media (max-width: 550px) {

          .roadmap-container {
            width: min(
              100% - 24px,
              1180px
            );
            padding-top: 18px;
          }

          .hero {
            padding: 22px;
            border-radius: 18px;
          }

          .hero h1 {
            font-size: 25px;
          }

          .skill-header {
            padding: 18px;
          }

          .skill-body {
            padding: 18px;
          }

          .mini-track {
            width: 90px;
          }

        }

      `}</style>


      <div className="roadmap-container">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <div className="topbar">

          <button
            className="back-button"
            onClick={onBack}
          >
            <ArrowLeft size={17} />
            Back to Skill Analysis
          </button>

          <div className="brand-label">
            <GraduationCap size={18} />
            Personalized Roadmap
          </div>

        </div>


        {/* =================================================
            HERO
        ================================================= */}

        <section className="hero">

          <div className="hero-grid">

            <div>

              <div className="eyebrow">
                Your learning plan
              </div>

              <h1>
                {roadmapData?.career?.name ||
                  "Personalized Career Roadmap"}
              </h1>

              <p>
                Build the skills identified from your
                resume analysis through structured
                notes, tutorials, practical tasks and
                skill assessments.
              </p>

            </div>


            <div className="score-box">

              <div className="score-top">

                <div>
                  <div className="score-label">
                    Current readiness
                  </div>

                  <div className="score-number">
                    {readiness}%
                  </div>
                </div>

                <Target
                  size={25}
                  color="#3156e8"
                />

              </div>

              <div className="progress-track">

                <div
                  className="progress-fill"
                  style={{
                    width:
                      `${Math.min(
                        Math.max(
                          readiness,
                          0
                        ),
                        100
                      )}%`,
                  }}
                />

              </div>

              <div className="score-caption">
                Based on the evidence found in your
                submitted resume.
              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            LEARNING PROGRESS
        ================================================= */}

        <section className="learning-progress">

          <div className="learning-progress-header">

            <div className="learning-progress-title">
              Roadmap completion
            </div>

            <div className="learning-progress-value">
              {completedCount}/{totalCount}
            </div>

          </div>

          <div className="progress-track">

            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          <div className="score-caption">
            Complete the learning cycle for each
            skill: Notes → Tutorial → Practice → Quiz.
          </div>

        </section>


        {/* =================================================
            SKILLS
        ================================================= */}

        <h2 className="section-title">
          Skills to develop
        </h2>


        {skills.length === 0 ? (

          <section className="skill-card">

            <div
              style={{
                padding: "30px",
                textAlign: "center",
                color: "#748197",
              }}
            >
              No development skills were returned
              from the skill analysis.
            </div>

          </section>

        ) : (

          skills.map(
            (skill, index) => {

              const name =
                skill.name ||
                skill.title ||
                "Skill";

              const score =
                Number(
                  skill.score ?? 0
                );

              const resource =
                getResource(name);

              const isExpanded =
                expandedSkill === name;

              const isCompleted =
                completedSkills.includes(
                  name
                );

              return (

                <article
                  className="skill-card"
                  key={`${name}-${index}`}
                >

                  {/* =======================================
                      SKILL HEADER
                  ======================================= */}

                  <div
                    className="skill-header"
                    onClick={() =>
                      setExpandedSkill(
                        isExpanded
                          ? null
                          : name
                      )
                    }
                  >

                    <div className="skill-number">
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </div>


                    <div className="skill-info">

                      <div className="skill-meta">

                        <span className="skill-status">
                          {score === 50
                            ? "Needs strengthening"
                            : "Skill to develop"}
                        </span>

                        <span className="skill-duration">
                          1–2 weeks
                        </span>

                      </div>

                      <h3 className="skill-name">
                        {name}
                      </h3>

                      <div className="skill-evidence">

                        <span className="evidence-label">
                          Current evidence
                        </span>

                        <div className="mini-track">

                          <div
                            className="mini-fill"
                            style={{
                              width:
                                `${Math.min(
                                  Math.max(
                                    score,
                                    0
                                  ),
                                  100
                                )}%`,
                            }}
                          />

                        </div>

                        <span className="evidence-score">
                          {score}%
                        </span>

                      </div>

                    </div>


                    <div className="skill-actions">

                      {isCompleted && (

                        <div className="completed-badge">

                          <CheckCircle2
                            size={16}
                          />

                          Completed

                        </div>

                      )}

                      <button
                        className="icon-button"
                        onClick={(event) => {

                          event.stopPropagation();

                          setExpandedSkill(
                            isExpanded
                              ? null
                              : name
                          );

                        }}
                      >

                        {isExpanded ? (
                          <ChevronUp
                            size={17}
                          />
                        ) : (
                          <ChevronDown
                            size={17}
                          />
                        )}

                      </button>

                    </div>

                  </div>


                  {/* =======================================
                      EXPANDED LEARNING AREA
                  ======================================= */}

                  {isExpanded && (

                    <div className="skill-body">

                      <div className="skill-intro">

                        <p className="skill-description">
                          {resource.description}
                        </p>

                        <button
                          className={
                            `complete-button ${
                              isCompleted
                                ? "done"
                                : ""
                            }`
                          }
                          onClick={() =>
                            toggleCompleted(
                              name
                            )
                          }
                        >

                          <Check size={15} />

                          {isCompleted
                            ? "Completed"
                            : "Mark as completed"}

                        </button>

                      </div>


                      <div className="resource-grid">

                        {/* =================================
                            NOTES
                        ================================= */}

                        <div className="resource-card">

                          <div className="resource-icon notes">

                            <FileText
                              size={19}
                            />

                          </div>

                          <h3>
                            1. Notes
                          </h3>

                          <p>
                            Start here. Review these
                            concepts before watching
                            the tutorial.
                          </p>

                          <ul className="resource-list">

                            {resource.notes.map(
                              (note, noteIndex) => (

                                <li
                                  key={noteIndex}
                                >

                                  <Check
                                    size={13}
                                  />

                                  <span>
                                    {note}
                                  </span>

                                </li>

                              )
                            )}

                          </ul>

                          <a
                            className="resource-link"
                            href={
                              resource.notesUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              marginTop: 8,
                            }}
                          >

                            Open notes

                            <ExternalLink
                              size={13}
                            />

                          </a>

                        </div>


                        {/* =================================
                            TUTORIAL
                        ================================= */}

                        <div className="resource-card">

                          <div className="resource-icon tutorial">

                            <PlayCircle
                              size={19}
                            />

                          </div>

                          <h3>
                            2. Tutorial
                          </h3>

                          <p>
                            Follow a structured tutorial
                            and learn the skill step by step.
                          </p>

                          <button
                            className="resource-link"
                            style={{
                              cursor: "pointer",
                              background:
                                "#ffffff",
                            }}
                            onClick={() =>
                              openTutorial(
                                skill
                              )
                            }
                          >

                            Start tutorial

                            <ArrowRight
                              size={13}
                            />

                          </button>

                          <div
                            style={{
                              marginTop: 12,
                              color: "#8a95a7",
                              fontSize: 11,
                              lineHeight: 1.5,
                            }}
                          >
                            Recommended:
                            <br />
                            {resource.tutorialTitle}
                          </div>

                        </div>


                        {/* =================================
                            ASSESSMENT
                        ================================= */}

                        <div className="resource-card">

                          <div className="resource-icon assessment">

                            <Trophy
                              size={19}
                            />

                          </div>

                          <h3>
                            3. Assessment
                          </h3>

                          <p>
                            Test what you learned with
                            a short skill-based quiz.
                          </p>

                          {resource.quiz.length > 0 ? (

                            <button
                              className="quiz-button"
                              onClick={() =>
                                openQuiz(
                                  skill
                                )
                              }
                            >

                              <GraduationCap
                                size={15}
                              />

                              Take quiz

                            </button>

                          ) : (

                            <div className="no-quiz">
                              Assessment content for
                              this skill will be added
                              to the learning library.
                            </div>

                          )}

                        </div>

                      </div>


                      {/* =================================
                          PRACTICE
                      ================================= */}

                      <div
                        style={{
                          marginTop: 18,
                          background: "#ffffff",
                          border:
                            "1px solid #e3e8ef",
                          borderRadius: 16,
                          padding: 20,
                        }}
                      >

                        <div
                          style={{
                            display: "flex",
                            alignItems:
                              "center",
                            gap: 10,
                            marginBottom: 13,
                          }}
                        >

                          <div
                            className="resource-icon tutorial"
                            style={{
                              margin: 0,
                            }}
                          >

                            <Lightbulb
                              size={18}
                            />

                          </div>

                          <div>

                            <h3
                              style={{
                                margin: 0,
                                fontSize: 15,
                              }}
                            >
                              Practical tasks
                            </h3>

                            <span
                              style={{
                                color:
                                  "#7b879a",
                                fontSize: 11,
                              }}
                            >
                              Build evidence for this skill
                            </span>

                          </div>

                        </div>


                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(3, minmax(0, 1fr))",
                            gap: 12,
                          }}
                        >

                          {resource.practice.map(
                            (
                              task,
                              taskIndex
                            ) => (

                              <div
                                key={taskIndex}
                                style={{
                                  border:
                                    "1px solid #e7ebf1",
                                  borderRadius:
                                    11,
                                  padding:
                                    "12px 13px",
                                  color:
                                    "#5e6b80",
                                  fontSize:
                                    12,
                                  lineHeight:
                                    1.5,
                                }}
                              >

                                <strong
                                  style={{
                                    color:
                                      "#3156e8",
                                    marginRight:
                                      6,
                                  }}
                                >
                                  {taskIndex + 1}.
                                </strong>

                                {task}

                              </div>

                            )
                          )}

                        </div>

                      </div>

                    </div>

                  )}

                </article>

              );

            }
          )

        )}


        {/* =================================================
            NEXT STEPS
        ================================================= */}

        <section className="next-section">

          <div>

            <h3>
              Your next step
            </h3>

            <p>
              Learn the missing skills, complete the
              practical tasks and validate your knowledge
              through the quizzes.
            </p>

          </div>

          <div className="next-progress">

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginBottom: 8,
                fontSize: 11,
                color: "#c4ccda",
              }}
            >

              <span>
                Learning progress
              </span>

              <span>
                {progress}%
              </span>

            </div>

            <div className="progress-track">

              <div
                className="progress-fill"
                style={{
                  width:
                    `${progress}%`,
                }}
              />

            </div>

          </div>

        </section>

      </div>


      {/* ===================================================
          TUTORIAL MODAL
      =================================================== */}

      {tutorialSkill && (

        <div
          className="modal-overlay"
          onClick={closeTutorial}
        >

          <div
            className="modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2 className="modal-title">
                  Learn{" "}
                  {tutorialSkill.name}
                </h2>

                <p className="modal-subtitle">
                  Follow the learning sequence
                  before taking the assessment.
                </p>

              </div>

              <button
                className="icon-button"
                onClick={closeTutorial}
              >
                <X size={17} />
              </button>

            </div>


            <div className="modal-body">

              <div className="tutorial-hero">

                <h3>
                  {getResource(
                    tutorialSkill.name
                  ).tutorialTitle}
                </h3>

                <p>
                  Start with the official/tutorial
                  resource, then return here and
                  complete the practical task and quiz.
                </p>

              </div>


              <div className="tutorial-step">

                <div className="tutorial-step-number">
                  1
                </div>

                <div>

                  <strong>
                    Review the notes
                  </strong>

                  <span>
                    Understand the basic concepts
                    before moving to implementation.
                  </span>

                </div>

              </div>


              <div className="tutorial-step">

                <div className="tutorial-step-number">
                  2
                </div>

                <div>

                  <strong>
                    Watch / follow the tutorial
                  </strong>

                  <span>
                    Follow the recommended external
                    learning resource step by step.
                  </span>

                </div>

              </div>


              <div className="tutorial-step">

                <div className="tutorial-step-number">
                  3
                </div>

                <div>

                  <strong>
                    Build something
                  </strong>

                  <span>
                    Complete the practical tasks shown
                    on the roadmap.
                  </span>

                </div>

              </div>


              <div className="tutorial-step">

                <div className="tutorial-step-number">
                  4
                </div>

                <div>

                  <strong>
                    Take the quiz
                  </strong>

                  <span>
                    Check whether you actually
                    understood the skill.
                  </span>

                </div>

              </div>

            </div>


            <div className="modal-footer">

              <button
                className="secondary-button"
                onClick={closeTutorial}
              >
                Close
              </button>

              <a
                className="primary-button"
                href={
                  getResource(
                    tutorialSkill.name
                  ).tutorialUrl
                }
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: "none",
                }}
              >

                Open tutorial

                <ExternalLink
                  size={14}
                />

              </a>

            </div>

          </div>

        </div>

      )}


      {/* ===================================================
          QUIZ MODAL
      =================================================== */}

      {quizSkill && (

        <div
          className="modal-overlay"
          onClick={closeQuiz}
        >

          <div
            className="modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2 className="modal-title">
                  {quizSkill.name} Assessment
                </h2>

                <p className="modal-subtitle">
                  Check your understanding before
                  marking this skill complete.
                </p>

              </div>

              <button
                className="icon-button"
                onClick={closeQuiz}
              >
                <X size={17} />
              </button>

            </div>


            <div className="modal-body">

              {getResource(
                quizSkill.name
              ).quiz.map(
                (question, questionIndex) => {

                  const selected =
                    quizAnswers[
                      questionIndex
                    ];

                  return (

                    <div
                      className="quiz-question"
                      key={questionIndex}
                    >

                      <div className="question-number">
                        Question{" "}
                        {questionIndex + 1}
                      </div>

                      <div className="question-text">
                        {question.question}
                      </div>


                      {question.options.map(
                        (option) => {

                          const isSelected =
                            selected === option;

                          const isCorrect =
                            quizSubmitted
                            &&
                            option ===
                              question.answer;

                          const isWrong =
                            quizSubmitted
                            &&
                            isSelected
                            &&
                            option !==
                              question.answer;

                          return (

                            <button
                              key={option}
                              className={
                                `quiz-option ${
                                  isCorrect
                                    ? "correct"
                                    : ""
                                } ${
                                  isWrong
                                    ? "wrong"
                                    : ""
                                } ${
                                  isSelected
                                  && !quizSubmitted
                                    ? "selected"
                                    : ""
                                }`
                              }
                              onClick={() =>
                                selectQuizAnswer(
                                  questionIndex,
                                  option
                                )
                              }
                            >

                              {option}

                            </button>

                          );

                        }
                      )}

                    </div>

                  );

                }
              )}


              {quizSubmitted && (

                <div className="quiz-result">

                  <div className="quiz-result-score">

                    {
                      calculateQuizScore()
                    }

                    /

                    {
                      getResource(
                        quizSkill.name
                      ).quiz.length
                    }

                  </div>

                  <p>

                    {calculateQuizScore()
                      ===
                      getResource(
                        quizSkill.name
                      ).quiz.length

                      ? "Excellent. You can mark this skill as completed."

                      : "Review the notes and tutorial once more, then retake the assessment."
                    }

                  </p>

                </div>

              )}

            </div>


            <div className="modal-footer">

              <button
                className="secondary-button"
                onClick={closeQuiz}
              >

                <RotateCcw
                  size={13}
                  style={{
                    verticalAlign:
                      "middle",
                    marginRight: 5,
                  }}
                />

                Exit

              </button>


              {!quizSubmitted ? (

                <button
                  className="primary-button"
                  onClick={submitQuiz}
                >

                  Submit quiz

                  <Check
                    size={14}
                  />

                </button>

              ) : (

                <button
                  className="primary-button"
                  onClick={
                    completeFromQuiz
                  }
                >

                  {calculateQuizScore()
                    ===
                    getResource(
                      quizSkill.name
                    ).quiz.length
                    ? "Complete skill"
                    : "Close"}

                  <Check
                    size={14}
                  />

                </button>

              )}

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default Roadmap;