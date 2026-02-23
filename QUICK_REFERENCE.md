/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CASE STUDY NORMALIZER - QUICK REFERENCE
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ┌─────────────────────────────────────────────────────────────────────────────┐
// │ IMPORT & USE IN COMPONENT                                                   │
// └─────────────────────────────────────────────────────────────────────────────┘

import { caseStudyService } from '@/services/case-study.service'
import { NormalisedCaseStudy } from '@/lib/strapi'

// Fetch all
const allCases = await caseStudyService.getAll()

// Fetch one
const oneCase = await caseStudyService.getBySlug('slug-here')

// Fetch featured only
const featured = await caseStudyService.getFeatured()

// Filter by sector
const bySector = await caseStudyService.getBySector('Finance')

// ┌─────────────────────────────────────────────────────────────────────────────┐
// │ RENDERING IN JSX (ALL SAFE - NO [object Object] ERRORS)                     │
// └─────────────────────────────────────────────────────────────────────────────┘

// Text fields - just render directly, no null checks
<h1>{caseStudy.title}</h1>
<p>{caseStudy.client}</p>
<p>{caseStudy.challenge}</p>
<p>{caseStudy.solution}</p>
<p>{caseStudy.results}</p>
<p>{caseStudy.methodology}</p>
<span>{caseStudy.sector}</span>

// Image - always a valid URL
<img 
  src={caseStudy.coverImageUrl} 
  alt={caseStudy.title}
/>

// Boolean - always true/false (never string, never null)
{caseStudy.featured && <Badge>Featured</Badge>}

// ┌─────────────────────────────────────────────────────────────────────────────┐
// │ FIELD GUARANTEES                                                            │
// └─────────────────────────────────────────────────────────────────────────────┘

interface NormalisedCaseStudy {
  id:            number        // Never null, always a number
  documentId:    string        // Never null, always a string  
  title:         string        // Safe for JSX
  slug:          string        // Safe for URLs
  client:        string        // Has fallback "Client Name"
  sector:        string        // Has fallback "Industry"
  challenge:     string        // Multiline string, has fallback
  solution:      string        // Multiline string, has fallback
  results:       string        // Multiline string, has fallback
  methodology:   string        // Multiline string, has fallback
  coverImageUrl: string        // Always URL or /placeholder.png
  featured:      boolean       // Always true or false
}

// ┌─────────────────────────────────────────────────────────────────────────────┐
// │ COMMON OPERATIONS                                                           │
// └─────────────────────────────────────────────────────────────────────────────┘

// Split multiline results
const resultLines = caseStudy.results.split('\n').filter(Boolean)
resultLines.map(r => <li key={r}>{r}</li>)

// Check if featured
if (caseStudy.featured) { /* Show badge */ }

// Use in URLs
<Link href={`/case-studies/${caseStudy.slug}`}>View</Link>

// Get unique sectors
const sectors = await caseStudyService.getAllSectors()

// ┌─────────────────────────────────────────────────────────────────────────────┐
// │ ERROR HANDLING (GRACEFUL)                                                   │
// └─────────────────────────────────────────────────────────────────────────────┘

// Service methods never throw
const cases = await caseStudyService.getAll()  // Returns [] if Strapi down
const oneCase = await caseStudyService.getBySlug('slug')  // Returns null if not found

// Check for null safely
if (oneCase) {
  // Show detail
} else {
  // Show 404
}

// ┌─────────────────────────────────────────────────────────────────────────────┐
// │ TYPE SAFETY IN TYPESCRIPT                                                   │
// └─────────────────────────────────────────────────────────────────────────────┘

// Fully typed
const cases: NormalisedCaseStudy[] = await caseStudyService.getAll()
cases.map(cs => <CaseStudyCard key={cs.slug} caseStudy={cs} />)

// No type assertion needed
// No 'as unknown' hacks
// No 'any' types
// Everything is strongly typed from service layer

// ┌─────────────────────────────────────────────────────────────────────────────┐
// │ COMPONENT INTEGRATION                                                       │
// └─────────────────────────────────────────────────────────────────────────────┘

// Use pre-built components
import { CaseStudyCard } from '@/components/case-studies/CaseStudyCard'
import { CaseStudyDetail } from '@/components/case-studies/CaseStudyDetail'

// Card in list
<CaseStudyCard caseStudy={cs} />

// Detail on page
<CaseStudyDetail caseStudy={cs} />

// ┌─────────────────────────────────────────────────────────────────────────────┐
// │ WHAT YOU DON'T NEED TO DO                                                   │
// └─────────────────────────────────────────────────────────────────────────────┘

// Don't do null checks on text fields
// ✗ {caseStudy.title?.trim()}
// ✓ {caseStudy.title}

// Don't handle [object Object]
// ✗ {typeof caseStudy.challenge === 'string' ? caseStudy.challenge : 'N/A'}
// ✓ {caseStudy.challenge}

// Don't check if featured exists
// ✗ {caseStudy.featured ? ... : ...}
// ✓ {caseStudy.featured && ...}

// Don't validate image URLs
// ✗ <img src={getStrapiMedia(caseStudy.coverImage.url)} />
// ✓ <img src={caseStudy.coverImageUrl} />

// ═══════════════════════════════════════════════════════════════════════════════

export {}
