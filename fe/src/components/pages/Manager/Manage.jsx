import { Box } from '@mui/material';
import { Loading, MyButton } from '_/components/common';
import { useState } from 'react';
import { CatalogManage, MenuManage, OrdersManage, UserManage } from '..';
import { useEffect } from 'react';
import { useThemMui } from '_/context/ThemeMuiContext';

export default function Manage() {
  const [tab, setTab] = useState(0);
  const [bl, setBl] = useState(false);
  const { loading } = useThemMui();
  const btnContent = [
    { tab: 0, content: 'QL người dùng' },
    { tab: 1, content: 'QL món ăn - đồ uống' },
    { tab: 2, content: 'QL danh mục' },
    { tab: 3, content: 'QL đơn hàng' },
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
        }}
      >
        {btnContent.map((btn) => (
          <MyButton
            key={btn.tab}
            text
            fontWeight={700}
            color={{ mainColor: '#0a66b7' }}
            style={{ borderBottom: btn.tab === tab ? `2px solid #0a66b7` : '2px solid transparent' }}
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
