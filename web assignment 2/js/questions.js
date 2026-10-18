/**
 * QuizMaster Pro - Question Bank
 * Comprehensive question bank covering HTML5, CSS3, JavaScript ES6+, Bootstrap 5, and Core Web Technologies.
 * Minimum requirement: 30 questions. Included: 40 curated questions.
 */

const QUESTION_BANK = [
  // --- HTML5 (8 Questions) ---
  {
    id: "html-001",
    category: "HTML5",
    difficulty: "Easy",
    question: "Which HTML5 semantic element is most appropriate for enclosing the primary, standalone content of a blog post or news story?",
    options: [
      { id: "a", text: "<article>" },
      { id: "b", text: "<section>" },
      { id: "c", text: "<main>" },
      { id: "d", text: "<aside>" }
    ],
    correctOptionId: "a",
    explanation: "The <article> tag is intended for self-contained, independently distributable compositions such as blog posts, news stories, or forum threads."
  },
  {
    id: "html-002",
    category: "HTML5",
    difficulty: "Easy",
    question: "What is the primary purpose of the 'alt' attribute on an <img> element?",
    options: [
      { id: "a", text: "It defines a mouseover hover tooltip for the image" },
      { id: "b", text: "It provides alternative text for screen readers and when the image fails to load" },
      { id: "c", text: "It specifies an alternative URL if the main source is unavailable" },
      { id: "d", text: "It sets the CSS layout alignment of the graphic" }
    ],
    correctOptionId: "b",
    explanation: "The 'alt' attribute provides critical text alternatives for assistive technologies like screen readers and displays when the image cannot be rendered."
  },
  {
    id: "html-003",
    category: "HTML5",
    difficulty: "Medium",
    question: "Which HTML5 input type provides built-in browser validation specifically formatted for email addresses on mobile and desktop?",
    options: [
      { id: "a", text: "<input type='text' pattern='email'>" },
      { id: "b", text: "<input type='email'>" },
      { id: "c", text: "<input type='mail'>" },
      { id: "d", text: "<input type='address'>" }
    ],
    correctOptionId: "b",
    explanation: "<input type='email'> activates native browser validation and displays an optimized keyboard with '@' and domain extensions on mobile devices."
  },
  {
    id: "html-004",
    category: "HTML5",
    difficulty: "Medium",
    question: "What does the 'defer' attribute in a <script> tag do compared to 'async'?",
    options: [
      { id: "a", text: "It executes the script immediately and blocks HTML parsing" },
      { id: "b", text: "It downloads the script in parallel and executes it only after the HTML document is fully parsed" },
      { id: "c", text: "It executes the script as soon as it arrives, pausing DOM building" },
      { id: "d", text: "It delays script execution until the user interacts with the page" }
    ],
    correctOptionId: "b",
    explanation: "Scripts with 'defer' download in parallel without blocking HTML parsing and execute in order after the DOM is fully constructed, right before DOMContentLoaded."
  },
  {
    id: "html-005",
    category: "HTML5",
    difficulty: "Easy",
    question: "Which DOCTYPE declaration is correct for modern HTML5 documents?",
    options: [
      { id: "a", text: "<!DOCTYPE html>" },
      { id: "b", text: "<!DOCTYPE HTML5 PUBLIC '-//W3C//DTD HTML5.0//EN'>" },
      { id: "c", text: "<!DOCTYPE html PUBLIC 'strict'>" },
      { id: "d", text: "<?xml version='1.0' encoding='UTF-8'?>" }
    ],
    correctOptionId: "a",
    explanation: "HTML5 simplified the doctype to just '<!DOCTYPE html>', which is case-insensitive and triggers standards mode across all modern rendering engines."
  },
  {
    id: "html-006",
    category: "HTML5",
    difficulty: "Hard",
    question: "Which ARIA attribute indicates that an element's content will update dynamically and should be announced by screen readers without interrupting current speech?",
    options: [
      { id: "a", text: "aria-live='assertive'" },
      { id: "b", text: "aria-live='polite'" },
      { id: "c", text: "aria-dynamic='true'" },
      { id: "d", text: "aria-atomic='false'" }
    ],
    correctOptionId: "b",
    explanation: "aria-live='polite' tells assistive technologies to queue the notification until the user has paused speaking or typing, ensuring non-disruptive announcements."
  },
  {
    id: "html-007",
    category: "HTML5",
    difficulty: "Medium",
    question: "What is the semantic purpose of the HTML5 <figure> and <figcaption> elements?",
    options: [
      { id: "a", text: "To create mathematical formulas and vector equations" },
      { id: "b", text: "To encapsulate self-contained visual or code content along with its caption" },
      { id: "c", text: "To embed animated canvas graphics with interactive controls" },
      { id: "d", text: "To style floating sidebars and advertisements" }
    ],
    correctOptionId: "b",
    explanation: "<figure> groups self-contained media (images, diagrams, code listings), while <figcaption> provides its accessible caption."
  },
  {
    id: "html-008",
    category: "HTML5",
    difficulty: "Medium",
    question: "Which meta tag is essential for responsive web design to ensure proper rendering across mobile viewports?",
    options: [
      { id: "a", text: "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" },
      { id: "b", text: "<meta http-equiv='X-UA-Compatible' content='IE=edge'>" },
      { id: "c", text: "<meta name='responsive' content='true'>" },
      { id: "d", text: "<meta name='screen-resolution' content='auto'>" }
    ],
    correctOptionId: "a",
    explanation: "The viewport meta tag instructs the browser to set page width to the physical device width and establishes a 1:1 initial zoom scale."
  },

  // --- CSS3 (8 Questions) ---
  {
    id: "css-001",
    category: "CSS3",
    difficulty: "Easy",
    question: "In the CSS Box Model, which property sets the spacing between the element's border and its inner content?",
    options: [
      { id: "a", text: "margin" },
      { id: "b", text: "padding" },
      { id: "c", text: "outline" },
      { id: "d", text: "gap" }
    ],
    correctOptionId: "b",
    explanation: "Padding is the space inside the border surrounding the content, whereas margin is the transparent space outside the border."
  },
  {
    id: "css-002",
    category: "CSS3",
    difficulty: "Medium",
    question: "What does the declaration 'box-sizing: border-box;' do?",
    options: [
      { id: "a", text: "It adds an outer drop shadow equal to the element's border width" },
      { id: "b", text: "It includes padding and border within the specified width and height of the element" },
      { id: "c", text: "It forces the element to adopt a flexbox container layout" },
      { id: "d", text: "It prevents borders from collapsing in HTML tables" }
    ],
    correctOptionId: "b",
    explanation: "With 'box-sizing: border-box;', any padding or border is included in the element's declared width and height, preventing layout overflow calculations."
  },
  {
    id: "css-003",
    category: "CSS3",
    difficulty: "Medium",
    question: "In CSS Flexbox, which property aligns flex items along the cross axis (perpendicular to the main axis)?",
    options: [
      { id: "a", text: "justify-content" },
      { id: "b", text: "align-items" },
      { id: "c", text: "flex-direction" },
      { id: "d", text: "align-content" }
    ],
    correctOptionId: "b",
    explanation: "'align-items' governs alignment along the cross axis (vertically in row direction), while 'justify-content' aligns items along the main axis."
  },
  {
    id: "css-004",
    category: "CSS3",
    difficulty: "Medium",
    question: "How do you declare and reference a native CSS Custom Property (CSS Variable)?",
    options: [
      { id: "a", text: "Declare with '$primary: #6366F1;' and reference with '$primary'" },
      { id: "b", text: "Declare with '--primary: #6366F1;' and reference with 'var(--primary)'" },
      { id: "c", text: "Declare with '@primary: #6366F1;' and reference with 'prop(primary)'" },
      { id: "d", text: "Declare with '%primary: #6366F1;' and reference with 'get(--primary)'" }
    ],
    correctOptionId: "b",
    explanation: "Standard CSS variables must start with two dashes ('--name') and are evaluated using the 'var(--name)' CSS function."
  },
  {
    id: "css-005",
    category: "CSS3",
    difficulty: "Hard",
    question: "Which CSS specificity score is the highest among the following selectors?",
    options: [
      { id: "a", text: "div.header nav a:hover (0, 0, 2, 3)" },
      { id: "b", text: "#main-nav a (0, 1, 0, 1)" },
      { id: "c", text: ".card .card-body .btn.btn-primary (0, 0, 4, 1)" },
      { id: "d", text: "header > nav ul li a (0, 0, 0, 5)" }
    ],
    correctOptionId: "b",
    explanation: "An ID selector carries a specificity weight of (0, 1, 0, 0), which immediately outweighs any number of class selectors (0, 0, X, 0) or element tags."
  },
  {
    id: "css-006",
    category: "CSS3",
    difficulty: "Medium",
    question: "Which CSS Grid property creates responsive columns that wrap automatically without requiring explicit media queries?",
    options: [
      { id: "a", text: "grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));" },
      { id: "b", text: "grid-auto-flow: column wrap;" },
      { id: "c", text: "grid-columns: flex 280px;" },
      { id: "d", text: "grid-template-columns: auto-columns(280px, 1fr);" }
    ],
    correctOptionId: "a",
    explanation: "'repeat(auto-fit, minmax(280px, 1fr))' dynamically calculates column counts and wraps elements gracefully as the viewport changes."
  },
  {
    id: "css-007",
    category: "CSS3",
    difficulty: "Easy",
    question: "Which CSS position value removes an element from normal document flow and positions it relative to its closest positioned ancestor?",
    options: [
      { id: "a", text: "position: relative;" },
      { id: "b", text: "position: absolute;" },
      { id: "c", text: "position: fixed;" },
      { id: "d", text: "position: static;" }
    ],
    correctOptionId: "b",
    explanation: "'position: absolute;' removes the element from flow and offsets it relative to the nearest ancestor with a position other than 'static'."
  },
  {
    id: "css-008",
    category: "CSS3",
    difficulty: "Medium",
    question: "Which media feature query is recommended to honor user accessibility preferences regarding motion sickness or vestibular disorders?",
    options: [
      { id: "a", text: "@media (prefers-reduced-motion: reduce)" },
      { id: "b", text: "@media (animation-preference: none)" },
      { id: "c", text: "@media (motion-comfort: safe)" },
      { id: "d", text: "@media (prefers-static-display: true)" }
    ],
    correctOptionId: "a",
    explanation: "The 'prefers-reduced-motion: reduce' media query detects if the user requested the operating system to minimize non-essential animations."
  },

  // --- JavaScript ES6+ (10 Questions) ---
  {
    id: "js-001",
    category: "JavaScript",
    difficulty: "Easy",
    question: "Which DOM method retrieves the first element within the document that matches a specified CSS selector?",
    options: [
      { id: "a", text: "document.querySelector()" },
      { id: "b", text: "document.getElementById()" },
      { id: "c", text: "document.getElementsByTagName()" },
      { id: "d", text: "document.findSelector()" }
    ],
    correctOptionId: "a",
    explanation: "document.querySelector() returns the first Element within the document that matches the specified CSS selector string or null if none match."
  },
  {
    id: "js-002",
    category: "JavaScript",
    difficulty: "Easy",
    question: "What is the key difference between 'let' and 'const' declarations in JavaScript?",
    options: [
      { id: "a", text: "'const' has function scope while 'let' has block scope" },
      { id: "b", text: "'const' cannot be reassigned after declaration, whereas 'let' can be reassigned" },
      { id: "c", text: "'let' variables are hoisted and initialized to undefined, while 'const' variables are not hoisted at all" },
      { id: "d", text: "'const' guarantees that objects cannot have their internal properties mutated" }
    ],
    correctOptionId: "b",
    explanation: "'const' creates an immutable variable binding (cannot be reassigned), though properties of objects/arrays declared with const can still be modified."
  },
  {
    id: "js-003",
    category: "JavaScript",
    difficulty: "Medium",
    question: "Which array method creates a new array populated with the results of calling a provided function on every element in the calling array?",
    options: [
      { id: "a", text: "Array.prototype.forEach()" },
      { id: "b", text: "Array.prototype.filter()" },
      { id: "c", text: "Array.prototype.map()" },
      { id: "d", text: "Array.prototype.reduce()" }
    ],
    correctOptionId: "c",
    explanation: ".map() creates a brand new array with transformed elements without mutating the original source array."
  },
  {
    id: "js-004",
    category: "JavaScript",
    difficulty: "Medium",
    question: "What will 'console.log(typeof NaN)' output in JavaScript?",
    options: [
      { id: "a", text: "'undefined'" },
      { id: "b", text: "'number'" },
      { id: "c", text: "'nan'" },
      { id: "d", text: "'object'" }
    ],
    correctOptionId: "b",
    explanation: "In JavaScript, NaN ('Not-a-Number') is a numeric data value defined by the IEEE 754 floating-point specification; thus typeof NaN evaluates to 'number'."
  },
  {
    id: "js-005",
    category: "JavaScript",
    difficulty: "Hard",
    question: "In the JavaScript event loop, in what order are callbacks from microtasks (e.g., Promises) and macrotasks (e.g., setTimeout) executed after the current synchronous script completes?",
    options: [
      { id: "a", text: "All microtasks run before the next macrotask in the task queue" },
      { id: "b", text: "One macrotask runs, followed by all timers, then microtasks" },
      { id: "c", text: "They run in strictly alternating order one by one" },
      { id: "d", text: "Macrotasks take precedence over Promise resolution callbacks" }
    ],
    correctOptionId: "a",
    explanation: "The microtask queue (Promise callbacks, queueMicrotask) is drained completely before the event loop picks up the next macrotask (setTimeout, setInterval, I/O)."
  },
  {
    id: "js-006",
    category: "JavaScript",
    difficulty: "Medium",
    question: "What mechanism is best used to handle clicks on dynamically generated list items by attaching a single listener to their parent container?",
    options: [
      { id: "a", text: "Event Throttling" },
      { id: "b", text: "Event Delegation" },
      { id: "c", text: "Event Debouncing" },
      { id: "d", text: "Event Mutating" }
    ],
    correctOptionId: "b",
    explanation: "Event delegation leverages event bubbling by listening on a parent element and inspecting 'event.target' to handle interactions on child elements."
  },
  {
    id: "js-007",
    category: "JavaScript",
    difficulty: "Medium",
    question: "Which modern storage mechanism allows storing key-value pairs synchronously in the browser with no expiration until explicitly cleared?",
    options: [
      { id: "a", text: "sessionStorage" },
      { id: "b", text: "localStorage" },
      { id: "c", text: "Cookies" },
      { id: "d", text: "IndexedDB" }
    ],
    correctOptionId: "b",
    explanation: "localStorage stores string data across browser sessions and tab closures until programmatically deleted or user storage is cleared."
  },
  {
    id: "js-008",
    category: "JavaScript",
    difficulty: "Easy",
    question: "What does the strict equality operator (===) check in JavaScript?",
    options: [
      { id: "a", text: "Value only, performing type coercion if necessary" },
      { id: "b", text: "Both value and data type without type conversion" },
      { id: "c", text: "Reference memory address exclusively" },
      { id: "d", text: "Object prototype equality" }
    ],
    correctOptionId: "b",
    explanation: "The strict equality operator (===) checks that both the values and their underlying types are identical without performing implicit type coercion."
  },
  {
    id: "js-009",
    category: "JavaScript",
    difficulty: "Medium",
    question: "Which ES6 syntax allows an array or object to be expanded into individual elements or arguments?",
    options: [
      { id: "a", text: "The Rest Operator (...)" },
      { id: "b", text: "The Spread Operator (...)" },
      { id: "c", text: "The Destructuring Assignment" },
      { id: "d", text: "The Optional Chaining Operator (?.)" }
    ],
    correctOptionId: "b",
    explanation: "The spread operator (...) unpacks iterable items like array elements into function arguments or array/object literals."
  },
  {
    id: "js-010",
    category: "JavaScript",
    difficulty: "Hard",
    question: "What will 'JSON.parse(JSON.stringify(obj))' fail to clone properly?",
    options: [
      { id: "a", text: "Nested arrays and plain strings" },
      { id: "b", text: "Functions, undefined values, Symbols, and circular references" },
      { id: "c", text: "Boolean values and null" },
      { id: "d", text: "Integers and floating point numbers" }
    ],
    correctOptionId: "b",
    explanation: "JSON serialization omits functions, undefined, and symbols, converts Dates to strings, and throws errors on circular object references."
  },

  // --- Bootstrap 5 (8 Questions) ---
  {
    id: "bs-001",
    category: "Bootstrap",
    difficulty: "Easy",
    question: "In Bootstrap 5's responsive grid system, how many total columns make up a standard grid row?",
    options: [
      { id: "a", text: "10 columns" },
      { id: "b", text: "12 columns" },
      { id: "c", text: "16 columns" },
      { id: "d", text: "8 columns" }
    ],
    correctOptionId: "b",
    explanation: "Bootstrap's layout grid is built on a 12-column system, allowing flexible proportions such as halves (col-6), thirds (col-4), or quarters (col-3)."
  },
  {
    id: "bs-002",
    category: "Bootstrap",
    difficulty: "Medium",
    question: "What is the difference between '.container' and '.container-fluid' in Bootstrap 5?",
    options: [
      { id: "a", text: "'.container' is 100% wide at all times; '.container-fluid' has responsive breakpoints" },
      { id: "b", text: "'.container' sets a max-width at each responsive breakpoint; '.container-fluid' is always 100% wide across all viewports" },
      { id: "c", text: "'.container-fluid' applies a liquid animated background transition" },
      { id: "d", text: "'.container' is only used for flexbox rows; '.container-fluid' is for CSS Grid" }
    ],
    correctOptionId: "b",
    explanation: "'.container' provides fixed max-widths at specified breakpoint tiers (sm, md, lg, xl, xxl), while '.container-fluid' spans 100% of the viewport width continuously."
  },
  {
    id: "bs-003",
    category: "Bootstrap",
    difficulty: "Easy",
    question: "Which Bootstrap 5 utility class is used to center an element horizontally using automatic margins in a block context?",
    options: [
      { id: "a", text: "align-center" },
      { id: "b", text: "mx-auto" },
      { id: "c", text: "justify-center" },
      { id: "d", text: "text-center" }
    ],
    correctOptionId: "b",
    explanation: "'mx-auto' sets margin-left: auto and margin-right: auto, centering elements that have a defined width."
  },
  {
    id: "bs-004",
    category: "Bootstrap",
    difficulty: "Medium",
    question: "Which breakpoint in Bootstrap 5 corresponds to tablets and medium screens starting at 768px?",
    options: [
      { id: "a", text: "sm" },
      { id: "b", text: "md" },
      { id: "c", text: "lg" },
      { id: "d", text: "xl" }
    ],
    correctOptionId: "b",
    explanation: "Bootstrap 5 breakpoints are: sm (≥576px), md (≥768px), lg (≥992px), xl (≥1200px), and xxl (≥1400px)."
  },
  {
    id: "bs-005",
    category: "Bootstrap",
    difficulty: "Easy",
    question: "What major dependency was completely eliminated in Bootstrap 5 compared to Bootstrap 4?",
    options: [
      { id: "a", text: "Popper.js" },
      { id: "b", text: "jQuery" },
      { id: "c", text: "CSS Flexbox" },
      { id: "d", text: "HTML5 Canvas" }
    ],
    correctOptionId: "b",
    explanation: "Bootstrap 5 removed jQuery entirely in favor of pure vanilla JavaScript, resulting in lighter page weight and faster execution."
  },
  {
    id: "bs-006",
    category: "Bootstrap",
    difficulty: "Medium",
    question: "Which class combination creates a full-width, visually prominent button with rounded pill edges in Bootstrap 5?",
    options: [
      { id: "a", text: "btn btn-primary rounded-pill w-100" },
      { id: "b", text: "button button-primary pill full-width" },
      { id: "c", text: "btn btn-fill pill-shape display-block" },
      { id: "d", text: "btn btn-pill-primary col-12" }
    ],
    correctOptionId: "a",
    explanation: "'btn btn-primary' applies the primary button style, 'rounded-pill' gives capsule rounded corners, and 'w-100' sets width to 100%."
  },
  {
    id: "bs-007",
    category: "Bootstrap",
    difficulty: "Medium",
    question: "Which Bootstrap 5 utility sets an element's display to flex with items centered along both the main and cross axes?",
    options: [
      { id: "a", text: "d-flex justify-content-center align-items-center" },
      { id: "b", text: "flex-box center-all" },
      { id: "c", text: "d-center flex-align" },
      { id: "d", text: "display-flex items-center" }
    ],
    correctOptionId: "a",
    explanation: "Bootstrap utilities 'd-flex' (display: flex), 'justify-content-center' (main axis), and 'align-items-center' (cross axis) center children perfectly."
  },
  {
    id: "bs-008",
    category: "Bootstrap",
    difficulty: "Hard",
    question: "How does Bootstrap 5 natively support dark mode across components in v5.3+?",
    options: [
      { id: "a", text: "Through the 'data-bs-theme=\"dark\"' attribute on the <html> or parent container" },
      { id: "b", text: "By importing a separate 'bootstrap-dark.css' stylesheet" },
      { id: "c", text: "By adding class 'dark-bootstrap' to the <body>" },
      { id: "d", text: "Via a JavaScript plugin 'bootstrap.enableDarkMode()'" }
    ],
    correctOptionId: "a",
    explanation: "Bootstrap 5.3+ utilizes the HTML attribute 'data-bs-theme=\"dark\"' (or \"light\") to switch CSS variables globally across all components."
  },

  // --- Web Development & Architecture (6 Questions) ---
  {
    id: "web-001",
    category: "Web Development",
    difficulty: "Easy",
    question: "Which HTTP request method is idempotent and designed specifically to request data from a specified resource without altering server state?",
    options: [
      { id: "a", text: "POST" },
      { id: "b", text: "GET" },
      { id: "c", text: "PATCH" },
      { id: "d", text: "CONNECT" }
    ],
    correctOptionId: "b",
    explanation: "GET requests retrieve data without modifying server state and are idempotent—making identical requests returns the same result safely."
  },
  {
    id: "web-002",
    category: "Web Development",
    difficulty: "Medium",
    question: "What is the primary role of the Document Object Model (DOM) in web browsers?",
    options: [
      { id: "a", text: "To compile JavaScript source code into machine bytecode" },
      { id: "b", text: "To represent the HTML document as a structured, object-oriented tree of nodes that scripts can manipulate" },
      { id: "c", text: "To encrypt network communications via HTTPS" },
      { id: "d", text: "To cache web server database tables locally" }
    ],
    correctOptionId: "b",
    explanation: "The DOM is an API that presents an HTML or XML document as a tree structure where each node represents an element, attribute, or piece of text."
  },
  {
    id: "web-003",
    category: "Web Development",
    difficulty: "Medium",
    question: "What does CORS (Cross-Origin Resource Sharing) protect against?",
    options: [
      { id: "a", text: "Malicious scripts from one origin reading restricted resources from another unauthorized domain via the browser" },
      { id: "b", text: "SQL injection attacks executed directly inside web workers" },
      { id: "c", text: "Buffer overflows within CSS animation rendering pipelines" },
      { id: "d", text: "Slow page load times on low-bandwidth mobile connections" }
    ],
    correctOptionId: "a",
    explanation: "CORS is a browser security mechanism that uses HTTP headers to tell browsers whether a web application running at one origin can access resources from another origin."
  },
  {
    id: "web-004",
    category: "Web Development",
    difficulty: "Hard",
    question: "Which Web API is commonly used in client-side applications to generate downloadable binary PDF documents or canvas graphics?",
    options: [
      { id: "a", text: "Blob API and URL.createObjectURL()" },
      { id: "b", text: "WebRTC DataChannel" },
      { id: "c", text: "WebSocket BinaryStream" },
      { id: "d", text: "Navigator.sendBeacon()" }
    ],
    correctOptionId: "a",
    explanation: "A Blob represents raw immutable binary data, and URL.createObjectURL(blob) produces a unique DOMString URL that triggers client-side file downloads."
  },
  {
    id: "web-005",
    category: "Web Development",
    difficulty: "Easy",
    question: "What status code does an HTTP server return to indicate that the requested resource was not found?",
    options: [
      { id: "a", text: "200 OK" },
      { id: "b", text: "301 Moved Permanently" },
      { id: "c", text: "404 Not Found" },
      { id: "d", text: "500 Internal Server Error" }
    ],
    correctOptionId: "c",
    explanation: "HTTP 404 Not Found indicates that the server cannot find the requested resource path."
  },
  {
    id: "web-006",
    category: "Web Development",
    difficulty: "Medium",
    question: "In client-side single-page applications (SPAs), why should form submission buttons specify type='button' when handled via JavaScript rather than defaulting to type='submit'?",
    options: [
      { id: "a", text: "type='submit' is deprecated in HTML5" },
      { id: "b", text: "Default submit buttons trigger a full-page reload unless event.preventDefault() is explicitly invoked" },
      { id: "c", text: "type='button' automatically triggers CSS transitions" },
      { id: "d", text: "Browsers ignore click events on type='submit' elements" }
    ],
    correctOptionId: "b",
    explanation: "In an HTML form, buttons default to type='submit', which attempts a standard HTTP GET/POST and reloads the page unless preventDefault() is called; type='button' prevents this."
  }
];

// Helper to get questions filtered or sampled
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QUESTION_BANK };
}
