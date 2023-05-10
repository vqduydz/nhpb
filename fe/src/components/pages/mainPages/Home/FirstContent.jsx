import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Typography } from '@mui/material';
import { Button } from '_/components/common';

function FirstContent({ data = { image: '', title: '', subTitle: [], extendTitle: '', url: '' } }) {
    const { image, title, subTitle, extendTitle, url } = data;
    return (
        <Button
            href={url}
            style={{
                padding: 0,
            }}
        >
            <Box sx={{ width: '100%' }}>
                <Box
                    sx={{
                        backgroundImage: `url(${image})`,
                        paddingTop: '56.25%',
                        borderRadius: '5px',
                        position: 'relative',
                        width: '100%',
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundColor: '#eee',
                    }}
                />
                <Box
                    sx={{
                        padding: '5px 0',
                        fontSize: '1.28rem',
                    }}
                >
                    <Typography
                        sx={{
                            color: '#333',
                            fontSize: '1.4rem',
                            fontWeight: 'bold',
                            wordBreak: 'break-word',
                            whiteSpace: 'normal',
                        }}
                        variant="h3"
                    >
                        {title}
                    </Typography>
                    <Box
                        sx={{
                            margin: '10px 0 10px 0',
                            color: '#444',
                        }}
                    >
                        <ul
                            style={{
                                margin: '10px 0px 10px 25px',
                            }}
                        >
                            {subTitle.map((item, index) => {
                                return <li key={index}>{item}</li>;
                            })}
                        </ul>
                    </Box>
                    <Button
                        style={{
                            background: 'transparent',
                            fontWeight: 'bold',
                            color: 'var(--mau-bc-16)',
                            textTransform: 'uppercase',
                            padding: 0,
                            fontSize: '1.28rem',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                        }}
                    >
                        {extendTitle} <ChevronRightIcon fontSize="large" />
                    </Button>
                </Box>
            </Box>
        </Button>
    );
}

export default FirstContent;
