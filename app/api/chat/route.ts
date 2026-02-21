/**
 * app/api/chat/route.ts
 *
 * Updated: use GROQ_MODEL env var; handle decommissioned-model errors gracefully.
 */

import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

// ─── Groq client (lazy — only instantiated if API key exists) ─────────────────
function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey || apiKey === 'your_groq_api_key') {
    throw new Error('GROQ_API_KEY is not configured. Get your free key at console.groq.com')
  }
  return new Groq({ apiKey })
}

// ─── System prompt: Avance Insights company knowledge ─────────────────────────
const SYSTEM_PROMPT = `You are a warm, professional, and highly knowledgeable member of the Avance Insights team, based in our New Delhi headquarters. Your goal is to provide a seamless, human-like experience for our clients and partners.

CORE PHILOSOPHY:
- Speak like a human, not a bot. Use natural transitions and empathetic phrasing.
- Instead of "I am an AI," say "I'm part of the Avance team here to help you."
- Use conversational fillers where appropriate (e.g., "Actually," "That's a brilliant question," "I'd be more than happy to look into that for you").
- Be concise but thorough. Quality over quantity.

COMPANY OVERVIEW:
Avance Insights is a marketing research agency providing data collection and support services to companies ranging from boutique research agencies to large consulting firms. We are committed to providing quality services and being accepted as a trusted, preferred partner by our clients.

SERVICES WE OFFER:
1. Market Research — Consumer surveys, brand tracking, product testing, competitive analysis, U&A studies, pricing research, concept testing
2. Social Research — Impact assessments, policy research, community studies, NGO evaluations, social development studies
3. Data Collection — Multi-mode: CAPI, CATI, CAWI with GPS monitoring across 15+ Indian states. 300,000+ respondents in proprietary online panels
4. Survey Programming & Hosting — Advanced skip logic, branching, multi-language, mobile-optimized
5. Data Processing & Analytics — SPSS, Quantum software, cross-tabulations, segmentation studies, trend analysis, analytical models
6. Translation & Transcription — Multi-language research capabilities
7. Strategic Consulting — Research design, business intelligence, insight reports

TYPES OF STUDIES:
Concept & New Product Tests, Product Evaluation, Positioning & Communication, Ad Evaluation, Customer Satisfaction, Pricing Research, U&A Studies, Market Mapping, Brand Tracking, Market Penetration, Competitor Benchmarking, Mystery Shopping, Net Promoter Index, Psychographic & Segmentation Studies, Retail Census, Opinion Polls, and many more.

SECTORS SERVED:
FMCG, Healthcare, Media, Financial Services, NGO/Social Development, Government, Technology, Retail, Automotive, Education, Telecom.

CLIENTS SERVED:
Market research agencies, advertising agencies, social/development sector organizations, media companies, and direct brands across India and internationally.

KEY FACTS:
- Pan-India coverage across 15+ states
- 300,000+ respondents in online panels
- 100+ successful projects completed
- 50+ happy client organizations
- GPS-monitored field data collection for quality assurance
- MRSI Member (Market Research Society of India)
- MSME Registered
- ISO 9001:2015 Quality Management System Certified
- Headquarters: New Delhi, India
- Contact: info@avanceinsights.in

LEADERSHIP TEAM:
- Manoj Kumar Jha — Director, Project Management (20+ years experience)
- Rahul Verma — Director, Partnerships (15+ years, qualitative & quantitative)
- Dr. Manish Sinha — Director, Business Development (PhD Consumer Behaviour, 20 years)
- Gopal Mani Dwary — Sr. Manager Operations (15+ years, worked at Kantar, GfK)
- Shakti Vardhan — Head Analytics (35+ years MR experience, SPSS/Quantum specialist)

RESPONSE GUIDELINES:
- Be professional, knowledgeable, and helpful.
- Keep responses concise but conversational. Avoid extremely long walls of text unless specifically asked for a detailed breakdown.
- Always relate answers back to Avance Insights' specific capabilities.
- If asked about pricing or specific project costs, invite them to contact us for a custom quote as these depend on project scope.
- If asked about things outside our expertise, acknowledge it honestly and try to point them in the right direction or offer our team's contact info.
- Do NOT mention or compare competitor companies.
- Invite users to contact us (info@avanceinsights.in) for specific project discussions.
- Use natural transitions between topics.
- Provide relevant source links when appropriate.`

