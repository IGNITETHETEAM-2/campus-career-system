const mongoose = require('mongoose');
const uri = "mongodb+srv://mohammedmuzhirtaha:Muzhir123@cluster0.annsvcl.mongodb.net/campus-management-system?retryWrites=true&w=majority";

console.log("Testing connection to Atlas...");
mongoose.connect(uri)
    .then(() => {
        console.log("✓ Connection SUCCESSFUL from local environment!");
        process.exit(0);
    })
    .catch(err => {
        console.error("✗ Connection FAILED from local environment!");
        console.error(err);
        process.exit(1);
    });
