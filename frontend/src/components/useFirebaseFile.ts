import React from "react";
import firebase from "../fbConfig";

const useFirebaseFile = (storageRef: string) => {
  const [fileURL, setFileURL] = React.useState<string | undefined>(undefined);
  React.useEffect(() => {
    try {
      (async () => {
        if (storageRef) {
          const pathReference = firebase.storage().ref(storageRef);
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
