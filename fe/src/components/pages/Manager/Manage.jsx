import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

import { Loading, MyButton } from '_/components/common';
import { useThemMui } from '_/context/ThemeMuiContext';
import { BookingsManage, CatalogManage, MenuManage, OrdersManage, UserManage } from '..';

export default function Manage() {
  const [tab, setTab] = useState(0);
  const [bl, setBl] = useState(false);
  const { loading } = useThemMui();

  const btnContent = [
    { tab: 0, content: 'Users' },
    { tab: 1, content: 'Menus' },
    { tab: 2, content: 'Catalogs' },
    { tab: 3, content: 'Orders' },
    { tab: 4, content: 'Booking' },
  ];

  const render = (tab) => {
    let Comp;
    switch (tab) {
      case 0:
        Comp = <UserManage />;
        break;
      case 1:
        Comp = <MenuManage />;
        break;
      case 2:
        Comp = <CatalogManage />;
        break;
      case 3:
        Comp = <OrdersManage />;
        break;
      case 4:
        Comp = <BookingsManage />;
        break;
      default:
        break;
    }
    return Comp;
  };

  useEffect(() => {
    setBl(!bl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <Box sx={{ pt: '20px' }}>
      {loading && <Loading />}
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'start',
          padding: '10px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #0000000a',
          width: '100%',
          position: 'sticky',
          top: '56px',
          zIndex: '2',
          mb: '1vh',
        }}
      >
        {btnContent.map((btn) => (
          <MyButton
            key={btn.tab}
            text
            fontWeight={700}
            color={{ mainColor: btn.tab === tab ? `#fe2c55` : '#0a66b7' }}
            style={{ borderBottom: btn.tab === tab ? `2px solid #fe2c55` : '2px solid transparent' }}
            padding={'1px 9px'}
            onClick={() => setTab(btn.tab)}
          >
            {btn.content}
          </MyButton>
        ))}
      </Box>
      {render(tab)}
    </Box>
  );
}
