import React, { useState } from 'react';
import { useDaycareData } from '../hooks/useDaycareData';
import { Child, Caregiver, Classroom, AppView, WorkerType } from '../types';
import { HEBREW_STRINGS, COLORS, ChildIcon, CaregiverIcon, EditIcon } from '../constants';
import { useDialog } from '../contexts/DialogContext';

const Modal: React.FC<{ children: React.ReactNode, onClose: () => void, title: string }> = ({ children, onClose, title }) => (
    <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{title}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            {children}
        </div>
    </div>
);

const ChildForm: React.FC<{
    initialData: Partial<Child> | null;
    onSave: (child: Child) => void;
    onClose: () => void;
}> = ({ initialData, onSave, onClose }) => {
    const [formData, setFormData] = useState<Partial<Child>>(initialData || { firstName: '', lastName: '', dateOfBirth: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: initialData?.id || crypto.randomUUID(), ...formData } as Child);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">{HEBREW_STRINGS.firstName}</label>
                <input id="firstName" name="firstName" value={formData.firstName || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" required/>
            </div>
            <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">{HEBREW_STRINGS.lastName}</label>
                <input id="lastName" name="lastName" value={formData.lastName || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" required/>
            </div>
            <div>
                <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">{HEBREW_STRINGS.idNumber}</label>
                <input id="idNumber" name="idNumber" value={formData.idNumber || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
            <div>
                 <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">{HEBREW_STRINGS.dateOfBirth}</label>
                <input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" required/>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">{HEBREW_STRINGS.cancel}</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">{HEBREW_STRINGS.save}</button>
            </div>
        </form>
    );
};

const CaregiverForm: React.FC<{
    initialData: Partial<Caregiver> | null;
    onSave: (caregiver: Caregiver) => void;
    onClose: () => void;
}> = ({ initialData, onSave, onClose }) => {
    const [formData, setFormData] = useState<Partial<Caregiver>>(initialData || { firstName: '', lastName: '', workerType: WorkerType.Caregiver });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: initialData?.id || crypto.randomUUID(), ...formData } as Caregiver);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">{HEBREW_STRINGS.firstName}</label>
                <input id="firstName" name="firstName" value={formData.firstName || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" required/>
            </div>
            <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">{HEBREW_STRINGS.lastName}</label>
                <input id="lastName" name="lastName" value={formData.lastName || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" required/>
            </div>
            <div>
                <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">{HEBREW_STRINGS.idNumber}</label>
                <input id="idNumber" name="idNumber" value={formData.idNumber || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
            <div>
                <label htmlFor="workerType" className="block text-sm font-medium text-gray-700 mb-1">{HEBREW_STRINGS.workerType}</label>
                <select id="workerType" name="workerType" value={formData.workerType} onChange={handleChange} className="w-full p-2 border rounded-lg">
                    {Object.values(WorkerType).map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">{HEBREW_STRINGS.cancel}</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">{HEBREW_STRINGS.save}</button>
            </div>
        </form>
    );
};

const ClassroomForm: React.FC<{
    initialData: Partial<Classroom> | null;
    onSave: (classroom: Classroom) => void;
    onClose: () => void;
    allCaregivers: Caregiver[];
}> = ({ initialData, onSave, onClose, allCaregivers }) => {
    const [formData, setFormData] = useState<Partial<Classroom>>(initialData || { name: '', minAge: 0, maxAge: 3, minCapacity: 0, maxCapacity: 10, assignedCaregiverIds: [] });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value });
    };
    
    const handleCaregiverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, assignedCaregiverIds: selectedIds });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: initialData?.id || crypto.randomUUID(), childIds: initialData?.childIds || [], ...formData } as Classroom);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{HEBREW_STRINGS.classroomName}</label>
                <input id="name" name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" required/>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="minAge" className="block text-sm font-medium text-gray-700 mb-1">{HEBREW_STRINGS.minAge}</label>
                    <input id="minAge" name="minAge" type="number" value={formData.minAge || 0} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                    <label htmlFor="maxAge" className="block text-sm font-medium text-gray-700 mb-1">{HEBREW_STRINGS.maxAge}</label>
                    <input id="maxAge" name="maxAge" type="number" value={formData.maxAge || 0} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="minCapacity" className="block text-sm font-medium text-gray-700 mb-1">{HEBREW_STRINGS.minCapacity}</label>
                    <input id="minCapacity" name="minCapacity" type="number" value={formData.minCapacity || 0} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                    <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700 mb-1">{HEBREW_STRINGS.maxCapacity}</label>
                    <input id="maxCapacity" name="maxCapacity" type="number" value={formData.maxCapacity || 0} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                </div>
            </div>
            <div>
              <label htmlFor="assignedCaregiverIds" className="block text-sm font-medium text-gray-700 mb-1">{HEBREW_STRINGS.assignedCaregivers}</label>
              <select
                  id="assignedCaregiverIds"
                  multiple
                  name="assignedCaregiverIds"
                  value={formData.assignedCaregiverIds || []}
                  onChange={handleCaregiverChange}
                  className="w-full p-2 border rounded-lg h-32 bg-slate-50"
              >
                  {allCaregivers.map(cg => (
                      <option key={cg.id} value={cg.id}>{cg.firstName} {cg.lastName}</option>
                  ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">{HEBREW_STRINGS.cancel}</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">{HEBREW_STRINGS.save}</button>
            </div>
        </form>
    );
};


export const DataManagementViews: React.FC<{ view: AppView } & ReturnType<typeof useDaycareData>> = (props) => {
    const { view, children, caregivers, classrooms, setState } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Child | Caregiver | Classroom | null>(null);
    const { showDialog, hideDialog } = useDialog();
    
    const isChildrenView = view === 'children';
    const isCaregiversView = view === 'caregivers';
    const isClassroomsView = view === 'manage_classrooms';

    const data = isChildrenView ? children : isCaregiversView ? caregivers : classrooms;
    const title = isChildrenView ? HEBREW_STRINGS.children : isCaregiversView ? HEBREW_STRINGS.caregivers : HEBREW_STRINGS.manageClassrooms;
    
    const handleOpenModal = (item: Child | Caregiver | Classroom | null = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSave = (item: Child | Caregiver | Classroom) => {
        setState(s => {
            if (isChildrenView) {
                const typedItem = item as Child;
                const exists = s.children.some(c => c.id === typedItem.id);
                const newChildren = exists ? s.children.map(c => c.id === typedItem.id ? typedItem : c) : [...s.children, typedItem];
                return { ...s, children: newChildren };
            }
            if (isCaregiversView) {
                const typedItem = item as Caregiver;
                const exists = s.caregivers.some(c => c.id === typedItem.id);
                const newCaregivers = exists ? s.caregivers.map(c => c.id === typedItem.id ? typedItem : c) : [...s.caregivers, typedItem];
                return { ...s, caregivers: newCaregivers };
            }
            if (isClassroomsView) {
                const typedItem = item as Classroom;
                const exists = s.classrooms.some(c => c.id === typedItem.id);
                const newClassrooms = exists ? s.classrooms.map(c => c.id === typedItem.id ? typedItem : c) : [...s.classrooms, typedItem];
                return { ...s, classrooms: newClassrooms };
            }
            return s;
        });
    };
    
    const handleDelete = (id: string) => {
        showDialog({
            title: HEBREW_STRINGS.deleteConfirmTitle,
            message: HEBREW_STRINGS.deleteConfirmMessage,
            confirmText: HEBREW_STRINGS.delete,
            confirmButtonVariant: 'danger',
            onConfirm: () => {
                setState(s => {
                    if (isChildrenView) {
                        return { ...s, children: s.children.filter(c => c.id !== id) };
                    }
                    if (isCaregiversView) {
                        const newCaregivers = s.caregivers.filter(c => c.id !== id);
                        const newClassrooms = s.classrooms.map(cl => ({
                            ...cl,
                            assignedCaregiverIds: cl.assignedCaregiverIds.filter(cgId => cgId !== id),
                        }));
                        return { ...s, caregivers: newCaregivers, classrooms: newClassrooms };
                    }
                    if (isClassroomsView) {
                        return { ...s, classrooms: s.classrooms.filter(c => c.id !== id) };
                    }
                    return s;
                });
                hideDialog();
            },
        });
    };

    const getHeaders = () => {
        if (isChildrenView) return [HEBREW_STRINGS.firstName, HEBREW_STRINGS.lastName, HEBREW_STRINGS.idNumber, HEBREW_STRINGS.dateOfBirth];
        if (isCaregiversView) return [HEBREW_STRINGS.firstName, HEBREW_STRINGS.lastName, HEBREW_STRINGS.idNumber, HEBREW_STRINGS.workerType];
        if (isClassroomsView) return [HEBREW_STRINGS.classroomName, HEBREW_STRINGS.ageRange, HEBREW_STRINGS.capacity, HEBREW_STRINGS.assignedCaregivers];
        return [];
    };
    
    const renderRow = (item: any) => {
        if (isChildrenView) {
            const child = item as Child;
            return (
                <>
                    <td className="p-4 whitespace-nowrap">{child.firstName}</td>
                    <td className="p-4 whitespace-nowrap">{child.lastName}</td>
                    <td className="p-4 whitespace-nowrap">{child.idNumber}</td>
                    <td className="p-4 whitespace-nowrap">{child.dateOfBirth}</td>
                </>
            );
        }
        if (isCaregiversView) {
            const caregiver = item as Caregiver;
            return (
                <>
                    <td className="p-4 whitespace-nowrap">{caregiver.firstName}</td>
                    <td className="p-4 whitespace-nowrap">{caregiver.lastName}</td>
                    <td className="p-4 whitespace-nowrap">{caregiver.idNumber}</td>
                    <td className="p-4 whitespace-nowrap">{caregiver.workerType}</td>
                </>
            );
        }
        if (isClassroomsView) {
            const classroom = item as Classroom;
            const assignedCgs = classroom.assignedCaregiverIds
                .map(id => caregivers.find(cg => cg.id === id)?.firstName)
                .filter(Boolean)
                .join(', ');
            return (
                 <>
                    <td className="p-4 whitespace-nowrap font-medium">{classroom.name}</td>
                    <td className="p-4 whitespace-nowrap">{classroom.minAge} - {classroom.maxAge}</td>
                    <td className="p-4 whitespace-nowrap">{classroom.minCapacity} - {classroom.maxCapacity}</td>
                    <td className="p-4 whitespace-nowrap text-sm text-slate-600">{assignedCgs}</td>
                </>
            );
        }
        return null;
    };

    const getIcon = () => {
        if (isChildrenView) return <ChildIcon/>;
        if (isCaregiversView) return <CaregiverIcon/>;
        if (isClassroomsView) return <EditIcon />;
        return null;
    };
    
    const getAddNewButtonText = () => {
        if (isChildrenView) return HEBREW_STRINGS.addNewChild;
        if (isCaregiversView) return HEBREW_STRINGS.addNewCaregiver;
        if (isClassroomsView) return HEBREW_STRINGS.addNewClassroom;
        return '';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    {getIcon()}
                    {title}
                </h1>
                <button onClick={() => handleOpenModal()} style={{backgroundColor: COLORS.accent.coral}} className="px-4 py-2 text-slate-800 rounded-lg hover:opacity-90 transition-opacity shadow flex items-center gap-2">
                    <span className="font-bold text-lg">+</span> {getAddNewButtonText()}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full text-start">
                    <thead className="bg-slate-50">
                        <tr>
                            {getHeaders().map(h => <th key={h} className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-start">{h}</th>)}
                            <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-start">{HEBREW_STRINGS.edit}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {data.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50">
                                {renderRow(item)}
                                <td className="p-4 whitespace-nowrap flex gap-2">
                                    <button onClick={() => handleOpenModal(item)} className="text-blue-500 hover:text-blue-700">{HEBREW_STRINGS.edit}</button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">{HEBREW_STRINGS.delete}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <Modal onClose={handleCloseModal} title={editingItem ? HEBREW_STRINGS.edit : HEBREW_STRINGS.add}>
                    {isChildrenView && <ChildForm initialData={editingItem as Child} onSave={handleSave} onClose={handleCloseModal} />}
                    {isCaregiversView && <CaregiverForm initialData={editingItem as Caregiver} onSave={handleSave} onClose={handleCloseModal} />}
                    {isClassroomsView && <ClassroomForm initialData={editingItem as Classroom} onSave={handleSave} onClose={handleCloseModal} allCaregivers={caregivers} />}
                </Modal>
            )}
        </div>
    );
};