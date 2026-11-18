import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, Building2, RotateCcw, ChevronDown, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickRoleSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { 
    currentRole, 
    currentStudent, 
    allStudents, 
    switchStudent, 
    loginAsRole, 
    resetAllData,
    currentOrganization,
    switchOrganization,
    organizations
  } = useApp();

  const handleSelectStudent = (id: string) => {
    switchStudent(id);
    navigate('/student/dashboard');
    setIsOpen(false);
  };

  const handleSelectCoordinator = () => {
    loginAsRole('coordinator');
    navigate('/coordinator/dashboard');
    setIsOpen(false);
  };

  const handleSelectEnterprise = (orgId?: string) => {
    if (orgId) switchOrganization(orgId);
    loginAsRole('enterprise');
    navigate('/enterprise/dashboard');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {/* Dropdown panel */}
      {isOpen && (
        <div className="mb-2 w-80 rounded-2xl bg-white border border-lavender-200 shadow-soft-lg p-3 text-xs space-y-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
            <div>
              <span className="font-semibold text-charcoal-900">Prototype Role Switcher</span>
              <p className="text-[11px] text-mutedGray">Switch personas to test all workflows</p>
            </div>
            <button
              onClick={() => { resetAllData(); setIsOpen(false); }}
              className="flex items-center gap-1 text-[11px] text-mutedGray hover:text-plum-600 transition-colors p-1 rounded hover:bg-lavender-50"
              title="Reset mock data to initial baseline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Student Personas */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-mutedGray mb-1 flex items-center gap-1">
              <Users className="w-3 h-3 text-plum-500" />
              <span>Student Personas</span>
            </div>
            <div className="space-y-1">
              {allStudents.map(std => {
                const isCurrent = currentRole === 'student' && currentStudent.id === std.id;
                let statusPill = 'Eligible (12h)';
                if (std.cgpa < 3.0) statusPill = 'CGPA Restrained';
                else if (std.monthlyHoursWorked >= 20) statusPill = 'Cap Reached (21h)';
                else if (std.monthlyHoursWorked >= 18) statusPill = 'Near Cap (18h)';

                return (
                  <button
                    key={std.id}
                    onClick={() => handleSelectStudent(std.id)}
                    className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-colors ${
                      isCurrent ? 'bg-lavender-100 border border-lavender-300 font-semibold text-plum-900' : 'hover:bg-ivory-100 text-charcoal-800'
                    }`}
                  >
                    <div>
                      <div className="font-medium flex items-center gap-1.5">
                        <span>{std.name}</span>
                        {isCurrent && <Check className="w-3 h-3 text-plum-600" />}
                      </div>
                      <div className="text-[10px] text-mutedGray">{std.department.split('&')[0]}</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white border border-mutedGray-border/60 text-mutedGray">
                      {statusPill}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coordinator Persona */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-mutedGray mb-1 flex items-center gap-1">
              <Shield className="w-3 h-3 text-forest-600" />
              <span>University Coordinator</span>
            </div>
            <button
              onClick={handleSelectCoordinator}
              className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-colors ${
                currentRole === 'coordinator' ? 'bg-sage-200 border border-sage-300 font-semibold text-forest-800' : 'hover:bg-ivory-100 text-charcoal-800'
              }`}
            >
              <div>
                <div className="font-medium flex items-center gap-1.5">
                  <span>Dr. Aris Thorne</span>
                  {currentRole === 'coordinator' && <Check className="w-3 h-3 text-forest-600" />}
                </div>
                <div className="text-[10px] text-mutedGray">University Safeguards Administrator</div>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white border border-mutedGray-border/60 text-forest-700 font-medium">
                Admin
              </span>
            </button>
          </div>

          {/* Enterprise Persona */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-mutedGray mb-1 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-peach-300" />
              <span>Enterprise Partner</span>
            </div>
            <button
              onClick={() => handleSelectEnterprise('org-1')}
              className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-colors ${
                currentRole === 'enterprise' ? 'bg-peach-100 border border-peach-200 font-semibold text-charcoal-900' : 'hover:bg-ivory-100 text-charcoal-800'
              }`}
            >
              <div>
                <div className="font-medium flex items-center gap-1.5">
                  <span>ABC Technologies</span>
                  {currentRole === 'enterprise' && <Check className="w-3 h-3 text-charcoal-800" />}
                </div>
                <div className="text-[10px] text-mutedGray">Marcus Vance (Talent Lead)</div>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white border border-mutedGray-border/60 text-mutedGray">
                Partner
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-lavender-300 shadow-soft-lg hover:shadow-md text-charcoal-800 text-xs font-medium transition-all hover:bg-lavender-50"
      >
        <div className="w-2 h-2 rounded-full bg-forest-500 animate-pulse" />
        <span>
          Testing as:{' '}
          <strong className="font-semibold text-plum-700">
            {currentRole === 'coordinator' 
              ? 'Coordinator' 
              : currentRole === 'enterprise' 
              ? currentOrganization.name 
              : currentRole === 'student'
              ? currentStudent.name.split(' ')[0]
              : 'Public'}
          </strong>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-mutedGray transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};
