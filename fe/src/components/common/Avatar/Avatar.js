import { Avatar } from '@mui/material';
import { useAuth } from '_/context/AuthContext';

function UserAvatar({ style }) {
  const { currentUser } = useAuth();
  if (!currentUser) return;
  function stringToColor(string) {
    let hash = 0;
    let i;

    if (string) {
      /* eslint-disable no-bitwise */
      for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
      }

      let color = '#';

      for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
      }
      /* eslint-enable no-bitwise */

      return color;
    }
  }

  function stringAvatar(name) {
    if (name) {
      return {
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
      };
    }
  }

  if (!currentUser) return;
  const { photoURL, avatarUrl, firstName, lastName } = currentUser;
  const displayName = lastName
    ? firstName + ' ' + lastName
    : firstName.split(' ')[0][0] + ' ' + firstName.split(' ')[0][1];
  return photoURL || avatarUrl ? (
    <Avatar alt={displayName} src={avatarUrl ? avatarUrl : photoURL} sx={style} />
  ) : (
    <Avatar
      style={{ backgroundColor: stringToColor(displayName), color: '#fff' }}
      {...stringAvatar(displayName)}
      sx={style}
    />
  );
}

export default UserAvatar;
