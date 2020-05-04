require("dotenv").config();
const mongoose = require("mongoose");

//connect mongodb
//=================
mongoose.connect(
    process.env.DB,
    {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) throw err;
        console.log(`mongodb connected!`);
    }
);

module.exports = mongoose;