
import { useState, useEffect, useCallback } from 'react';
import { Child, Caregiver, Classroom, AppView } from '../types';

const LOCAL_STORAGE_KEY = 'daycareAppData';

interface AppState {
  children: Child[];
  caregivers: Caregiver[];
  classrooms: Classroom[];
  academicYear: number;
}

const getInitialState = (): AppState => {
  try {
    const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    }
  } catch (error) {
    console.error("Error reading from localStorage", error);
  }

  return {
    children: [],
    caregivers: [],
    classrooms: [],
    academicYear: new Date().getFullYear(),
  };
};

export function useDaycareData() {
  const [state, setState] = useState<AppState>(getInitialState);

  useEffect(() => {
    try {
      const serializedState = JSON.stringify(state);
      window.localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [state]);

  const setChildren = (children: Child[]) => setState(s => ({ ...s, children }));
  const setCaregivers = (caregivers: Caregiver[]) => setState(s => ({ ...s, caregivers }));
  const setClassrooms = (classrooms: Classroom[]) => setState(s => ({ ...s, classrooms }));
  const setAcademicYear = (year: number) => setState(s => ({ ...s, academicYear: year }));

  const moveChildToClass = useCallback((childId: string, newClassroomId: string | null) => {
    setState(prevState => {
      const newClassrooms = prevState.classrooms.map(c => ({
        ...c,
        childIds: c.childIds.filter(id => id !== childId),
      }));

      if (newClassroomId) {
        const targetClass = newClassrooms.find(c => c.id === newClassroomId);
        if (targetClass) {
          targetClass.childIds.push(childId);
        }
      }
      return { ...prevState, classrooms: newClassrooms };
    });
  }, []);
  
  const clearAllData = useCallback(() => {
     if (window.confirm("This will delete all data. Are you sure?")) {
        setState({ children: [], caregivers: [], classrooms: [], academicYear: new Date().getFullYear() });
     }
  }, []);

  return { ...state, setChildren, setCaregivers, setClassrooms, setAcademicYear, moveChildToClass, clearAllData, setState };
}
