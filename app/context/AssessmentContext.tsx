// ============================================================================
// UPDATED ASSESSMENT CONTEXT TYPES & STATE (`context/AssessmentContext.tsx`)
// ============================================================================

export type PublishStatus = "Draft" | "Published" | "Scheduled";

export interface PublishSettings {
  publishStatus: PublishStatus;
  startDate: string;
  endDate: string;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showTimer: boolean;
  autoSubmit: boolean;
  allowReview: boolean;
  showCorrectAnswers: boolean;
  showExplanation: boolean;
  negativeMarking: boolean;
  fullscreenMode: boolean;
  disableCopyPaste: boolean;
  webcamProctoring: boolean;
  tabSwitchDetection: boolean;
  instructions: string;
}

export interface AssessmentContextType {
  // Existing Assessment Fields
  assessmentTitle: string;
  setAssessmentTitle: (title: string) => void;
  exam: string;
  setExam: (exam: string) => void;
  generatedQuestions: any[];
  setGeneratedQuestions: (questions: any[]) => void;
  markStepComplete: (step: number) => void;
  setCurrentStep: (step: number) => void;

  // Publish Settings
  publishSettings: PublishSettings;
  setPublishSettings: React.Dispatch<React.SetStateAction<PublishSettings>>;
}

// Initial State inside Provider:
/*
const [publishSettings, setPublishSettings] = useState<PublishSettings>({
  publishStatus: "Draft",
  startDate: "",
  endDate: "",
  shuffleQuestions: true,
  shuffleOptions: true,
  showTimer: true,
  autoSubmit: true,
  allowReview: false,
  showCorrectAnswers: false,
  showExplanation: false,
  negativeMarking: true,
  fullscreenMode: false,
  disableCopyPaste: false,
  webcamProctoring: false,
  tabSwitchDetection: false,
  instructions: "",
});
*/