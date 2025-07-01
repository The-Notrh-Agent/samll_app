import Papa from 'papaparse';
import { Child, Classroom, Caregiver, WorkerType } from '../types';

// --- Age Calculation ---
export function calculateAge(dob: string, academicYear: number): number {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const asOfDate = new Date(`${academicYear}-09-01`);
  if (isNaN(birthDate.getTime()) || isNaN(asOfDate.getTime())) return 0;
  
  let age = asOfDate.getFullYear() - birthDate.getFullYear();
  const m = asOfDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && asOfDate.getDate() < birthDate.getDate())) {
    age--;
  }
  const ageInYears = (asOfDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return parseFloat(ageInYears.toFixed(2));
}

// --- Automatic Assignment Logic ---
export function autoAssign(
  children: Child[],
  initialClassrooms: Classroom[],
  academicYear: number
): { updatedClassrooms: Classroom[], unassignedChildrenCount: number } {
  
  const unassignedChildren = children.filter(c => 
    !initialClassrooms.some(cl => cl.childIds.includes(c.id))
  );

  // Use reduce to process children and build the new classrooms state immutably.
  // This is cleaner and less prone to mutation errors than modifying an array in a loop.
  const finalClassrooms = unassignedChildren.reduce((currentClassrooms, child) => {
    const age = calculateAge(child.dateOfBirth, academicYear);
    
    // Find potential classrooms that meet the strict age and capacity criteria.
    const suitableClasses = currentClassrooms
      .map((classroom, index) => ({ classroom, index })) // Keep track of the original index for replacement.
      .filter(({ classroom }) => 
        age >= classroom.minAge && 
        age <= classroom.maxAge && 
        classroom.childIds.length < classroom.maxCapacity
      );

    // If no classroom is suitable, the child remains unassigned.
    if (suitableClasses.length === 0) {
      return currentClassrooms; // Return the classrooms array unmodified for this child.
    }

    // If multiple classrooms are suitable, sort them by fill percentage to find the least full one.
    suitableClasses.sort((a, b) => {
      const fillA = a.classroom.maxCapacity > 0 ? (a.classroom.childIds.length / a.classroom.maxCapacity) : 1;
      const fillB = b.classroom.maxCapacity > 0 ? (b.classroom.childIds.length / b.classroom.maxCapacity) : 1;
      return fillA - fillB;
    });
    
    const target = suitableClasses[0];
    const targetIndex = target.index;

    // Create the updated classroom object with the new child.
    const updatedClassroom = {
      ...target.classroom,
      childIds: [...target.classroom.childIds, child.id],
    };

    // Return a new array with the updated classroom, ensuring immutability.
    return [
      ...currentClassrooms.slice(0, targetIndex),
      updatedClassroom,
      ...currentClassrooms.slice(targetIndex + 1),
    ];
  }, initialClassrooms); // Start the reduction with the initial classrooms.

  const initialAssignedCount = initialClassrooms.flatMap(c => c.childIds).length;
  const finalAssignedCount = finalClassrooms.flatMap(c => c.childIds).length;
  const newlyAssignedCount = finalAssignedCount - initialAssignedCount;

  return { 
    updatedClassrooms: finalClassrooms, 
    unassignedChildrenCount: unassignedChildren.length - newlyAssignedCount
  };
}


// --- CSV Handling ---

export function exportAssignmentsToCSV(children: Child[], caregivers: Caregiver[], classrooms: Classroom[], academicYear: number): void {
  const data: (string|number)[][] = [];
  data.push(['שם כיתה', 'שם ילד', 'גיל', 'שם מטפל/ת']);

  classrooms.forEach(c => {
    const classroomCaregivers = c.assignedCaregiverIds.map(id => {
        const cg = caregivers.find(caregiver => caregiver.id === id);
        return cg ? `${cg.firstName} ${cg.lastName}` : '';
    }).join(', ');

    if (c.childIds.length === 0) {
        data.push([c.name, '', '', classroomCaregivers]);
    } else {
        c.childIds.forEach(childId => {
            const child = children.find(ch => ch.id === childId);
            if (child) {
                const age = calculateAge(child.dateOfBirth, academicYear);
                data.push([c.name, `${child.firstName} ${child.lastName}`, age.toString(), classroomCaregivers]);
            }
        });
    }
  });

  const unassignedChildren = children.filter(c => !classrooms.some(cl => cl.childIds.includes(c.id)));
  unassignedChildren.forEach(child => {
     const age = calculateAge(child.dateOfBirth, academicYear);
     data.push(['לא משויך', `${child.firstName} ${child.lastName}`, age.toString(), '']);
  });


  const csv = Papa.unparse(data);
  downloadCSV(csv, `assignments-${academicYear}.csv`);
}

function downloadCSV(csvContent: string, fileName: string) {
  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// A simple CSV parser wrapper for different data models
export function parseCsv<T>(file: File, expectedHeaders: string[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
        Papa.parse<T>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results: Papa.ParseResult<T>) => {
                if (!results.data || results.data.length === 0) {
                    return reject(new Error('CSV file is empty or invalid.'));
                }
                const headers = results.meta.fields || [];
                const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
                if (missingHeaders.length > 0) {
                     return reject(new Error(`Missing CSV headers: ${missingHeaders.join(', ')}`));
                }
                resolve(results.data);
            },
            error: (error: Error) => {
                reject(new Error(`CSV parsing error: ${error.message}`));
            }
        });
    });
}

// Specific mapping functions for each data type
export const mapToChildren = (data: any[]): Child[] => data.map(row => ({
  id: crypto.randomUUID(),
  firstName: row['first_name'] || '',
  lastName: row['last_name'] || '',
  idNumber: row['id'],
  dateOfBirth: row['birth_date'] || '',
}));

const workerTypeMap: { [key: string]: WorkerType } = {
    'מטפלת': WorkerType.Caregiver,
    'כוח עזר': WorkerType.Assistant,
    'ממלאת מקום': WorkerType.Substitute,
    'סייעת': WorkerType.Assistant, // support for another common term
    // Support direct enum value for Substitute. The others are duplicates of keys above.
    [WorkerType.Substitute]: WorkerType.Substitute,
};

export const mapToCaregivers = (data: any[]): Caregiver[] => data.map(row => ({
  id: crypto.randomUUID(),
  firstName: row['first_name'] || '',
  lastName: row['last_name'] || '',
  idNumber: row['id'],
  workerType: workerTypeMap[row['type']] || WorkerType.Caregiver,
}));

export const mapToClassrooms = (data: any[]): Classroom[] => data.map(row => ({
  id: crypto.randomUUID(),
  name: row['name'] || '',
  minCapacity: parseInt(row['min_capacity']) || 0,
  maxCapacity: parseInt(row['max_capacity']) || 10,
  minAge: parseFloat(row['min_age']) || 0,
  maxAge: parseFloat(row['max_age']) || 3,
  assignedCaregiverIds: [],
  childIds: [],
}));