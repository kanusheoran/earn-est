import React from 'react';
import { GraduationCap, Award, CheckCircle2, Clock, Play, Sparkles, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const TrainingPage: React.FC = () => {
  const { trainingModules, currentStudent, completeTrainingModule } = useApp();

  const completedCount = currentStudent.completedTrainingIds.length;
  const progressPct = Math.round((completedCount / trainingModules.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-3 border-b border-lavender-200/80">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-plum-600" />
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
            Training, Certifications & Skills
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-mutedGray mt-1">
          Complete university modules on professional ethics, client boundaries, and project management to level up your student tier.
        </p>
      </div>

      {/* Progress & Tier Progress Banner */}
      <div className="card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-plum-600">
              Student Skill Advancement
            </span>
            <h3 className="text-xl font-serif font-bold text-charcoal-900 flex items-center gap-2">
              <span>{completedCount} of {trainingModules.length} Modules Certified</span>
              <StatusBadge status={currentStudent.tier} size="sm" />
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-forest-700 bg-sage-200/70 px-3.5 py-1.5 rounded-full border border-sage-300">
            <Sparkles className="w-3.5 h-3.5 text-forest-600" />
            <span>Eligible for {currentStudent.tier} Tier Opportunities</span>
          </div>
        </div>

        <div className="w-full bg-ivory-200 h-3 rounded-full overflow-hidden border border-mutedGray-border/30">
          <div
            className="bg-plum-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trainingModules.map((module) => {
          const isCompleted = currentStudent.completedTrainingIds.includes(module.id);
          return (
            <div
              key={module.id}
              className={`card-subtle rounded-3xl p-6 bg-white border transition-all flex flex-col justify-between space-y-5 ${
                isCompleted 
                  ? 'border-sage-300/80 bg-sage-50/15' 
                  : 'border-lavender-200/90 hover:border-plum-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-mutedGray">
                    {module.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {module.isRequired ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        Mandatory
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-ivory-100 text-charcoal-700 border border-ivory-200">
                        Elective
                      </span>
                    )}

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sage-200 text-forest-700 border border-sage-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-peach-100 text-charcoal-900 border border-peach-200">
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-serif font-bold text-charcoal-900 leading-snug">
                  {module.title}
                </h3>

                <p className="text-xs text-mutedGray leading-relaxed">
                  {module.description}
                </p>

                {/* Topics covered */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-mutedGray block mb-1.5">
                    Key Topics Covered:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {module.topics.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-ivory-50 text-charcoal-800 border border-ivory-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="pt-4 border-t border-ivory-200 flex items-center justify-between text-xs">
                <span className="text-mutedGray flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-plum-500" />
                  <span>{module.durationMinutes} mins · {module.modulesCount} lessons</span>
                </span>

                {isCompleted ? (
                  <button
                    onClick={() => completeTrainingModule(module.id)}
                    className="px-4 py-2 rounded-xl border border-sage-300 text-forest-700 font-semibold hover:bg-sage-100 transition-colors flex items-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>View Certificate</span>
                  </button>
                ) : (
                  <button
                    onClick={() => completeTrainingModule(module.id)}
                    className="px-4 py-2 rounded-xl bg-plum-500 hover:bg-plum-600 text-white font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Complete Module</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
