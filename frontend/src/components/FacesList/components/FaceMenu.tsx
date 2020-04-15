import React from "react";
import { useDispatch } from "react-redux";
import {
  IconButton,
  ButtonBase,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { deleteFace } from "../../../store/faces";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import MoreVertIcon from "@material-ui/icons/MoreVert";

/**
 * Menu to display more options for a face.
 * Currently delete and download.
 * Inspired by https://material-ui.com/components/menus/
 */
const FaceMenu = ({
  f,
  imageURL,
  color,
}: {
  f: GeneratedFaceData;
  imageURL: string | undefined;
  color?: string;
}) => {
  const dispatch = useDispatch();

  const deleteFaceFunc = () => {
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
            aria-label={`download face ${f.id}`}
          >
            <ListItemIcon>
              <GetAppIcon fontSize="small" />
            </ListItemIcon>
            Download
          </MenuItem>
        </ButtonBase>
        <MenuItem
          aria-label={`delete face ${f.id}`}
          onClick={deleteFaceFunc}
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

export default FaceMenu;
