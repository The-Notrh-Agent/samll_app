import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Child, Classroom, Caregiver } from '../types';
import { HEBREW_STRINGS, COLORS } from '../constants';
import { calculateAge, autoAssign } from '../services/daycareService';
import { useDaycareData } from '../hooks/useDaycareData';
import { useDialog } from '../contexts/DialogContext';

// --- Child Avatar (Draggable) ---
const DraggableChildAvatar: React.FC<{ child: Child, academicYear: number }> = ({ child, academicYear }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: child.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 100 : 10,
    opacity: isDragging ? 0.8 : 1,
  };

  const age = calculateAge(child.dateOfBirth, academicYear);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-2 bg-white rounded-lg shadow cursor-grab active:cursor-grabbing flex items-center gap-3 transition-shadow hover:shadow-md"
    >
      <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold text-sm">
        {child.firstName.charAt(0)}{child.lastName.charAt(0)}
      </div>
      <div className="flex-grow">
        <p className="font-medium text-sm text-slate-800">{child.firstName} {child.lastName}</p>
        <p className="text-xs text-slate-500">{HEBREW_STRINGS.age}: {age} {HEBREW_STRINGS.years}</p>
      </div>
    </div>
  );
};

// --- Progress Ring ---
const ProgressRing: React.FC<{ value: number; max: number }> = ({ value, max }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = max > 0 ? circumference - (value / max) * circumference : circumference;
    const isFull = value >= max;
    const color = isFull ? COLORS.accent.coral : COLORS.primary.blue;

    return (
        <svg className="w-12 h-12 transform -rotate-90">
            <circle cx="24" cy="24" r={radius} stroke="#e6e6e6" strokeWidth="4" fill="transparent" />
            <circle
                cx="24" cy="24"
                r={radius}
                stroke={color}
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-300"
            />
        </svg>
    );
};

// --- Classroom Card (Droppable) ---
const DroppableClassroomCard: React.FC<{
  classroom: Classroom;
  childrenInClass: Child[];
  caregiversInClass: Caregiver[];
  academicYear: number;
}> = ({ classroom, childrenInClass, caregiversInClass, academicYear }) => {
  const { setNodeRef, isOver } = useDroppable({ id: classroom.id });
  
  const capacityAlert = classroom.childIds.length >= classroom.maxCapacity ? 'ring-2 ring-offset-2 ring-red-400' : '';
  const dropHighlight = isOver ? 'bg-blue-100 scale-105' : 'bg-white';

  return (
    <div
      ref={setNodeRef}
      style={{ backgroundColor: COLORS.primary.mint }}
      className={`rounded-2xl shadow-lg p-4 flex flex-col gap-4 transition-all duration-300 ${capacityAlert} ${dropHighlight}`}
    >
      <div className="flex justify-between items-start">
        <div>
            <h3 className="text-xl font-bold text-slate-800">{classroom.name}</h3>
            <p className="text-sm text-slate-600">{HEBREW_STRINGS.ageRange}: {classroom.minAge}-{classroom.maxAge} {HEBREW_STRINGS.years}</p>
            <p className="text-base font-bold text-slate-700 mt-1">{HEBREW_STRINGS.capacity}: {classroom.childIds.length} / {classroom.maxCapacity}</p>
        </div>
        <ProgressRing value={classroom.childIds.length} max={classroom.maxCapacity} />
      </div>
      
      <div className="flex-grow bg-white/50 rounded-lg p-3 min-h-[150px] space-y-2 overflow-y-auto">
        {childrenInClass.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500">{HEBREW_STRINGS.children}: 0</div>
        ) : (
          childrenInClass.map(child => <DraggableChildAvatar key={child.id} child={child} academicYear={academicYear} />)
        )}
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-1">{HEBREW_STRINGS.assignedCaregivers}:</h4>
        <div className="flex flex-wrap gap-2">
            {caregiversInClass.map(cg => (
                <span key={cg.id} className="text-xs bg-white text-slate-700 px-2 py-1 rounded-full">{cg.firstName} {cg.lastName}</span>
            ))}
        </div>
      </div>
    </div>
  );
};

