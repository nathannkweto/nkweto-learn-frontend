export type Role = 'student' | 'teacher';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}

export interface Topic {
    id: string;
    title: string;
    description: string;
    teacherId: string;
}

export interface Quiz {
    id: string;
    topicId: string;
    title: string;
    questions: Question[];
}

export interface Question {
    id: string;
    text: string;
    options: string[];
    correctOptionIndex: number;
}