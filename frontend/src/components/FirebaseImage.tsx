import React from "react";
import firebase from "firebase";

var storage = firebase.storage();

const FirebaseImage = ({ storageRef }: { storageRef: string }) => {
  const [fileURL, setFileURL] = React.useState(undefined);
  React.useEffect(() => {
    try {
      (async () => {
        const pathReference = storage.ref(storageRef);
        const fileURL = await pathReference.getDownloadURL();
        setFileURL(fileURL);
      })();
    } catch (e) {}
  }, [storageRef, setFileURL]);
  if (!fileURL) {
    return <p>File not found.</p>;
  }
  return <img src={fileURL} height={100} width={100} />;
};

export default FirebaseImage;
