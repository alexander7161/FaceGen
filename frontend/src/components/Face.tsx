import React from "react";
import { useDispatch } from "react-redux";
import {
  GridListTileBar,
  IconButton,
  ButtonBase,
  Chip,
  ListItemIcon,
  Menu,
  MenuItem,
  LinearProgress,
  CircularProgress,
  GridListTile,
  Typography,
  Hidden
} from "@material-ui/core";
import { deleteFace } from "../store/faces";
import styled from "styled-components";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import useFirebaseFile from "./useFirebaseFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export const ImageContainer = ({
  f,
  imageURL
}: {
  f: GeneratedFaceData;
  imageURL?: string;
}) => {
  if (f.error) {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Typography variant="h3">Error</Typography>
      </div>
    );
  }
  return f.complete && f.storageRef ? (
    <img alt="" src={imageURL} style={{ height: "100%", width: "100%" }} />
  ) : (
    <CircularProgress style={{ height: "100%", width: "100%" }} />
  );
};

const FaceContainer = styled(GridListTile)`
  list-style-type: none;
  height: 100%;
  width: 100%;
`;

export const LabelContainer = ({ f }: { f: GeneratedFaceData }) => {
  if (f.error) {
    return null;
  }
  if (f.labelsLoading) {
    return <LinearProgress />;
  } else if (f.labelsLoading === false) {
    return (
      <div>
        {f.labels.map(l => (
          <Chip key={l} label={l} />
        ))}
      </div>
    );
  } else {
    return null;
  }
};

export const FaceMenu = ({
  f,
  imageURL,
  color
}: {
  f: GeneratedFaceData;
  imageURL: string | undefined;
  color?: string;
}) => {
  const dispatch = useDispatch();
  const deleteFaceFunction = () => {
    const dateNow = new Date();
    dateNow.setMinutes(dateNow.getMinutes() - 5);
    if (f.complete || f.error) {
      if (window.confirm("Are you sure you want to delete this image?")) {
        dispatch(deleteFace(f.id));
      }
    } else {
      alert("Please wait until face has finished processing.");
    }
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        style={{ color: color ? color : "white" }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <ButtonBase
          disabled={Boolean(!f.complete || f.error)}
          download
          href={imageURL || "#"}
          target="_blank"
        >
          <MenuItem
            disabled={Boolean(!f.complete || f.error)}
            onClick={handleClose}
            aria-label={`delete ${f.id}`}
          >
            <ListItemIcon>
              <GetAppIcon fontSize="small" />
            </ListItemIcon>
            Download
          </MenuItem>
        </ButtonBase>
        <MenuItem
          aria-label={`delete ${f.id}`}
          onClick={deleteFaceFunction}
          disabled={!f.complete && !f.error}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

const Face = ({
  f,
  openFaceModal
}: {
  f: GeneratedFaceData;
  openFaceModal: () => void;
}) => {
  const dateNow = new Date();
  dateNow.setMinutes(dateNow.getMinutes() - 5);
  const imageURL = useFirebaseFile(f.storageRef || "");

  const theme = useTheme();

  const matches = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <FaceContainer key={f.id} onClick={matches ? openFaceModal : undefined}>
      <ImageContainer f={f} imageURL={imageURL} />
      <Hidden xsDown>
        <GridListTileBar
          title={new Date(f.timeCreated).toLocaleDateString(undefined, {
            hour: "2-digit",
            minute: "2-digit"
          })}
          subtitle={<LabelContainer f={f} />}
          actionIcon={<FaceMenu f={f} imageURL={imageURL} />}
        />
      </Hidden>
    </FaceContainer>
  );
};

export default Face;
