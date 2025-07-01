
import React from 'react';
import { useDaycareData } from '../hooks/useDaycareData';
import { HEBREW_STRINGS, COLORS } from '../constants';
import { useDialog } from '../contexts/DialogContext';

export const SettingsView: React.FC<ReturnType<typeof useDaycareData>> = ({
    academicYear,
    setAcademicYear,
    clearAllData
}) => {
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - 2 + i);
    const { showDialog, hideDialog } = useDialog();

    const handleClearData = () => {
        showDialog({
            title: HEBREW_STRINGS.clearAllData,
            message: HEBREW_STRINGS.clearAllDataConfirm,
            confirmText: HEBREW_STRINGS.clearAllData,
            confirmButtonVariant: 'danger',
            onConfirm: () => {
                clearAllData();
                showDialog({
                    title: HEBREW_STRINGS.dataCleared,
                    message: HEBREW_STRINGS.dataClearedSuccess,
                    hideCancelButton: true,
                    confirmText: HEBREW_STRINGS.ok,
                    onConfirm: hideDialog,
                });
            },
        });
    };
    
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-center">{HEBREW_STRINGS.appSettings}</h1>

            <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4" style={{borderColor: COLORS.primary.blue, borderWidth: '2px'}}>
                <h2 className="text-xl font-semibold">{HEBREW_STRINGS.academicYear}</h2>
                <p className="text-slate-600">בחר את שנת הלימודים הנוכחית. גילאי הילדים יחושבו נכון ל-1 בספטמבר של שנה זו.</p>
                <select 
                    value={academicYear} 
                    onChange={e => setAcademicYear(Number(e.target.value))}
                    className="w-full p-3 border rounded-lg bg-slate-50"
                >
                    {yearOptions.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4 border-2 border-transparent" style={{borderColor: COLORS.accent.coral}}>
                <h2 className="text-xl font-semibold">{HEBREW_STRINGS.dataManagement}</h2>
                <p className="text-slate-600">מחק את כל נתוני המערכת (ילדים, צוות, כיתות) מהאחסון המקומי של הדפדפן. פעולה זו היא בלתי הפיכה.</p>
                <button
                    onClick={handleClearData}
                    className="w-full px-4 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors shadow-md"
                >
                    {HEBREW_STRINGS.clearAllData}
                </button>
            </div>
        </div>
    );
};
