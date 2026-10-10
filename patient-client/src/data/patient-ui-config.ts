export type PatientEhrInput = {
  patientName: string;
  roomNumber: string;
  preferredLanguage: string;
  needsHearingSupport: boolean;
  needsVisionSupport: boolean;
  cognitiveLoad: 'low' | 'medium' | 'high';
  medications: Array<{ name: string; time: string; urgency: 'routine' | 'soon' | 'critical' }>;
  allergies: string[];
  alerts: Array<{ kind: 'medication' | 'vitals' | 'care'; title: string; detail: string }>;
};

export type PatientUiSpec = {
  patientName: string;
  roomNumber: string;
  language: string;
  banner: string;
  summary: string;
  statusChip: string;
  accessibility: {
    largeText: boolean;
    highContrast: boolean;
    readAloud: boolean;
    voiceInput: boolean;
  };
  actions: Array<{ id: string; label: string; accent: string; kind: 'primary' | 'secondary' }>;
};

export const sampleEhr: PatientEhrInput = {
  patientName: 'Maria Thompson',
  roomNumber: '412',
  preferredLanguage: 'English',
  needsHearingSupport: false,
  needsVisionSupport: true,
  cognitiveLoad: 'medium',
  medications: [
    { name: 'Metformin', time: '8:00 AM', urgency: 'routine' },
    { name: 'Insulin', time: '12:00 PM', urgency: 'soon' },
  ],
  allergies: ['Penicillin'],
  alerts: [
    { kind: 'medication', title: 'Medication reminder', detail: 'Metformin is scheduled for 8:00 AM.' },
    { kind: 'care', title: 'Nurse request ready', detail: 'Call bell needs attention for pain management.' },
  ],
};

export function buildPatientUiSpec(ehr: PatientEhrInput): PatientUiSpec {
  const largeText = ehr.needsVisionSupport || ehr.cognitiveLoad === 'high';
  const highContrast = ehr.needsVisionSupport || ehr.cognitiveLoad === 'high';
  const voiceInput = ehr.needsHearingSupport || true;

  const actions: PatientUiSpec['actions'] = [
    { id: 'nurse', label: 'Call Nurse', accent: '#2f80ed', kind: 'primary' },
    { id: 'meds', label: 'Medication', accent: '#27ae60', kind: 'secondary' },
    { id: 'bathroom', label: 'Bathroom', accent: '#9b51e0', kind: 'secondary' },
    { id: 'pain', label: 'Pain', accent: '#f2994a', kind: 'secondary' },
  ];

  const alertSummary = ehr.alerts[0]?.detail ?? 'No urgent notices.';

  return {
    patientName: ehr.patientName,
    roomNumber: ehr.roomNumber,
    language: ehr.preferredLanguage,
    banner: ehr.needsVisionSupport ? 'Large text and high-contrast mode are enabled.' : 'Simple support mode is active.',
    summary: `${ehr.patientName} needs help with ${ehr.alerts[0]?.title?.toLowerCase() ?? 'care support'}. ${alertSummary}`,
    statusChip: ehr.allergies.length ? `Allergy alert: ${ehr.allergies.join(', ')}` : 'No allergy alerts',
    accessibility: {
      largeText,
      highContrast,
      readAloud: true,
      voiceInput,
    },
    actions,
  };
}
