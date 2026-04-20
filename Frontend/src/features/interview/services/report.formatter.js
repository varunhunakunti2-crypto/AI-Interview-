// buildInterviewReportText function — interview report ko readable text format mein convert karta hai
// Ye text copy ya export karne ke liye use hota hai
export function buildInterviewReportText(report) {
  // Technical questions ko numbered text format mein convert kar rahe hain
  const technicalQuestions = (report.technicalQuestions || [])
    .map(
      (question, index) =>
        `${index + 1}. ${question.question}\nWhy: ${question.intention}\nSuggested answer: ${question.answer}`
    )
    .join("\n\n");

  // Behavioral questions ko numbered text format mein convert kar rahe hain
  const behavioralQuestions = (report.behavioralQuestions || [])
    .map(
      (question, index) =>
        `${index + 1}. ${question.question}\nWhy: ${question.intention}\nSuggested answer: ${question.answer}`
    )
    .join("\n\n");

  // Preparation plan ko day-wise text format mein convert kar rahe hain
  const preparationPlan = (report.preparationPlan || [])
    .map((day) => `Day ${day.day}: ${day.focus}\n- ${day.tasks.join("\n- ")}`)
    .join("\n\n");

  // Skill gaps ko list format mein convert kar rahe hain
  const skillGaps = (report.skillGaps || [])
    .map((skill) => `- ${skill.skill} (${skill.severity})`)
    .join("\n");

  // Saari sections ko ek string mein join karke return kar rahe hain
  return [
    report.title || "Interview Preparation Report",
    `Match score: ${report.matchScore ?? "N/A"}%`,
    report.createdAt ? `Created at: ${new Date(report.createdAt).toLocaleString()}` : "",
    "",
    "Technical Questions",
    technicalQuestions || "No technical questions available.",
    "",
    "Behavioral Questions",
    behavioralQuestions || "No behavioral questions available.",
    "",
    "Skill Gaps",
    skillGaps || "No skill gaps available.",
    "",
    "Preparation Plan",
    preparationPlan || "No preparation plan available.",
  ]
    // Empty strings filter out karte hain
    .filter(Boolean)
    .join("\n");
}
