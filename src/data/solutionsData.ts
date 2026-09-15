import type {
  AdmissionPackage,
  AdmissionIndividualService,
  ExamPackage,
  ExamIndividualService,
} from '../types';

export const COMPLETE_ADMISSION_PACKAGE: AdmissionPackage = {
  id: 'complete-admission-package',
  name: 'Complete Admission Package',
  price: 449,
  formattedPrice: '₹449',
  includes: [
    'Admission Poster / Announcement',
    'Online Admission Form',
    'ID Card Design / Template',
  ],
};

export const INDIVIDUAL_ADMISSION_SERVICES: AdmissionIndividualService[] = [
  {
    id: 'admission-poster',
    name: 'Admission Poster / Announcement',
    price: 199,
    formattedPrice: '₹199',
    description: 'Bespoke, institution-branded announcements ready for social media & print notices.',
  },
  {
    id: 'admission-form',
    name: 'Online Admission Form',
    price: 99,
    formattedPrice: '₹99',
    description: 'Clean digital submission form for prospective students & parents with email alerts.',
  },
  {
    id: 'admission-id-card',
    name: 'ID Card Design / Template',
    price: 199,
    formattedPrice: '₹199',
    description: 'Standardized, print-ready student and staff identity card template design.',
  },
];

export const COMPLETE_EXAM_PACKAGE: ExamPackage = {
  id: 'complete-exam-package',
  name: 'Complete Exam Package',
  price: 499,
  formattedPrice: '₹499',
  includes: [
    'Handwritten → Typed Question Paper PDF',
    'Answer Key PDF',
    'Exam Timetable',
    'Hall Ticket Design',
  ],
};

export const INDIVIDUAL_EXAM_SERVICES: ExamIndividualService[] = [
  {
    id: 'exam-question-paper',
    name: 'Handwritten → Typed Question Paper PDF',
    price: 99,
    formattedPrice: '₹99',
    unitLabel: '/ paper',
    allowsQuantity: true,
    description:
      "You provide the handwritten question paper; ELEVATE types, formats and prepares the print-ready PDF.",
  },
  {
    id: 'exam-answer-key',
    name: 'Answer Key PDF',
    price: 149,
    formattedPrice: '₹149',
    unitLabel: '/ paper',
    allowsQuantity: true,
    description: 'Clean, structured answer key document prepared to match institutional question papers.',
  },
  {
    id: 'exam-timetable',
    name: 'Exam Timetable',
    price: 79,
    formattedPrice: '₹79',
    description: 'Structured examination schedule with date, time, subject, and student instruction formatting.',
  },
  {
    id: 'exam-hall-ticket',
    name: 'Hall Ticket Design',
    price: 199,
    formattedPrice: '₹199',
    description: 'Print-ready examination admit card template with institutional branding and candidate guidelines.',
    note: 'Student-wise hall ticket preparation is available with quantity-based/custom pricing.',
  },
];
