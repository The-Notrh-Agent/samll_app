
import React from 'react';
import { HEBREW_STRINGS, COLORS } from '../constants';

interface AlertDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    hideCancelButton?: boolean;
    confirmButtonVariant?: 'primary' | 'danger';
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    hideCancelButton = false,
    confirmButtonVariant = 'primary',
}) => {
    if (!isOpen) return null;

    const confirmButtonColor = confirmButtonVariant === 'danger' 
        ? COLORS.accent.coral 
        : COLORS.primary.blue;

    const defaultConfirmText = hideCancelButton ? HEBREW_STRINGS.close : HEBREW_STRINGS.confirm;

    return (
        <div 
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="alertdialog"
            onClick={onCancel}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md m-4 transform transition-all animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
                    <p className="text-slate-600 whitespace-pre-wrap">{message}</p>
                </div>
                <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
                    {!hideCancelButton && (
                         <button 
                            type="button" 
                            onClick={onCancel} 
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            {cancelText || HEBREW_STRINGS.cancel}
                        </button>
                    )}
                    <button 
                        type="button" 
                        onClick={onConfirm} 
                        className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity shadow"
                        style={{ backgroundColor: confirmButtonColor }}
                    >
                        {confirmText || defaultConfirmText}
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
