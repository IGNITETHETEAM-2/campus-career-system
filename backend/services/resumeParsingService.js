const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class ResumeParsingService {
  constructor() {
    this._genAI = null;
    this._model = null;
    this._initialized = false;
  }

  // Lazy initialization — read API key at call time
  _init() {
    if (this._initialized) return;
    this._initialized = true;
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this._genAI = new GoogleGenerativeAI(apiKey);
      this._model = this._genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } else {
      this._genAI = null;
    }
  }

  get genAI() { this._init(); return this._genAI; }
  get model() { this._init(); return this._model; }

  /**
   * Extract text from PDF buffer
   */
  async extractTextFromPDF(buffer) {
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      console.error('PDF parsing error:', error.message);
      throw new Error('Failed to parse PDF file');
    }
  }

  /**
   * Extract text from image using Gemini Vision API
   */
  async extractTextFromImage(buffer, mimeType) {
    if (!this.genAI) {
      throw new Error('Gemini API not configured. Cannot process images.');
    }

    try {
      const base64Image = buffer.toString('base64');
      const result = await this.model.generateContent([
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType
          }
        },
        'Extract all text from this resume image. Preserve the structure and formatting as much as possible.'
      ]);

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Image OCR error:', error.message);
      throw new Error('Failed to extract text from image');
    }
  }

  /**
   * Parse resume text using Gemini AI to extract structured data
   */
  async parseResumeText(resumeText, email, name) {
    if (!this.genAI) {
      return this.fallbackParsing(resumeText, email, name);
    }

    try {
      const prompt = `You are a resume parsing AI. Extract structured information from this resume text.

Resume Text:
${resumeText}

Extract the following information and return ONLY valid JSON (no markdown):
{
  "fullName": "extracted name or provided: ${name}",
  "email": "extracted email or provided: ${email}",
  "phone": "phone number if found, else null",
  "summary": "professional summary or objective if present",
  "skills": ["array", "of", "skills", "separated", "by", "commas", "or", "bullets"],
  "experience": [
    {
      "company": "company name",
      "position": "job title",
      "duration": "dates or duration",
      "description": "responsibilities and achievements"
    }
  ],
  "education": [
    {
      "institution": "university/college name",
      "degree": "degree name",
      "field": "field of study",
      "year": "graduation year or duration"
    }
  ],
  "projects": [
    {
      "title": "project title",
      "description": "what you did",
      "technologies": ["tech1", "tech2"],
      "link": "github or portfolio link if present, else null"
    }
  ],
  "certifications": ["certification1", "certification2"]
}

Be thorough and extract all information. If a field is not found, use null or empty array.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up response (remove markdown code blocks if present)
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanText);

      return parsed;
    } catch (error) {
      console.error('Resume parsing error:', error.message);
      return this.fallbackParsing(resumeText, email, name);
    }
  }

  /**
   * Fallback parsing without AI (simple regex-based)
   */
  fallbackParsing(resumeText, email, name) {
    // Extract phone number
    const phoneMatch = resumeText.match(/\b(?:\d{10}|[\d\s\-\(\)]{10,})\b/);
    const phone = phoneMatch ? phoneMatch[0] : null;

    // Split by common keywords to find sections
    const skillsMatch = resumeText.match(/(?:skills?|expertise|competencies)[:\s]*([^\n]+(?:\n[^\n]+)*?)(?=\n\n|\n[A-Z]|$)/i);
    const skills = skillsMatch ? 
      skillsMatch[1]
        .split(/[,\n]/)
        .map(s => s.trim())
        .filter(s => s.length > 0)
      : [];

    return {
      fullName: name || 'Unknown',
      email: email || null,
      phone,
      summary: null,
      skills: skills.slice(0, 20), // Limit to 20 skills
      experience: [],
      education: [],
      projects: [],
      certifications: []
    };
  }
}

module.exports = new ResumeParsingService();
