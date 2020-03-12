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
  Typography
} from "@material-ui/core";
import { deleteFace } from "../store/faces";
import styled from "styled-components";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import useFirebaseFile from "./useFirebaseFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const ImageContainer = ({
  f,
  error,
  imageURL
}: {
  f: GeneratedFaceData;
  error: boolean;
  imageURL?: string;
}) => {
  if (error) {
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

const LabelContainer = ({
  f,
  error
}: {
  f: GeneratedFaceData;
  error: boolean;
}) => {
  if (error) {
    return null;
  }
  if (f.labelsLoading) {
    return <LinearProgress />;
  } else if (f.labelsLoading === false) {
    return (
      <>
        {f.labels.map(l => (
          <Chip key={l} label={l} />
        ))}
      </>
    );
  } else {
    return null;
  }
};

const FaceMenu = ({
  f,
  imageURL,
  error
}: {
  f: GeneratedFaceData;
  imageURL: string | undefined;
  error: boolean;
}) => {
  const dispatch = useDispatch();
  const deleteFaceFunction = () => {
    const dateNow = new Date();
    dateNow.setMinutes(dateNow.getMinutes() - 5);
    if (f.complete || error) {
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
        style={{ color: "white" }}
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
          disabled={Boolean(!f.complete || error)}
          download
          href={imageURL || "#"}
          target="_blank"
        >
          <MenuItem
            disabled={Boolean(!f.complete || error)}
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
          disabled={!f.complete && !error}
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

const Face = ({ f }: { f: GeneratedFaceData }) => {
  const dateNow = new Date();
  dateNow.setMinutes(dateNow.getMinutes() - 5);
  const error = f.error || (!f.complete && f.timeCreated < +dateNow);
  const imageURL = useFirebaseFile(f.storageRef || "");

  return (
    <FaceContainer key={f.id}>
      <ImageContainer f={f} error={error} imageURL={imageURL} />
      <GridListTileBar
        title={new Date(f.timeCreated).toLocaleDateString(undefined, {
          hour: "2-digit",
          minute: "2-digit"
        })}
        subtitle={<LabelContainer f={f} error={error} />}
        actionIcon={<FaceMenu f={f} imageURL={imageURL} error={error} />}
      />
    </FaceContainer>
  );
};

export default Face;
