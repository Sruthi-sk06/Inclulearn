// Mock NLP quiz generator — generates questions from text content
// In production this would call an AI API

const questionTemplates = [
  (topic, answer) => ({
    question: `What is the primary purpose of ${topic}?`,
    options: [answer, `To replace ${topic}`, `To delete ${topic}`, `None of the above`],
    correctIndex: 0,
  }),
  (topic, answer) => ({
    question: `Which of the following best describes ${topic}?`,
    options: [`An unrelated concept`, answer, `A deprecated feature`, `A browser extension`],
    correctIndex: 1,
  }),
  (topic, answer) => ({
    question: `${topic} is mainly used for:`,
    options: [`Styling only`, `Database queries`, answer, `Server configuration`],
    correctIndex: 2,
  }),
  (topic, answer) => ({
    question: `Which statement about ${topic} is correct?`,
    options: [`It is obsolete`, `It requires paid software`, `It only works on mobile`, answer],
    correctIndex: 3,
  }),
];

const courseQuizData = {
  html: [
    { topic: "HTML", answer: "Structuring web content with tags and elements" },
    { topic: "HTML tags", answer: "Defining the structure and meaning of web content" },
    { topic: "the <head> element", answer: "Containing metadata about the document" },
    { topic: "semantic HTML", answer: "Using meaningful tags like <article>, <nav>, <main>" },
    { topic: "HTML forms", answer: "Collecting user input on web pages" },
  ],
  javascript: [
    { topic: "JavaScript", answer: "Adding interactivity and dynamic behaviour to web pages" },
    { topic: "variables in JS", answer: "Storing and managing data values" },
    { topic: "functions", answer: "Reusable blocks of code that perform specific tasks" },
    { topic: "the DOM", answer: "Representing HTML as objects JavaScript can manipulate" },
    { topic: "event listeners", answer: "Responding to user interactions like clicks and keypresses" },
  ],
  accessibility: [
    { topic: "web accessibility", answer: "Ensuring websites are usable by people with disabilities" },
    { topic: "ARIA labels", answer: "Providing extra context to screen readers" },
    { topic: "keyboard navigation", answer: "Allowing all interactions without a mouse" },
    { topic: "colour contrast", answer: "Making text readable against its background" },
    { topic: "screen readers", answer: "Converting digital text to speech or braille" },
  ],
};

export function generateQuizFromCourse(courseKey) {
  const data = courseQuizData[courseKey] || courseQuizData.accessibility;
  return data.map(({ topic, answer }, i) => {
    const template = questionTemplates[i % questionTemplates.length];
    return template(topic, answer);
  });
}

export function generateQuizFromText(text) {
  // Extract key sentences and generate questions
  const sentences = text.split(".").filter((s) => s.trim().length > 30).slice(0, 5);
  return sentences.map((sentence, i) => {
    const words = sentence.trim().split(" ");
    const keyWord = words.slice(2, 5).join(" ");
    return {
      question: `According to the content, which of the following is true about "${keyWord}"?`,
      options: [
        "It is not mentioned in the course",
        sentence.trim().slice(0, 60) + "...",
        "It is a deprecated concept",
        "It only applies to advanced users",
      ],
      correctIndex: 1,
    };
  });
}