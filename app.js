const express = require('express')
const app = express()
const path = require('path')
const publicDirPath = path.join(__dirname, '/public')

app.use(express.static(publicDirPath, {extensions: ['html']}))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
