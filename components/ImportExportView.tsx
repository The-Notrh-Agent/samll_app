
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDaycareData } from '../hooks/useDaycareData';
import { DataModel, Child, Caregiver, Classroom } from '../types';
import { HEBREW_STRINGS, COLORS } from '../constants';
import { exportAssignmentsToCSV, parseCsv, mapToChildren, mapToCaregivers, mapToClassrooms } from '../services/daycareService';
import { useDialog } from '../contexts/DialogContext';

const ImportCard: React.FC<{
    title: string;
    model: DataModel;
    onImport: (model: DataModel, data: any[]) => void;
    onImportSuccess: (title: string) => void;
    headers: string[];
}> = ({ title, model, onImport, onImportSuccess, headers }) => {
    const [error, setError] = useState('');
    
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setError('');
        if (acceptedFiles.length === 0) return;
        
        const file = acceptedFiles[0];
        parseCsv<any>(file, headers)
            .then(data => {
                onImport(model, data);
                onImportSuccess(title);
            })
            .catch(err => {
                setError(err.message);
            });

    }, [model, onImport, onImportSuccess, title, headers]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'text/csv': ['.csv'] } });

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
            >
                <input {...getInputProps()} />
                <p className="text-gray-500">{HEBREW_STRINGS.importInstructions}</p>
                <p className="text-xs text-gray-400 mt-2">Headers: {headers.join(', ')}</p>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export const ImportExportView: React.FC<ReturnType<typeof useDaycareData>> = ({
    children, caregivers, classrooms, academicYear, setState
}) => {
    
    const { showDialog, hideDialog } = useDialog();

    const handleImport = (model: DataModel, data: any[]) => {
        switch (model) {
            case 'children':
                setState(s => ({...s, children: mapToChildren(data)}));
                break;
            case 'caregivers':
                setState(s => ({...s, caregivers: mapToCaregivers(data)}));
                break;
            case 'classrooms':
                 setState(s => ({...s, classrooms: mapToClassrooms(data)}));
                break;
        }
    };
    
    const handleImportSuccess = (modelName: string) => {
        showDialog({
            title: HEBREW_STRINGS.importSuccessTitle,
            message: HEBREW_STRINGS.importSuccessMessage(modelName),
            hideCancelButton: true,
            confirmText: HEBREW_STRINGS.ok,
            onConfirm: hideDialog,
        });
    };

    const handleExport = () => {
        exportAssignmentsToCSV(children, caregivers, classrooms, academicYear);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold">{HEBREW_STRINGS.importExport}</h1>
                <p className="text-slate-600 mt-2">ייבא נתונים כדי להתחיל, או ייצא את השיבוצים הנוכחיים שלך.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg" style={{borderColor: COLORS.primary.peach, borderWidth: '2px'}}>
                 <h2 className="text-2xl font-semibold mb-4">{HEBREW_STRINGS.exportData}</h2>
                 <button 
                    onClick={handleExport}
                    className="w-full px-4 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors shadow-md"
                >
                    {HEBREW_STRINGS.exportAssignments}
                </button>
            </div>
            
            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-center">{HEBREW_STRINGS.importData}</h2>
                <div className="grid md:grid-cols-1 gap-6">
                    <ImportCard 
                        title={HEBREW_STRINGS.importChildren} 
                        model="children" 
                        onImport={handleImport}
                        onImportSuccess={handleImportSuccess}
                        headers={['first_name', 'last_name', 'id', 'birth_date']}
                    />
                    <ImportCard 
                        title={HEBREW_STRINGS.importCaregivers} 
                        model="caregivers" 
                        onImport={handleImport}
                        onImportSuccess={handleImportSuccess}
                        headers={['first_name', 'last_name', 'id', 'type']}
                    />
                    <ImportCard 
                        title={HEBREW_STRINGS.importClassrooms} 
                        model="classrooms" 
                        onImport={handleImport}
                        onImportSuccess={handleImportSuccess}
                        headers={['name', 'min_age', 'max_age', 'min_capacity', 'max_capacity']}
                    />
                </div>
            </div>

        </div>
    );
};
