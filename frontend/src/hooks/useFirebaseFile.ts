import React from "react";
import firebase from "../fbConfig";

/**
 * Hook to fetch a file URL based on a firebase storageRef.
 *
 */
const useFirebaseFile = (storageRef: string) => {
  // State to store the fileURL, undefined by default.
  const [fileURL, setFileURL] = React.useState<string | undefined>(undefined);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  React.useEffect(() => {
    try {
      // IIFE to get download URL and set the state.
      // Set error if there are any errors.
      (async () => {
        if (storageRef) {
          const pathReference = firebase.storage().ref(storageRef);
          const fileURL = await pathReference.getDownloadURL();
          setFileURL(fileURL);
          setError(undefined);
        }
      })();
    } catch (e) {
      setFileURL(undefined);
      setError(e);
    }
  }, [storageRef, setFileURL]);

  return { fileURL, error };
};

export default useFirebaseFile;
