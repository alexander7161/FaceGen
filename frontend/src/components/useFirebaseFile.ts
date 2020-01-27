import React from "react";
import { storage } from "firebase";

const useFirebaseFile = (storageRef: string) => {
  const [fileURL, setFileURL] = React.useState<string | undefined>(undefined);
  React.useEffect(() => {
    try {
      (async () => {
        if (storageRef) {
          const pathReference = storage().ref(storageRef);
          const fileURL = await pathReference.getDownloadURL();
          setFileURL(fileURL);
        }
      })();
    } catch (e) {
      console.error(e);
    }
  }, [storageRef, setFileURL]);
  return fileURL;
};

export default useFirebaseFile;
