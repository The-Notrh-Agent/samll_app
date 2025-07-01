
import React, { useState, useCallback } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { useDaycareData } from './hooks/useDaycareData';
import { AppView } from './types';
import { HEBREW_STRINGS, NAV_ITEMS, COLORS } from './constants';
import { ClassroomDashboard } from './components/ClassroomDashboard';
import { DataManagementViews } from './components/DataManagementViews';
import { SettingsView } from './components/SettingsView';
import { ImportExportView } from './components/ImportExportView';
import { DialogProvider } from './contexts/DialogContext';

const Layout: React.FC<{
  children: React.ReactNode;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
}> = ({ children, activeView, onNavigate }) => {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 flex flex-col">
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-sm shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold" style={{color: COLORS.text}}>{HEBREW_STRINGS.appName}</div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {NAV_ITEMS.map(({ label, view, icon }) => (
                <button
                  key={view}
                  onClick={() => onNavigate(view)}
                  className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    activeView === view
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-stone-100 hover:text-slate-900'
                  }`}
                >
                  {icon}
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
};


export default function App() {
  const daycareData = useDaycareData();
  const [activeView, setActiveView] = useState<AppView>('classrooms');

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id && over && active.id !== over.id) {
        const childId = active.id as string;
        const newClassroomId = over.id === 'unassigned' ? null : over.id as string;
        daycareData.moveChildToClass(childId, newClassroomId);
    }
  }, [daycareData.moveChildToClass]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'classrooms':
        return <ClassroomDashboard {...daycareData} />;
      case 'children':
      case 'caregivers':
      case 'manage_classrooms':
        return <DataManagementViews view={activeView} {...daycareData} />;
      case 'settings':
        return <SettingsView {...daycareData} />;
      case 'import_export':
        return <ImportExportView {...daycareData} />;
      default:
        return <ClassroomDashboard {...daycareData} />;
    }
  };

  return (
    <DialogProvider>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <Layout activeView={activeView} onNavigate={setActiveView}>
                {renderActiveView()}
            </Layout>
        </DndContext>
    </DialogProvider>
  );
}