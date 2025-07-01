
import React, { createContext, useState, useCallback, ReactNode, useContext } from 'react';
import { AlertDialog } from '../components/AlertDialog';

export interface DialogConfig {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    hideCancelButton?: boolean;
    confirmButtonVariant?: 'primary' | 'danger';
}

interface DialogContextType {
    showDialog: (config: DialogConfig) => void;
    hideDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<(DialogConfig & { isOpen: boolean }) | null>(null);

    const showDialog = useCallback((newConfig: DialogConfig) => {
        setConfig({ ...newConfig, isOpen: true });
    }, []);

    const hideDialog = useCallback(() => {
        setConfig(null);
    }, []);

    const handleConfirm = () => {
        if (config?.onConfirm) {
            config.onConfirm();
        }
    };

    const handleCancel = () => {
        if (config?.onCancel) {
            config.onCancel();
        }
        hideDialog(); // Always close on cancel
    };

    return (
        <DialogContext.Provider value={{ showDialog, hideDialog }}>
            {children}
            {config && config.isOpen && (
                <AlertDialog
                    isOpen={config.isOpen}
                    title={config.title}
                    message={config.message}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    confirmText={config.confirmText}
                    cancelText={config.cancelText}
                    hideCancelButton={config.hideCancelButton}
                    confirmButtonVariant={config.confirmButtonVariant}
                />
            )}
        </DialogContext.Provider>
    );
};

export const useDialog = (): DialogContextType => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
};
