// File upload handle karne ke liye multer library import kar rahe hain
const multer = require("multer")


// Multer configure kar rahe hain — file disk pe nahi, RAM (memory) mein rakhega
const upload = multer({
    // File ko disk pe nahi, memory mein store karo (buffer ke roop mein)
    storage : multer.memoryStorage(),
    limits : {
        fileSize : 4 * 1024 * 1024 // 4MB — maximum file size 4MB set ki hai
    }
})

// Is upload middleware ko routes mein use karne ke liye export kar rahe hain
module.exports = upload