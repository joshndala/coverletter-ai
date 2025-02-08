import express from "express"
import cors from "cors"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.post("/api/generate-cover-letter", async (req, res) => {
  try {
    const { jobDescription, experiences } = req.body

    const prompt = `
      Job Description:
      ${jobDescription}

      Relevant Experiences:
      ${experiences.map((exp: any) => `- ${exp.title} at ${exp.company}: ${exp.description}`).join("\n")}

      Based on the job description and the provided experiences, generate a professional and personalized cover letter.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      system:
        "You are an expert cover letter writer. Create a compelling and tailored cover letter based on the provided job description and experiences.",
    })

    res.json({ coverLetter: text })
  } catch (error) {
    console.error("Error generating cover letter:", error)
    res.status(500).json({ error: "An error occurred while generating the cover letter" })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

