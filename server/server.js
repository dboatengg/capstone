import "dotenv/config"
import app from "./app.js"

// Start server on specified port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})