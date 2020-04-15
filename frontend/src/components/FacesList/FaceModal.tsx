import React from "react";
import { Typography } from "@material-ui/core";
import LabelContainer from "./components/LabelContainer";
import FaceMenu from "./components/FaceMenu";
import ImageContainer from "./components/ImageContainer/index";
import useFirebaseFile from "../../hooks/useFirebaseFile";
import styled from "styled-components";

const FaceModelContainer = styled.div`
  outline: 0;
  background-color: white;
`;

const BottomContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 4;
`;

/**
 * Modal to display face information on mobile.
 */
const FaceModal = ({ f }: { f: GeneratedFaceData }) => {
  const { fileURL: imageURL } = useFirebaseFile(f.storageRef || "");
  return (
    <FaceModelContainer>
      <ImageContainer f={f} imageURL={imageURL} />

      <Typography variant="h6" style={{ padding: 8 }}>
        {new Date(f.timeCreated).toLocaleDateString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Typography>
      <BottomContainer>
        <LabelContainer f={f} />
        <FaceMenu f={f} imageURL={imageURL} color="black" />
      </BottomContainer>
    </FaceModelContainer>
  );
};

export default FaceModal;
