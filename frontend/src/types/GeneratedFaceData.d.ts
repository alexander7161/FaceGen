// Generate face data type.
type GeneratedFaceData =
  | GeneratedFaceDataObj
  | GeneratedFaceDataWithLabelsLoading
  | GeneratedFaceDataWithLabels;

/**
 * Face object from firestore.
 */
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
/**
 * Face that is currently loading labels
 */
interface GeneratedFaceDataWithLabelsLoading extends GeneratedFaceDataObj {
  labelsLoading: true;
}
/**
 * Face that has loaded labels.
 */
interface GeneratedFaceDataWithLabels extends GeneratedFaceDataObj {
  labels: string[];
  labelsLoading: false;
}
