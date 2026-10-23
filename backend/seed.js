import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "./models/Course.js";

dotenv.config();

const courses = [
  {
    title: "HTML Fundamentals",
    description: "Master the building blocks of the web. Learn HTML structure, semantic elements, forms and accessibility best practices.",
    videoUrl: "https://www.youtube.com/embed/UB1O30fR-EE",
    modules: [
      { title: "What is HTML?", content: "HTML stands for HyperText Markup Language. It is the standard language for creating web pages. HTML describes the structure of a web page using elements represented by tags like <html>, <head>, <body>, <h1>, <p>, and more. Every website you visit is built on HTML as its foundation." },
      { title: "HTML Elements & Tags", content: "HTML elements are the building blocks of HTML pages. An HTML element is defined by a start tag, some content, and an end tag. For example: <h1>My Heading</h1> or <p>My paragraph.</p>. Some elements are self-closing like <br> and <img>. Elements can be nested inside each other to create complex structures." },
      { title: "Semantic HTML", content: "Semantic HTML uses meaningful tags that describe the purpose of the content. Instead of using <div> for everything, use <header>, <nav>, <main>, <article>, <section>, <footer>. This improves accessibility and SEO significantly. Screen readers rely on semantic HTML to understand page structure." },
      { title: "HTML Forms", content: "Forms collect user input. Key elements include <form>, <input>, <label>, <button>, <select>, and <textarea>. Always use <label> elements linked to inputs using the 'for' attribute for accessibility. The action attribute specifies where form data is sent, and method specifies GET or POST." },
      { title: "Accessibility in HTML", content: "Accessible HTML uses alt attributes on images, proper heading hierarchy (h1 → h2 → h3), ARIA labels for interactive elements, and keyboard-navigable links and buttons. Add tabindex='0' to make custom elements focusable. Use role attributes to convey meaning to assistive technologies." },
    ],
    quiz: [
      { question: "What does HTML stand for?", options: ["HyperText Markup Language","High Transfer Markup Language","HyperText Modern Language","None of the above"], correctIndex: 0 },
      { question: "Which tag defines the main content of a page?", options: ["<div>","<main>","<body>","<content>"], correctIndex: 1 },
      { question: "What is the correct HTML element for the largest heading?", options: ["<h6>","<heading>","<h1>","<head>"], correctIndex: 2 },
      { question: "Which attribute provides alternative text for an image?", options: ["title","src","href","alt"], correctIndex: 3 },
      { question: "Which HTML element is used to define a navigation section?", options: ["<menu>","<navigate>","<nav>","<links>"], correctIndex: 2 },
    ],
  },
  {
    title: "JavaScript Essentials",
    description: "Learn JavaScript from scratch. Variables, functions, DOM manipulation, events and modern ES6+ features.",
    videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
    modules: [
      { title: "Introduction to JavaScript", content: "JavaScript is the programming language of the web. It runs in the browser and makes web pages interactive. You can write JavaScript inside <script> tags or in external .js files. Modern JS uses const and let instead of var. JavaScript is also used server-side via Node.js." },
      { title: "Variables & Data Types", content: "Variables store data. Use const for values that don't change, let for values that do. JavaScript data types include: String, Number, Boolean, Array, Object, null, and undefined. Example: const name = 'Alice'; let age = 25; Arrays use bracket notation: const colors = ['red','green','blue']." },
      { title: "Functions & Scope", content: "Functions are reusable code blocks. Declare with function keyword or arrow syntax: const greet = (name) => `Hello ${name}`. Scope determines where variables are accessible. Block scope uses curly braces {}. Closures remember their outer scope even after the outer function returns." },
      { title: "DOM Manipulation", content: "The DOM (Document Object Model) is a JavaScript representation of your HTML. Use document.getElementById(), querySelector(), and querySelectorAll() to select elements. Change content with .innerHTML or .textContent. Change styles with .style. Add/remove classes with .classList.add() and .classList.remove()." },
      { title: "Events & Async", content: "Events respond to user actions. Add events with addEventListener: button.addEventListener('click', handler). Common events: click, input, submit, keydown. Async JS uses Promises and async/await to handle operations like fetching data. fetch('/api/data').then(r => r.json()).then(data => console.log(data))." },
    ],
    quiz: [
      { question: "Which keyword declares a constant in JavaScript?", options: ["var","let","const","static"], correctIndex: 2 },
      { question: "What does DOM stand for?", options: ["Document Object Model","Data Object Management","Document Oriented Mode","Dynamic Object Method"], correctIndex: 0 },
      { question: "Which method adds an event to an element?", options: ["attachEvent()","addEventListener()","onEvent()","bindEvent()"], correctIndex: 1 },
      { question: "What is the output of: typeof 42?", options: ["integer","float","number","digit"], correctIndex: 2 },
      { question: "Arrow functions use which syntax?", options: ["function() {}","fn() {}","() => {}","lambda() {}"], correctIndex: 2 },
    ],
  },
  {
    title: "Web Accessibility Fundamentals",
    description: "Build inclusive web experiences. Learn WCAG guidelines, ARIA, keyboard navigation and assistive technology support.",
    videoUrl: "https://www.youtube.com/embed/20SHvU2PKsM",
    modules: [
      { title: "What is Web Accessibility?", content: "Web accessibility means that websites and tools are designed so people with disabilities can use them. Disabilities include visual, auditory, motor, speech and cognitive impairments. The Web Content Accessibility Guidelines (WCAG) provide the international standard. About 1 billion people worldwide have some form of disability." },
      { title: "WCAG Guidelines", content: "WCAG 2.1 is organised around 4 principles (POUR): Perceivable (info must be presentable to all users), Operable (UI must be navigable), Understandable (content must be clear), Robust (compatible with assistive tech). Level AA is the standard target for most websites and is required by law in many countries." },
      { title: "ARIA Labels & Roles", content: "ARIA (Accessible Rich Internet Applications) attributes provide extra semantic meaning to screen readers. Key attributes: aria-label (provides a label), aria-labelledby (references another element), aria-describedby (longer description), role (defines purpose), aria-expanded (state of disclosure). Use native HTML first — ARIA is a last resort." },
      { title: "Keyboard Navigation", content: "All functionality must be operable via keyboard alone. Tab moves forward between interactive elements, Shift+Tab moves backward, Enter/Space activates buttons and links, Arrow keys navigate menus. Ensure all interactive elements have visible focus indicators using CSS outline. Never remove outline without providing an alternative." },
      { title: "Screen Readers & Testing", content: "Screen readers convert digital text to speech or braille. Popular ones: NVDA (free, Windows), JAWS (Windows), VoiceOver (Mac/iOS), TalkBack (Android). Test your site with a screen reader. Use browser extensions like axe DevTools or WAVE for automated audits. Manual testing is essential — automated tools catch only 30-40% of issues." },
    ],
    quiz: [
      { question: "What does WCAG stand for?", options: ["Web Content Accessibility Guidelines","Web Core Accessibility Group","Website Compatibility And Guidelines","Web Component Accessibility Guide"], correctIndex: 0 },
      { question: "Which ARIA attribute provides a label for screen readers?", options: ["aria-role","aria-label","aria-text","aria-name"], correctIndex: 1 },
      { question: "What is the minimum colour contrast ratio for WCAG AA normal text?", options: ["2:1","3:1","4.5:1","7:1"], correctIndex: 2 },
      { question: "Which key moves focus to the next interactive element?", options: ["Enter","Space","Tab","Escape"], correctIndex: 2 },
      { question: "NVDA is an example of:", options: ["A web browser","A screen reader","A colour contrast tool","A keyboard shortcut"], correctIndex: 1 },
    ],
  },
  {
    title: "CSS & Responsive Design",
    description: "Style beautiful, responsive websites. Master flexbox, grid, animations, and mobile-first design principles.",
    videoUrl: "https://www.youtube.com/embed/1Rs2ND1ryYc",
    modules: [
      { title: "CSS Basics & Selectors", content: "CSS (Cascading Style Sheets) controls the presentation of HTML. Selectors target elements: tag selectors (p), class selectors (.card), ID selectors (#hero), and attribute selectors ([type='text']). The cascade determines which styles apply when multiple rules match the same element — specificity and source order matter." },
      { title: "Box Model", content: "Every HTML element is a box with: content, padding (space inside the border), border, and margin (space outside the border). Use box-sizing: border-box to make sizing intuitive — width includes padding and border. Understand margin collapse: vertical margins of adjacent elements merge into the larger of the two values." },
      { title: "Flexbox Layout", content: "Flexbox makes one-dimensional layouts easy. Apply display: flex to a container. Use justify-content (main axis: flex-start, center, space-between) and align-items (cross axis: center, stretch). flex-grow controls how children expand to fill space. flex-wrap: wrap allows children to move to the next line." },
      { title: "CSS Grid", content: "CSS Grid is a two-dimensional layout system. Define columns: grid-template-columns: 1fr 2fr 1fr. Gaps: gap: 1rem. Place items: grid-column: 1 / 3 spans two columns. Use minmax(min, max) for responsive columns without media queries. grid-template-areas names regions for semantic placement." },
      { title: "Responsive & Animations", content: "Media queries adapt layouts: @media (max-width: 768px) { ... }. Mobile-first means writing base styles for mobile and adding larger-screen styles. CSS transitions: transition: all 0.3s ease. Keyframe animations: @keyframes bounce { 0% { transform: translateY(0); } 50% { transform: translateY(-20px); } }. Prefer transform and opacity for 60fps animations." },
    ],
    quiz: [
      { question: "What does CSS stand for?", options: ["Cascading Style Sheets","Computer Style System","Creative Style Syntax","Core Style Scripts"], correctIndex: 0 },
      { question: "Which CSS property controls spacing inside an element?", options: ["margin","border","padding","spacing"], correctIndex: 2 },
      { question: "Which display value enables flexbox?", options: ["display: block","display: flex","display: grid","display: inline"], correctIndex: 1 },
      { question: "What does 1fr mean in CSS Grid?", options: ["1 fixed rem","1 fractional unit","1 full row","None of these"], correctIndex: 1 },
      { question: "Which property is best for smooth 60fps animations?", options: ["width","margin","background-color","transform"], correctIndex: 3 },
    ],
  },
  {
    title: "React JS Fundamentals",
    description: "Build dynamic user interfaces with React. Learn components, hooks, state management, and modern React patterns.",
    videoUrl: "https://www.youtube.com/embed/Tn6-PIqc4UM",
    modules: [
      { title: "What is React?", content: "React is a JavaScript library for building user interfaces, developed by Meta. It uses a component-based architecture where UIs are made of reusable pieces. React uses a Virtual DOM to efficiently update only the parts of the real DOM that changed. JSX is a syntax extension that looks like HTML but compiles to JavaScript." },
      { title: "Components & Props", content: "Components are the building blocks of React apps. Function components are modern: function Card({ title, desc }) { return <div><h2>{title}</h2><p>{desc}</p></div>; }. Props pass data from parent to child — they are read-only. Children prop allows wrapping components: <Card><Button /></Card>." },
      { title: "State with useState", content: "State is data that changes over time, triggering re-renders. const [count, setCount] = useState(0). Never mutate state directly — always use the setter: setCount(count + 1) or the functional form setCount(prev => prev + 1). State is local to the component unless lifted up or stored in context." },
      { title: "Effects with useEffect", content: "useEffect runs side effects: data fetching, subscriptions, timers. useEffect(() => { fetchData(); }, [dependency]) — the array controls when it runs. Empty array [] means run once on mount. Return a cleanup function to avoid memory leaks: return () => clearInterval(timer). useEffect runs after the component renders." },
      { title: "React Router & Best Practices", content: "React Router handles navigation: <BrowserRouter>, <Routes>, <Route path='/about' element={<About />} />. Use <Link> instead of <a> for internal navigation to prevent page reloads. Custom hooks extract reusable logic: const useFetch = (url) => { ... }. Lift state up when multiple components need the same data." },
    ],
    quiz: [
      { question: "What is JSX?", options: ["A JavaScript testing framework","A syntax extension for writing HTML in JS","A CSS preprocessor","A database query language"], correctIndex: 1 },
      { question: "Which hook manages local component state?", options: ["useEffect","useContext","useState","useRef"], correctIndex: 2 },
      { question: "Props in React are:", options: ["Mutable state","Read-only data passed from parent","A type of CSS class","Lifecycle methods"], correctIndex: 1 },
      { question: "When does useEffect with an empty dependency array [] run?", options: ["Every render","Only when state changes","Once after mount","Only once before unmount"], correctIndex: 2 },
      { question: "Which component enables navigation in React Router?", options: ["<Navigate>","<Link>","<a>","<Route>"], correctIndex: 1 },
    ],
  },
  {
    title: "Python for Beginners",
    description: "Start programming with Python. Learn variables, data structures, functions, file I/O, and build your first real programs.",
    videoUrl: "https://www.youtube.com/embed/rfscVS0vtbw",
    modules: [
      { title: "Getting Started with Python", content: "Python is a high-level, readable programming language used for web development, data science, AI, automation, and more. Python files end in .py. Indentation is syntax — use 4 spaces. print('Hello, World!') is the first program. Python 3 is current. The REPL (interactive shell) lets you experiment instantly." },
      { title: "Variables & Data Types", content: "Python has dynamic typing — no type declarations needed. name = 'Alice'; age = 25; height = 1.75; is_student = True. Lists: fruits = ['apple','banana']. Dictionaries: person = {'name': 'Alice', 'age': 25}. Tuples: coords = (10, 20). type(value) returns the data type. Python is case-sensitive." },
      { title: "Control Flow", content: "if/elif/else for decisions: if age >= 18: print('Adult') elif age >= 13: print('Teen') else: print('Child'). for loops: for item in list. while loops: while count < 10. range(0, 10, 2) generates even numbers. Use break to exit loops and continue to skip iterations. List comprehensions: squares = [x**2 for x in range(10)]." },
      { title: "Functions & Modules", content: "def greet(name, greeting='Hello'): return f'{greeting}, {name}!'. Default parameters, *args for variable arguments, **kwargs for keyword arguments. Modules extend Python: import math; math.sqrt(16). Create your own: save functions in utils.py, then import utils. pip install packages: pip install requests." },
      { title: "File I/O & Error Handling", content: "Read files: with open('file.txt', 'r') as f: content = f.read(). Write: with open('output.txt', 'w') as f: f.write('data'). The 'with' statement auto-closes files. Handle errors: try: result = 10/0 except ZeroDivisionError as e: print(e) finally: print('always runs'). Raise custom exceptions for your own error types." },
    ],
    quiz: [
      { question: "What is Python primarily known for?", options: ["Only web development","Readability and versatility","Being the fastest language","Only data science"], correctIndex: 1 },
      { question: "How do you print text in Python 3?", options: ["print 'Hello'","echo 'Hello'","print('Hello')","console.log('Hello')"], correctIndex: 2 },
      { question: "Which symbol starts a comment in Python?", options: ["//","/*","#","--"], correctIndex: 2 },
      { question: "What does 'def' do in Python?", options: ["Defines a variable","Defines a function","Defines a class","Deletes a file"], correctIndex: 1 },
      { question: "What data structure uses key-value pairs in Python?", options: ["List","Tuple","Set","Dictionary"], correctIndex: 3 },
    ],
  },
  {
    title: "UX Design Principles",
    description: "Design user-centred digital experiences. Learn research methods, wireframing, prototyping, and accessibility-first design.",
    videoUrl: "https://www.youtube.com/embed/9BdtGjoIN4E",
    modules: [
      { title: "What is UX Design?", content: "UX (User Experience) Design is the process of creating products that provide meaningful and relevant experiences to users. It covers the entire journey: finding a product, using it, and integrating it into life. UX involves research, information architecture, interaction design, usability testing, and visual design. A UX designer advocates for the user." },
      { title: "User Research Methods", content: "Understand users before designing. Interviews reveal mental models and pain points. Surveys gather quantitative data from large groups. Usability testing observes real users completing tasks. Card sorting reveals how users categorise information. Personas are fictional user archetypes built from research. Jobs-to-be-done focuses on what users are trying to achieve." },
      { title: "Information Architecture", content: "IA organises content so users can find what they need. Sitemaps show the hierarchy of pages. Navigation patterns: flat (all pages one click from home), deep (hierarchical categories). Card sorting and tree testing validate your IA. Clear labelling reduces cognitive load. Breadcrumbs help users orient themselves in deep structures." },
      { title: "Wireframing & Prototyping", content: "Wireframes are low-fidelity sketches of layouts — no colour, no real content. They focus on structure and flow. High-fidelity prototypes include visual design and interactions. Tools: Figma, Adobe XD, Sketch. Prototype early and test often — iterate based on feedback. A clickable prototype saves developer time by validating flows before build." },
      { title: "Accessibility & Inclusive Design", content: "Inclusive design benefits everyone. Use sufficient colour contrast (4.5:1 ratio for AA). Don't rely on colour alone to convey meaning. Provide text alternatives for images. Ensure touch targets are at least 44x44px. Support keyboard navigation and screen readers. Test with real users who have disabilities. Accessibility is not a feature — it's a requirement." },
    ],
    quiz: [
      { question: "What does UX stand for?", options: ["User Excellence","User Experience","Unified eXecution","User Exchange"], correctIndex: 1 },
      { question: "Which method directly observes users completing tasks?", options: ["Survey","Interview","Usability testing","Card sorting"], correctIndex: 2 },
      { question: "What are wireframes?", options: ["High-fidelity designs","Low-fidelity layout sketches","Database schemas","Code blueprints"], correctIndex: 1 },
      { question: "What is the minimum touch target size for accessibility?", options: ["20x20px","32x32px","44x44px","60x60px"], correctIndex: 2 },
      { question: "Inclusive design primarily benefits:", options: ["Only people with disabilities","Only mobile users","Everyone","Only elderly users"], correctIndex: 2 },
    ],
  },
  {
    title: "Sign Language 101",
    description: "Learn Indian Sign Language (ISL) basics. Alphabets, numbers, common phrases, and how to communicate effectively with the Deaf community.",
    videoUrl: "https://www.youtube.com/embed/v1desDduz5M",
    modules: [
      { title: "Introduction to ISL", content: "Indian Sign Language (ISL) is a complete, natural language used by the Deaf community in India. ISL has its own grammar, which differs from spoken Hindi or English — it is not a signed version of spoken language. ISL uses handshapes, palm orientation, movement, and facial expressions. There are approximately 5 million ISL users in India." },
      { title: "Fingerspelling Alphabet", content: "The ISL manual alphabet allows you to spell out words letter by letter using your dominant hand. Each letter has a specific handshape: A is a closed fist with thumb at the side, B is an open flat hand, C is a curved open hand. Practise in front of a mirror. Fingerspelling is used for names, technical terms, and words without a standard sign." },
      { title: "Numbers 0-20", content: "Numbers 1-5 extend fingers from a closed fist on one hand. 6-10 use both hands or specific handshapes. 11-15 combine the handshape for 10 with the corresponding single digits. Numbers are important for times, dates, addresses, and quantities. Practise counting up and down fluidly before moving to higher numbers." },
      { title: "Common Everyday Signs", content: "Core vocabulary: Hello (wave hand), Thank You (flat hand from chin forward), Please (rub chest in circle), Sorry (fist circles on chest), Yes (nod fist), No (index and middle finger wave), Help (fist on palm, lift up), Water (W handshape taps chin), Food (pinched fingers tap mouth), Home (pinched fingers touch cheek then chin)." },
      { title: "Conversational Phrases", content: "Build basic conversations: My name is... (point to self + fingerspell name). Nice to meet you (two index fingers meet and rotate). How are you? (flat hand sweeps from body outward with questioning expression). I don't understand (shake head + puzzled expression). Please repeat (roll hands and circle back). Facial expressions carry grammatical meaning in ISL — they are not optional." },
    ],
    quiz: [
      { question: "ISL stands for:", options: ["International Sign Language","Indian Sign Language","Inclusive Speech Language","Integrated Sign Lexicon"], correctIndex: 1 },
      { question: "Which of these carries grammatical meaning in ISL?", options: ["Hat colour","Shoe type","Facial expressions","Handedness"], correctIndex: 2 },
      { question: "Fingerspelling is used for:", options: ["All signs","Numbers only","Names and technical terms","Common greetings"], correctIndex: 2 },
      { question: "How do you sign 'Thank You' in ISL?", options: ["Wave hand","Point up","Flat hand from chin forward","Fist on chest"], correctIndex: 2 },
      { question: "Approximately how many people use ISL in India?", options: ["500,000","2 million","5 million","10 million"], correctIndex: 2 },
    ],
  },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Course.deleteMany({});
  await Course.insertMany(courses);
  console.log("✅ 8 full courses seeded: HTML, JS, Accessibility, CSS, React, Python, UX Design, Sign Language 101");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});