import React from "react";
import { GridListTileBar, GridListTile, Hidden } from "@material-ui/core";
import styled from "styled-components";
import useFirebaseFile from "../../hooks/useFirebaseFile";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ImageContainer from "./components/ImageContainer/index";
import FaceMenu from "./components/FaceMenu";
import LabelContainer from "./components/LabelContainer";

const FaceContainer = styled(GridListTile)`
  list-style-type: none;
  height: 100%;
  width: 100%;
`;

/**
 * Face in the grid list.
 * Shows face information when not on mobile.
 */
const FaceListItem = ({
  f,
  openFaceModal,
}: {
  f: GeneratedFaceData;
  openFaceModal: () => void;
}) => {
  const { fileURL: imageURL } = useFirebaseFile(f.storageRef || "");

  const theme = useTheme();

  // Open modal on click only on mobile.
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const openModalFunc = () => isMobile && openFaceModal();

  return (
    <FaceContainer key={f.id} onClick={openModalFunc}>
      <ImageContainer f={f} imageURL={imageURL} />
      <Hidden xsDown>
        <GridListTileBar
          title={new Date(f.timeCreated).toLocaleDateString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          })}
          subtitle={<LabelContainer f={f} />}
          actionIcon={<FaceMenu f={f} imageURL={imageURL} />}
        />
      </Hidden>
    </FaceContainer>
  );
};

export default FaceListItem;
