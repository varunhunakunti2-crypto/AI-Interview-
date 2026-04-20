// MongoDB ke saath kaam karne ke liye mongoose import kar rahe hain
const mongoose = require('mongoose');

/**
 * -job description schema : String
 * -resume text : String
 * -self description : String
 * 
 * - overall Score : number
 * 
 * -Technical questions ;
 * [{
 *      question : "",
 *      intention : "",
 *      answer : "",  
 * }]
 * 
 * -Behavioral questions ;
 * [{
 *      question : "",
 *      intention : "",
 *      answer : "",  
 * }]
 * 
 * -skill gaps : [{
 *     skill : "",
 *     severity : "",
 *     type : "String",
 *     enum : ["low", "medium", "high"]
 * }]
 * 
 * -presentation plan [{
const mongoose = require('mongoose');

/**
 * -job description schema : String
 * -resume text : String
 * -self description : String
 * 
 * - overall Score : number
 * 
 * -Technical questions ;
 * [{
 *      question : "",
 *      intention : "",
 *      answer : "",  
 * }]
 * 
 * -Behavioral questions ;
 * [{
 *      question : "",
 *      intention : "",
 *      answer : "",  
 * }]
 * 
 * -skill gaps : [{
 *     skill : "",
 *     severity : "",
 *     type : "String",
 *     enum : ["low", "medium", "high"]
 * }]
 * 
 * -presentation plan [{
 *       day : "Number",
 *       focus : "String",
 *       tasks : ["String"]
 * }]
 */

// Technical question ka schema — ek ek technical question ka structure
const technicalQuestionSchema = new mongoose.Schema({
    // Question ka text
    question : {
        type : String,
        required : [ true, "Technical question is required"]
    },
    // Interviewer is question se kya jaanna chahta hai
    intention : {
        type : String,
        required : [ true, "Intention is required"]
    },
    // Is question ka suggested answer
    answer : {
        type : String,
        required : [ true, "Answer is required"]
    }
}, {
    // Har question ka apna _id nahi chahiye
    _id : false
});

// Behavioral question ka schema — personality/behavior se related questions
const behavioralQuestionSchema = new mongoose.Schema({
    question : {
        type : String,
        required : [ true, "Behavioral question is required"]
    },
    intention : {
        type : String,
        required : [ true, "Intention is required"]
    },
    answer : {
        type : String,
        required : [ true, "Answer is required"]
    }
}, {
    _id : false
});

// Skill gap ka schema — candidate mein kaunsa skill missing hai aur kitna serious hai
const skillGapSchema = new mongoose.Schema({
    // Skill ka naam
    skill : {
        type : String,
        required : [ true, "Skill is required"]
    },
    // Kitna important hai ye gap — low, medium ya high
    severity : {
        type : String,
        enum : ["low", "medium", "high"],
        required : [ true, "Severity is required"]
    }
}, {
    _id : false
});

// Presentation plan ka schema (abhi use nahi ho raha, future ke liye hai)
const presentationPlanSchema = new mongoose.Schema({
})

// Preparation plan ka schema — din ke hisaab se kya karna hai
const preparationPlanSchema = new mongoose.Schema({
    // Kaunsa din hai preparation plan mein
    day : {
        type : Number,
        required : [ true, "Day is required"]
    },
    // Us din ka main focus kya hoga
    focus : {
        type : String,
        required : [ true, "Focus is required"]
    },
    tasks : ({ // ✅ ONLY FIXED PART
        type : [String], // changed from String → [String]
        required : [ true, "At least one task is required"]
    })
},{
    _id : false
})

// Main interview report ka schema — saari information ek jagah store hogi
const interviewReportSchema = new mongoose.Schema({
    // Job description jo user ne diya tha
    jobDescription : {
        type : String,
        required : [ true,"Job description is required"]
    },
    // Resume text (PDF se extract hua)
    resume: {
        type : String,
    },
    // User ne khud ke baare mein jo likha
    selfDescription : {
        type : String,
    },
    // AI ne kitna match score diya (0-100)
    matchScore : {
        type : Number,
        min : 0,
        max : 100,
    },

    // Technical questions ki list
    technicalQuestions : [technicalQuestionSchema],

    // Behavioral questions ki list
    behavioralQuestions : [behavioralQuestionSchema],

    // Skill gap ki list
    skillGaps : [skillGapSchema],

    // Preparation plan ki list (din ke hisaab se)
    preparationPlan : [preparationPlanSchema],

    // Ye report kis user ki hai (reference by ObjectId)
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    // Interview preparation report ka title
    title: {
        type: String,
        required: [ true, "Job title is required" ]
    }

}, {
    // Automatically createdAt aur updatedAt fields add ho jaayenge
    timestamps : true
});

// Schema se MongoDB model banate hain — 'InterviewReport' collection mein data jayega
const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

// Is model ko baaki files mein use karne ke liye export kar rahe hain
module.exports = interviewReportModel;
