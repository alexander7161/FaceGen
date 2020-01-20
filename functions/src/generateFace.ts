import fetch from "node-fetch";

const generateFace = async () => {
  const response = await fetch(
    "https://us-central1-facegen-fc9de.cloudfunctions.net/generate"
  );
  return response.ok;
};

export default generateFace;
