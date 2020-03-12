type GeneratedFaceData =
  | GeneratedFaceDataObj
  | GeneratedFaceDataWithLabelsLoading
  | GeneratedFaceDataWithLabels;

interface GeneratedFaceDataObj {
  id: string;
  timeCreated: number;
  timeCompleted: number | undefined;
  complete: boolean;
  seed?: number;
  storageRef?: string;
  error?: boolean;
  labels: undefined;
  labelsLoading: undefined;
}

interface GeneratedFaceDataWithLabelsLoading extends GeneratedFaceDataObj {
  labelsLoading: true;
}

interface GeneratedFaceDataWithLabels extends GeneratedFaceDataObj {
  labels: string[];
  labelsLoading: false;
}