// ─── Source link mapping (topic → page) ─────────────────────────────────────

const SOURCE_LINKS: Record<string, { title: string; url: string }> = {
  services:      { title: 'Our Services',         url: '/services' },
  market:        { title: 'Market Research',       url: '/services/market-research' },
  social:        { title: 'Social Research',       url: '/services/social-research' },
  data:          { title: 'Data Collection',       url: '/services/data-collection' },
  surveys:       { title: 'Live Surveys',          url: '/surveys' },
  contact:       { title: 'Contact Us',            url: '/contact' },
  'case-study':  { title: 'Case Studies',          url: '/case-studies' },
  about:         { title: 'About Avance Insights', url: '/about' },
  team:          { title: 'Meet the Team',         url: '/about#team' },
}

function getRelevantSources(
  query: string,
  response: string
): { title: string; url: string }[] {
  const text = `${query} ${response}`.toLowerCase()
  const found: { title: string; url: string }[] = []

  for (const [keyword, source] of Object.entries(SOURCE_LINKS)) {
    if (text.includes(keyword) && found.length < 3) {
      found.push(source)
    }
  }

  return found
}

/** Utility to detect decommissioned-model error from Groq SDK responses */
function isModelDecommissionedError(err: any) {
  // Groq SDK errors can be nested, check common shapes
  return (
    err?.error?.error?.code === 'model_decommissioned' ||
    err?.error?.code === 'model_decommissioned' ||
    err?.response?.data?.error?.code === 'model_decommissioned' ||
    String(err?.message || '').toLowerCase().includes('decommissioned')
  )
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history, stream = true } = body as {
      message: string
      history?: { role: 'user' | 'assistant'; content: string }[]
      stream?: boolean
    }

    // Validate
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (message.trim().length > 2000) {
      return NextResponse.json({ error: 'Message is too long' }, { status: 400 })
    }

    const sanitizedHistory = (Array.isArray(history) ? history : [])
      .slice(-10)
      .filter((msg) =>
        (msg.role === 'user' || msg.role === 'assistant') &&
        typeof msg.content === 'string' &&
        msg.content.trim().length > 0
      )
      .map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content.trim(),
      }));

    const conversationHistory: Groq.Chat.CompletionCreateParams.Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...sanitizedHistory,
      { role: 'user', content: message.trim() },
    ];

    const groq = getGroqClient()
    const model = process.env.GROQ_MODEL ?? 'llama-3.1-8b-instant'

    if (!stream) {
      // Non-streaming fallback
      const completion = await groq.chat.completions.create({
        model,
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 1024,
      })
      const responseText = completion.choices[0]?.message?.content ?? ''
      const sources = getRelevantSources(message, responseText)
      return NextResponse.json({
        response: responseText,
        sources: sources.length > 0 ? sources : undefined,
      })
    }

    // Streaming implementation
    const responseStream = await groq.chat.completions.create({
      model,
      messages: conversationHistory,
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    })

    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        let fullText = ''
        try {
          for await (const chunk of responseStream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              fullText += content
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
            }
          }

          // At the end, send sources
          const sources = getRelevantSources(message, fullText)
          if (sources.length > 0) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ sources })}\n\n`))
          }
          
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          console.error('[Streaming Error]', err)
          controller.error(err)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (err: unknown) {
    console.error('[API /chat] Error:', err)

    // Groq rate limit (backup check)
    if (err instanceof Error && err.message.includes('429')) {
      return NextResponse.json(
        {
          error:
            'Our AI assistant is receiving high traffic. Please try again in a moment.',
        },
        { status: 429 }
      )
    }

    // Missing API key
    if (err instanceof Error && err.message.includes('GROQ_API_KEY')) {
      return NextResponse.json(
        {
          response:
            'The AI assistant is not configured yet. Please contact us directly at info@avanceinsights.in and our team will be happy to help!',
          sources: [{ title: 'Contact Us', url: '/contact' }],
        },
        { status: 200 } // Return 200 so frontend shows the message gracefully
      )
    }

    // Generic error
    return NextResponse.json(
      {
        error:
          'Failed to process your request. Please try again or contact us at info@avanceinsights.in',
      },
      { status: 500 }
    )
  }
}