// @mui
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';
import { Card, CardContent, Typography } from '@mui/material';
import { dateTimeFormate } from '_/utills';
import PropTypes from 'prop-types';
// utils

// ----------------------------------------------------------------------

AppOrderTimeline.propTypes = {
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppOrderTimeline({ subheader, list, ...other }) {
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
          padding: '0 10px 0 10px',
          boxShadow: 'none',
          '& .MuiTimelineItem-missingOppositeContent:before': {
            display: 'none',
          },
          '&:last-child': { paddingBottom: 0 },
        }}
      >
        <Timeline>
          {list?.map((item, index) => (
            <OrderItem key={index} item={item} type={`order${index + 1}`} isLast={index === list.length - 1} />
          ))}
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
  const { status, time } = item;
  const color = time
    ? (type === 'order1' && 'success') ||
      (type === 'order2' && 'info') ||
      (type === 'order3' && 'info') ||
      (type === 'order4' && 'warning') ||
      'error'
    : 'primary';
  return (
    <TimelineItem sx={{ opacity: time ? 1 : 0.3, listStyle: 'none', minHeight: '40px' }}>
      <TimelineSeparator>
        <TimelineDot color={color} />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography fontWeight={700}>{status}</Typography>

        <Typography color="grey" fontSize={'1.4rem'}>
          {time ? dateTimeFormate(time) : '........'}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