// --- Unassigned Children Area (Droppable) ---
const UnassignedChildrenArea: React.FC<{
  unassignedChildren: Child[];
  academicYear: number;
}> = ({ unassignedChildren, academicYear }) => {
  const { setNodeRef, isOver } = useDroppable({ id: 'unassigned' });

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 p-4 rounded-2xl shadow-lg" style={{backgroundColor: COLORS.primary.peach}}>
      <h2 className="text-2xl font-bold mb-4 text-slate-800">{HEBREW_STRINGS.unassignedChildren} ({unassignedChildren.length})</h2>
      <div 
        ref={setNodeRef}
        className={`bg-white/50 rounded-lg p-4 min-h-[200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 transition-colors ${isOver ? 'bg-blue-100' : ''}`}
      >
        {unassignedChildren.map(child => (
          <DraggableChildAvatar key={child.id} child={child} academicYear={academicYear} />
        ))}
      </div>
    </div>
  );
};


// --- Main Dashboard Component ---
export const ClassroomDashboard: React.FC<ReturnType<typeof useDaycareData>> = ({
    children, classrooms, caregivers, academicYear, setState
}) => {
    
  const { showDialog, hideDialog } = useDialog();
  const assignedChildIds = new Set(classrooms.flatMap(c => c.childIds));
  const unassignedChildren = children.filter(c => !assignedChildIds.has(c.id));

  const handleAutoAssign = () => {
    showDialog({
        title: HEBREW_STRINGS.autoAssign,
        message: HEBREW_STRINGS.autoAssignConfirm,
        confirmText: HEBREW_STRINGS.autoAssign,
        onConfirm: () => {
            const { updatedClassrooms } = autoAssign(children, classrooms, academicYear);
            setState(s => ({ ...s, classrooms: updatedClassrooms }));
            showDialog({
                title: HEBREW_STRINGS.appName,
                message: HEBREW_STRINGS.autoAssignSuccess,
                hideCancelButton: true,
                confirmText: HEBREW_STRINGS.close,
                onConfirm: hideDialog,
            });
        },
    });
  };

  const handleClearAssignments = () => {
    showDialog({
        title: HEBREW_STRINGS.clearAssignments,
        message: HEBREW_STRINGS.clearAssignmentsConfirm,
        confirmText: HEBREW_STRINGS.clearAssignments,
        confirmButtonVariant: 'danger',
        onConfirm: () => {
            const clearedClassrooms = classrooms.map(c => ({...c, childIds: []}));
            setState(s => ({ ...s, classrooms: clearedClassrooms }));
            hideDialog();
        },
    });
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-wrap gap-4 justify-between items-center bg-white p-4 rounded-xl shadow">
            <h1 className="text-3xl font-bold">{HEBREW_STRINGS.classrooms} - {academicYear}</h1>
            <div className="flex gap-2">
                <button onClick={handleAutoAssign} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow">{HEBREW_STRINGS.autoAssign}</button>
                <button onClick={handleClearAssignments} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow">{HEBREW_STRINGS.clearAssignments}</button>
            </div>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {classrooms.map(classroom => {
          const childrenInClass = children.filter(c => classroom.childIds.includes(c.id));
          const caregiversInClass = caregivers.filter(cg => classroom.assignedCaregiverIds.includes(cg.id));
          return (
            <DroppableClassroomCard
              key={classroom.id}
              classroom={classroom}
              childrenInClass={childrenInClass}
              caregiversInClass={caregiversInClass}
              academicYear={academicYear}
            />
          );
        })}
      </div>

      <UnassignedChildrenArea unassignedChildren={unassignedChildren} academicYear={academicYear} />
    </div>
  );
};