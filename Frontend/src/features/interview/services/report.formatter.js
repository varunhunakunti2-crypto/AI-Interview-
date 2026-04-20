export function buildInterviewReportText(report) {
  const technicalQuestions = (report.technicalQuestions || [])
    .map(
      (question, index) =>
        `${index + 1}. ${question.question}\nWhy: ${question.intention}\nSuggested answer: ${question.answer}`
    )
    .join("\n\n");

  const behavioralQuestions = (report.behavioralQuestions || [])
    .map(
      (question, index) =>
        `${index + 1}. ${question.question}\nWhy: ${question.intention}\nSuggested answer: ${question.answer}`
    )
    .join("\n\n");

  const preparationPlan = (report.preparationPlan || [])
    .map((day) => `Day ${day.day}: ${day.focus}\n- ${day.tasks.join("\n- ")}`)
    .join("\n\n");

  const skillGaps = (report.skillGaps || [])
    .map((skill) => `- ${skill.skill} (${skill.severity})`)
    .join("\n");

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
    .filter(Boolean)
    .join("\n");
}
