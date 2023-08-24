// @mui
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';
import { Card, CardContent, Typography } from '@mui/material';
import { dateTimeFormate } from '_/utills';
import PropTypes from 'prop-types';
// utils

// ----------------------------------------------------------------------

BookingTimeline.propTypes = {
  list: PropTypes.array.isRequired,
};

export default function BookingTimeline({ list, ...other }) {
  return (
    <Card
      {...other}
      sx={{
        boxShadow: 'none',
        backgroundColor: 'transparent',
      }}
    >
      <CardContent
        sx={{
          padding: '0',
          boxShadow: 'none',
          '& .MuiTimelineItem-missingOppositeContent:before': {
            display: 'none',
          },
          '&:last-child': { paddingBottom: 0 },
        }}
      >
        <Timeline sx={{ padding: 3 }}>
          {list?.map((item, index) => {
            return (
              <OrderItem key={index} item={item} type={`booking${item.stt_code}`} isLast={index === list.length - 1} />
            );
          })}
        </Timeline>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  isLast: PropTypes.bool,
  item: PropTypes.shape({
    time: PropTypes.string,
    status: PropTypes.string,
  }),
  type: PropTypes.string,
};

function OrderItem({ item, isLast, type }) {
  const { status, time, reasons, refund, refundTime, refundContent } = item;
  const color = time
    ? (type === 'booking5' && 'success') ||
      (type === 'booking4' && 'info') ||
      (type === 'booking3' && 'info') ||
      (type === 'booking2' && 'warning') ||
      (type === 'booking1' && 'warning') ||
      (type === 'booking6' && 'error') ||
      'error'
    : 'primary';
  return (
    <TimelineItem
      sx={{
        listStyle: 'none',
        minHeight: '40px',
      }}
    >
      <TimelineSeparator>
        <TimelineDot color={color} />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent sx={{ padding: '7px 16px', display: 'flex', flexDirection: 'column' }}>
        <Typography fontWeight={700}>
          {status}
          {refund && `  - ${refund}`}
        </Typography>
        <i>{time ? dateTimeFormate(time) : '........'}</i>
        {reasons && <i style={{ color: '#fe2c55', marginTop: '5px' }}>{`Lý do hủy : ${reasons}`}</i>}
        {refundContent && (
          <i
            style={{ color: '#fff', marginTop: '5px', backgroundColor: 'orange', padding: '5px' }}
          >{`Thông tin hoàn tiền : ${refundContent} vào lúc ${dateTimeFormate(refundTime)}`}</i>
        )}
      </TimelineContent>
    </TimelineItem>
  );
}
