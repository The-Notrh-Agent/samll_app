
import React from 'react';
import { AppView } from './types';

export const HEBREW_STRINGS = {
  // General
  appName: "מערכת שיבוץ כיתות",
  save: "שמור",
  cancel: "ביטול",
  edit: "עריכה",
  delete: "מחיקה",
  add: "הוספה",
  close: "סגור",
  import: "ייבוא",
  export: "ייצוא",
  confirm: "אישור",
  ok: "בסדר",
  deleteConfirmTitle: "אישור מחיקה",
  deleteConfirmMessage: "האם אתה בטוח שברצונך למחוק פריט זה?",
  
  // Views
  classrooms: "כיתות",
  children: "ילדים",
  caregivers: "צוות",
  settings: "הגדרות",
  importExport: "ייבוא / ייצוא",
  manageClassrooms: "ניהול כיתות",

  // Classroom
  classroomName: "שם הכיתה",
  minCapacity: "קיבולת מינימלית",
  maxCapacity: "קיבולת מקסימלית",
  assignedCaregivers: "צוות משויך",
  minAge: "גיל מינימלי",
  maxAge: "גיל מקסימלי",
  ageRange: "טווח גילאים",
  capacity: "תפוסה",
  years: "שנים",
  unassignedChildren: "ילדים לא משויכים",
  autoAssign: "שיבוץ אוטומטי",
  autoAssignConfirm: "האם לבצע שיבוץ אוטומטי? פעולה זו תשבץ את כל הילדים שאינם משויכים כעת.",
  autoAssignSuccess: "השיבוץ האוטומטי הושלם בהצלחה!",
  clearAssignments: "נקה את כל השיבוצים",
  clearAssignmentsConfirm: "האם אתה בטוח שברצונך לנקות את כל השיבוצים? כל הילדים יועברו לרשימת הלא משויכים.",
  addNewClassroom: "הוסף כיתה חדשה",

  // Child
  child: "ילד",
  childName: "שם הילד",
  firstName: "שם פרטי",
  lastName: "שם משפחה",
  idNumber: "מספר תעודת זהות",
  dateOfBirth: "תאריך לידה",
  age: "גיל",
  addNewChild: "הוסף ילד חדש",

  // Caregiver
  caregiver: "איש צוות",
  caregiverName: "שם איש צוות",
  workerType: "תפקיד",
  addNewCaregiver: "הוסף איש צוות חדש",

  // Settings
  academicYear: "שנת לימודים",
  selectYear: "בחר שנה",
  appSettings: "הגדרות מערכת",
  dataManagement: "ניהול נתונים",
  clearAllData: "מחק את כל הנתונים",
  clearAllDataConfirm: "אזהרה: פעולה זו תמחק לצמיתות את כל הילדים, הצוות והכיתות מהמערכת. האם אתה בטוח שברצונך להמשיך?",
  dataCleared: "הנתונים נמחקו",
  dataClearedSuccess: "כל הנתונים נמחקו בהצלחה מהמערכת.",

  // Import/Export
  importData: "ייבוא נתונים",
  exportData: "ייצוא נתונים",
  importInstructions: "גרור ושחרר קובץ CSV לכאן, או לחץ כדי לבחור קובץ.",
  filePreview: "תצוגה מקדימה של הקובץ",
  importing: "מייבא...",
  exportAssignments: "ייצוא שיבוצים (CSV)",
  importChildren: "ייבוא ילדים (CSV)",
  importCaregivers: "ייבוא צוות (CSV)",
  importClassrooms: "ייבוא כיתות (CSV)",
  importSuccessTitle: "הייבוא הושלם",
  importSuccessMessage: (modelName: string) => `הנתונים עבור '${modelName}' יובאו בהצלחה!`,
};

export const COLORS = {
  primary: {
    blue: '#A9D6E5',
    peach: '#FFD6A5',
    mint: '#CDEAC0',
  },
  accent: {
    yellow: '#FFF4B0',
    coral: '#FFADAD',
  },
  text: '#333333',
};

export const NAV_ITEMS: { label: string; view: AppView; icon: React.ReactNode }[] = [
  { label: HEBREW_STRINGS.classrooms, view: 'classrooms', icon: <HomeIcon /> },
  { label: HEBREW_STRINGS.manageClassrooms, view: 'manage_classrooms', icon: <EditIcon /> },
  { label: HEBREW_STRINGS.children, view: 'children', icon: <ChildIcon /> },
  { label: HEBREW_STRINGS.caregivers, view: 'caregivers', icon: <CaregiverIcon /> },
  { label: HEBREW_STRINGS.importExport, view: 'import_export', icon: <ImportExportIcon /> },
  { label: HEBREW_STRINGS.settings, view: 'settings', icon: <SettingsIcon /> },
];

// --- SVG Icons as React Components ---

export function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
  );
}

export function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
  );
}

export function ChildIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9.5a2.5 2.5 0 0 1-5 0V7a2.5 2.5 0 0 1 5 0v2.5z"></path><path d="M12 13a3.5 3.5 0 0 1-3.5-3.5V7a3.5 3.5 0 0 1 7 0v2.5A3.5 3.5 0 0 1 12 13z"></path><path d="M12 13v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"></path><path d="M12 13v3a2 2 0 0 1-2-2H8a2 2 0 0 1-2-2v-3"></path></svg>
  );
}

export function CaregiverIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 21a8 8 0 0 0-12 0"></path><circle cx="12" cy="11" r="3"></circle><path d="M12 3a8 8 0 0 1 8 8c0 2.5-2 4-2 4H6s-2-1.5-2-4a8 8 0 0 1 8-8z"></path></svg>
  );
}

export function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.12l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0-2.12l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
  );
}

export function ImportExportIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12"/><path d="m16 11-4 4-4-4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7"/></svg>
    );
}