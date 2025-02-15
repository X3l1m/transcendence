import React, { useEffect, useState } from "react";
import { UserPublic, UserStatusType, useUser } from '../../Providers/UserContext/User';
import {
  Avatar,
  Stack,
  Typography,
  useTheme,
  Grid,
  IconButton,
} from "@mui/material";
import {
  AccountCircle as AccountCircleIcon,
  CheckCircle as ApproveIcon,
  HighlightOff as DeclineIcon,
  PersonAdd as AddIcon,
  PersonOff as RemoveIcon,
  HourglassEmpty as PendingIcon,
  Block as BlockIcon,
  LockOpen as UnblockIcon,
  VideogameAsset as GameIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { darken, alpha, Theme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { useChat } from '../../Providers/ChatContext/Chat';
import axios from "axios";
import { handleChatInvite, sendGameInvite } from "../../Providers/ChatContext/utils";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../Providers/UserContext/User";

interface VisitedInfoProps {
  visitedUser: UserPublic | undefined;
}

export enum FriendshipAttitude {
  available = "available",
  pending = "pending",
  awaiting = "awaiting",
  accepted = "accepted",
  restricted = "restricted",
}

export enum FriendshipAttitudeBehaviour {
  remove = "remove",
  add = "add",
  withdraw = "withdraw",
  restrict = "restrict",
  restore = "restore",
  approve = "approve",
  decline = "decline",
}

export function getStatusColor(status: UserStatusType | undefined, theme: Theme) {
	if (!status || !theme) {
		return (theme.palette.action.hover);
	}

	return (
		status === 'online' ? theme.palette.success.main
		: status === 'offline' ? theme.palette.error.main
		: theme.palette.warning.main
	);
}

export const VisitedInfo: React.FC<VisitedInfoProps> = ({ visitedUser }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [friendshipAttitude, setFriendshipAttitude] =
    useState<FriendshipAttitude>(FriendshipAttitude.available);
  const { user, userSocket } = useUser();
	const { chatProps, changeChatProps } = useChat();
  const nav = useNavigate();

  useEffect(() => {
    const getFriendshipAttitude = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/user/friendship/${visitedUser?.id}`,
          { withCredentials: true }
        );
        if (response.data.friendshipAttitude)
          setFriendshipAttitude(response.data.friendshipAttitude);
      } catch (error) {
        console.error(`Relationship not found:${error}`);
      }
    };
    getFriendshipAttitude();
    return () => {
      setFriendshipAttitude(FriendshipAttitude.available);
    };
  }, []);

  async function postStatus(type: FriendshipAttitudeBehaviour) {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/friendship/${visitedUser?.id}`,
        { type },
        { withCredentials: true }
      );
      if (response.data.friendshipAttitude)
        setFriendshipAttitude(response.data.friendshipAttitude);
    } catch (error) {
      console.error(`Relationship isn't updated:${error}`);
    }
  }

  const userRelationButtons = () => {
    if (visitedUser?.id === user.id) return;
    switch (friendshipAttitude) {
      case FriendshipAttitude.restricted:
        return (
          <Grid item>
            <IconButton
              onClick={() => postStatus(FriendshipAttitudeBehaviour.restore)}
              sx={{
                "&:hover": {
                  color: theme.palette.error.main,
                },
              }}
            >
              <UnblockIcon />
            </IconButton>
          </Grid>
        );
      case FriendshipAttitude.accepted:
        return (
          <Grid item>
            <IconButton
              onClick={() => postStatus(FriendshipAttitudeBehaviour.remove)}
              sx={{
                "&:hover": {
                  color: theme.palette.primary.light,
                },
              }}
            >
              <RemoveIcon />
            </IconButton>
          </Grid>
        );
      case FriendshipAttitude.pending:
        return (
          <Grid item>
            <IconButton
              onClick={() => postStatus(FriendshipAttitudeBehaviour.withdraw)}
              sx={{
                "&:hover": {
                  color: theme.palette.warning.main,
                },
              }}
            >
              <PendingIcon />
            </IconButton>
          </Grid>
        );
      case FriendshipAttitude.awaiting:
        return (
          <>
            <Grid item>
              <IconButton
                onClick={() => postStatus(FriendshipAttitudeBehaviour.approve)}
                sx={{
                  "&:hover": {
                    color: theme.palette.success.main,
                  },
                }}
              >
                <ApproveIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                onClick={() => postStatus(FriendshipAttitudeBehaviour.decline)}
                sx={{
                  "&:hover": {
                    color: theme.palette.error.main,
                  },
                }}
              >
                <DeclineIcon />
              </IconButton>
            </Grid>
          </>
        );
      default:
        return (
          <>
            <Grid item>
              <IconButton
                onClick={() => postStatus(FriendshipAttitudeBehaviour.add)}
                sx={{
                  "&:hover": {
                    color: theme.palette.primary.light,
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                onClick={() => postStatus(FriendshipAttitudeBehaviour.restrict)}
                sx={{
                  "&:hover": {
                    color: theme.palette.error.main,
                  },
                }}
              >
                <BlockIcon />
              </IconButton>
            </Grid>
          </>
        );
    }
  };

  function handleGameInvite() {
		if (userSocket) {
			sendGameInvite(visitedUser?.id, userSocket, chatProps, changeChatProps);
      nav('/game');
		}
  }
  
  function handleChatClick() {
		handleChatInvite(visitedUser, chatProps, changeChatProps);
  }

  let imagePart = () => {
    return (
      <Stack
        gap={1}
        direction={"column"}
        justifyContent={"center"}
        padding={"1em"}
      >
        <Avatar
          sx={{
            aspectRatio: "1 / 1",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            width: "100%",
            height: "auto",
            minWidth: "115px",
            minHeight: "115px",
            maxHeight: "200px",
            maxWidth: "200px",
            border: "2px solid",
            borderColor: getStatusColor(visitedUser?.status, theme),
          }}
          src={visitedUser?.image ?? ""}
          alt="visitedUser"
        >
          {!visitedUser?.image && (
            <AccountCircleIcon sx={{ width: "100%", height: "auto" }} />
          )}
        </Avatar>
        {visitedUser?.id !== user.id && (
          <Stack
            direction={"column"}
            sx={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Grid
              container
              justifyContent={"center"}
              alignContent={"center"}
              flexGrow={1}
            >
              {userRelationButtons()}
              <Grid item>
                <IconButton
                  onClick={handleGameInvite}
                  sx={{
                    "&:hover": {
                      color: "#BF77F6",
                    },
                  }}
                >
                  <GameIcon />
                </IconButton>
              </Grid>
              {friendshipAttitude !== FriendshipAttitude.restricted && (
                <Grid item>
                  <IconButton
                    onClick={handleChatClick}
                    sx={{
                      "&:hover": {
                        color: theme.palette.secondary.main,
                      },
                    }}
                  >
                    <MessageIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          </Stack>
        )}
      </Stack>
    );
  };

  let namePart = () => {
    return (
      <Stack
        direction={"column"}
        justifyContent={"center"}
        gap={1}
        padding={"1em"}
        bgcolor={darken(theme.palette.primary.dark, 0.3)}
        borderRadius={"1em"}
      >
        {visitedUser?.nameNick && (
          <Typography
            sx={{ wordBreak: "break-word", color: "secondary.light" }}
          >
            {visitedUser.nameNick}
          </Typography>
        )}
        {visitedUser?.nameFirst && visitedUser?.nameLast && (
          <Typography style={{ wordBreak: "break-word" }}>
            {`${visitedUser.nameFirst} ${visitedUser.nameLast}`}
          </Typography>
        )}
        {visitedUser?.greeting && (
          <Typography style={{ wordBreak: "break-word" }}>
            {`${visitedUser.greeting}`}
          </Typography>
        )}
      </Stack>
    );
  };

  return (
    <Stack
      direction={isSmallScreen ? "column" : "row"}
      justifyContent={"space-between"}
      padding={"1em"}
      gap={"1em"}
      bgcolor={theme.palette.primary.main}
      borderBottom={1}
      borderColor={theme.palette.divider}
    >
      <Stack
        direction={"row"}
        gap={1}
        bgcolor={alpha(theme.palette.background.default, 0.5)}
        borderRadius={"1em"}
        justifyContent={isSmallScreen ? "space-between" : ""}
      >
        {imagePart()}
        {namePart()}
      </Stack>
      <Stack
        justifyContent={"center"}
        direction={isSmallScreen ? "row" : "column"}
        padding={"1em"}
        gap={2}
        bgcolor={alpha(theme.palette.background.default, 0.5)}
        borderRadius={"1em"}
      >
        {visitedUser?.email && (
          <Typography sx={{ wordBreak: "break-word" }}>
            <span style={{ color: theme.palette.secondary.light }}>Email:</span>
            <br />
            {visitedUser.email}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default VisitedInfo;
