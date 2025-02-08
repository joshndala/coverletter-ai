import express from "express"
import cors from "cors"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.post("/api/generate-cover-letter", async (req, res) => {
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})