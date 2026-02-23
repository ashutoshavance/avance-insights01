import { caseStudyService } from '@/services/case-study.service';
import { normalizeCaseStudy } from '@/lib/strapi';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const slug = params?.slug;

  if (!slug) {
    notFound();
  }

  const rawData = await caseStudyService.getBySlug(slug);

  if (!rawData) {
    notFound();
  }

  const caseStudy = normalizeCaseStudy(rawData);

  return (
    <div className="pt-20 pb-20">

      {/* Breadcrumb */}
      <div className="container-custom mb-8">
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
        >
          <ArrowLeft size={18} />
          Back to Case Studies
        </Link>
      </div>

      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 mb-16">
        <div className="container-custom">
          <div className="py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {caseStudy.title}
            </h1>

            <div className="flex flex-wrap gap-4 mb-8">
              {caseStudy.sector && (
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                  {caseStudy.sector}
                </div>
              )}
              {caseStudy.client && (
                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold">
                  {caseStudy.client}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {caseStudy.coverImageUrl && (
          <div className="relative w-full bg-gray-300 aspect-video flex items-center justify-center">
            <img
              src={caseStudy.coverImageUrl}
              alt={caseStudy.title}
              className="w-full h-full object-cover rounded-xl shadow-lg border border-gray-200"
              style={{ maxHeight: '480px' }}
            />
          </div>
        )}
      </div>

      {/* Content Layout */}
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-12">

          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">

            {/* Project Overview */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Project Overview
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-1">
                    Client
                  </p>
                  <p className="text-lg font-semibold">{caseStudy.client}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-1">
                    Sector
                  </p>
                  <p className="text-lg font-semibold">{caseStudy.sector}</p>
                </div>
              </div>
            </div>

            {/* Sections */}
            {caseStudy.challenge && (
              <Section title="The Challenge" content={caseStudy.challenge} />
            )}

            {caseStudy.solution && (
              <Section title="Our Solution" content={caseStudy.solution} />
            )}

            {caseStudy.results && (
              <Section title="Results & Impact" content={caseStudy.results} />
            )}

            {caseStudy.methodology && (
              <Section title="Methodology" content={caseStudy.methodology} />
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-blue-50 rounded-lg p-8 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Case Study Details
              </h3>

              <DetailItem label="Client" value={caseStudy.client} />
              <DetailItem label="Industry" value={caseStudy.sector} />

              {caseStudy.featured && (
                <div className="mt-4">
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">
                    Featured Case Study
                  </span>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-blue-200">
                <Link
                  href="/case-studies"
                  className="inline-flex items-center justify-center w-full gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  <ArrowLeft size={18} />
                  Back to All Case Studies
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}

function DetailItem({ label, value }: { label: string }) {
  if (!value) return null;
  return (
    <div className="mb-6">
      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className="text-gray-900 font-semibold">{value}</p>
    </div>
  );
}