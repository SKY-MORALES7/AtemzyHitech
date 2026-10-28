import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ExternalLink,
  X
} from 'lucide-react';
import { projects, projectCategories } from '../data/projects';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { useTheme } from '../context/ThemeContext';

export const Projects = () => {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [activeModalProject, setActiveModalProject] = useState(null);

  const filteredProjects =
    selectedCategory === 'All Projects'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Header Banner */}
      <div className={`relative py-16 lg:py-24 border-b transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/30 text-blue-500 text-xs font-bold uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5" />
              <span>Project Portfolio & Track Record</span>
            </span>
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              Electrical Power & ICT Deployments
            </h1>
            <p className={`mt-4 text-base sm:text-lg leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Showcasing verified 33/11kV substation upgrades, Tier-III enterprise data centers, fiber-optic backbones, smart BMS automation, and OEM hardware deliveries.
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="sticky top-[86px] sm:top-[96px] z-40 w-full px-3 sm:px-6 lg:px-8 py-2 pointer-events-auto">
        <div className={`max-w-7xl mx-auto backdrop-blur-md rounded-xl sm:rounded-2xl border transition-all duration-300 px-2 sm:px-3 py-1.5 shadow-lg ${
          isDark
            ? 'bg-slate-900/90 border-slate-700/60 shadow-slate-950/60'
            : 'bg-white/95 border-slate-300 shadow-slate-300/50'
        }`}>
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
            {projectCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border shrink-0 ${
                    isSelected
                      ? isDark
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30'
                        : 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                      : isDark
                        ? 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:text-white hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-800 border-slate-300 hover:text-slate-950 hover:bg-slate-200 hover:border-slate-400'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((p, idx) => (
              <ScrollReveal key={p.id} delay={idx * 90}>
                <div className="group flex flex-col justify-between h-full rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl hover:border-blue-500/50 transition-all duration-300">
                  <div>
                    <div className="relative h-60 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-slate-950/40" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/90 text-blue-400 border border-slate-700 shadow-md">
                          {p.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/90 text-emerald-400 border border-emerald-800">
                          {p.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-slate-400 mb-2 font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                          {p.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          {p.year}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        {p.title}
                      </h3>

                      <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                        {p.summary}
                      </p>

                      <div className="mt-4 pt-4 border-t border-slate-800/80">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Key Deliverables
                        </h4>
                        <ul className="space-y-1.5">
                          {p.deliverables.slice(0, 2).map((deliv, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2 text-xs text-slate-400">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{deliv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => setActiveModalProject(p)}
                      className="btn-3d-secondary text-xs w-full py-2.5 justify-center"
                    >
                      <span>View Case Study & Scope</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {activeModalProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden mb-6">
              <img
                src={activeModalProject.image}
                alt={activeModalProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/90 text-blue-400 border border-slate-700">
                  {activeModalProject.category}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 mb-2">
              <span>{activeModalProject.location}</span>
              <span>•</span>
              <span>Client: {activeModalProject.client}</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{activeModalProject.status}</span>
            </div>

            <h3 className="text-2xl font-black text-white">
              {activeModalProject.title}
            </h3>

            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              {activeModalProject.fullDescription}
            </p>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">
                Full Technical Deliverables & Milestones
              </h4>
              <ul className="space-y-2">
                {activeModalProject.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
              <Link
                to={`/quote?service=${encodeURIComponent(activeModalProject.category)}`}
                onClick={() => setActiveModalProject(null)}
                className="btn-3d text-xs sm:text-sm py-2.5 px-5"
              >
                Inquire About Similar Deployment
              </Link>
              <button
                onClick={() => setActiveModalProject(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
