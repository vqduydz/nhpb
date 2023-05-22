export const styleBtn = {
    '& .btn': {
        fontWeight: 700,
        borderRadius: '4px',
        width: 'auto',
        whiteSpace: 'nowrap',
        opacity: 0.9,
        minWidth: '30px',
        minHeight: '20px',
        '&:hover, &:focus , &.active, &:active': {
            outline: 'none',
            opacity: 1,
            textDecoration: 'none',
        },
        '&.disable': { backgroundColor: 'grey', opacity: 0.3, pointerEvents: 'none' },
        '&.active, &:active': { boxShadow: 'unset', backgroundColor: '#3a1212b5', color: '#00ff46', opacity: 1 },
    },
    // '& .del-btn': { backgroundColor: 'red', color: ' #fff' },
    // '& .edit-btn': { backgroundColor: 'orange' },
    '& .add-btn': { backgroundColor: 'green', color: ' #fff' },
    '& .out-btn': { padding: '5px 10px', backgroundColor: 'grey', color: ' #fff' },
};
