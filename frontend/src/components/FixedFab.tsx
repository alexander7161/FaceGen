import styled from "styled-components";
import { Fab } from "@material-ui/core";

/**
 * Material UI Fab button
 * Fixed to bottom left of screen.
 */
const FixedFab = styled(Fab)`
  position: fixed;
  bottom: 24px;
  right: 16px;
  min-width: 100px;
`;

export default FixedFab;
