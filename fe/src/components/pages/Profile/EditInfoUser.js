import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import axios from 'axios';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';

import images from '_/assets/img';
import { MyTextField } from '_/components/CustomComponents/CustomComponents';
import { Button } from '_/components/subUI';
import { useDataStore } from '../../contexts/DataStoreContext';
import removeVietnameseTones from '../removeVietnameseTones';
import styles from './Profile.module.scss';
import { testImage } from './testImage';

const cx = classNames.bind(styles);

function EditInfoUser() {
    const { currentUser, setLoading, showNotif, handleHideModal } = useDataStore();
    const [gender, setGender] = useState('Female');
    const [avatar, setAvatar] = useState('undefined');
    const [birthYear, setbirthYear] = useState('');
    const [urlBox, setUrlBox] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState('');
    const [phoneNumber, setMobileNumber] = useState('');
    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        if (currentUser) {
            const { avatarUrl, photoURL, gender } = currentUser;
            setAvatar(avatarUrl || photoURL || 'undefined');
            setGender(gender || 'Female');
        }

        return () => {
            mounted.current = false;
        };
    }, [currentUser]);

    const handleSubmit = async (e) => {
        setLoading(true);

        const age = new Date().getFullYear() - Number(birthYear);
        if (Boolean(birthYear) && age > 110) {
            setLoading(false);
            showNotif('warning', 'Invalid birthYear !');
            return;
        }

        e.preventDefault();

        (() => {
            if (urlBox) {
                testImage(avatarSrc)
                    .then((avatarUrl) => {
                        const updateDataDoc = (() => {
                            if (!Boolean(birthYear) && !phoneNumber) return { gender, avatarUrl };
                            if (!Boolean(birthYear) && phoneNumber) return { gender, phoneNumber, avatarUrl };
                            if (birthYear && !phoneNumber) return { gender, birthYear, avatarUrl };
                            return {
                                birthYear,
                                phoneNumber,
                                gender,
                                avatarUrl,
                            };
                        })();

                        axios.patch(`http://localhost:3099/api/users/${currentUser.id}`, updateDataDoc).then(() => {
                            setLoading(false);
                            showNotif('success', 'Edited information successfully !');
                            handleHideModal();
                        });
                    })
                    .catch((error) => {
                        setLoading(false);
                        showNotif('warning', 'Invalid avatar url !');
                    });
                return;
            }

            const updateDataDoc = (() => {
                const avatarUrl = avatar === 'undefined' ? null : avatar;
                if (!Boolean(birthYear) && !phoneNumber) return { gender, avatarUrl };
                if (!Boolean(birthYear) && phoneNumber) return { gender, phoneNumber, avatarUrl };
                if (birthYear && !phoneNumber) return { gender, birthYear, avatarUrl };
                return {
                    birthYear,
                    phoneNumber,
                    gender,
                    avatarUrl,
                };
            })();
            axios.patch(`http://localhost:3099/api/users/${currentUser.id}`, updateDataDoc).then(() => {
                showNotif('success', 'Edited information successfully !');
                setLoading(false);
                handleHideModal();
            });
            return;
        })();
    };

    return (
        <div className={cx('auth-wrapper')}>
            <div className={cx('auth-form-wrapper')}>
                <h1 className={cx('auth-h1')}>EditInfoUser</h1>

                <FormControl fullWidth onSubmit={handleSubmit}>
                    <MyTextField
                        label="Phone Number"
                        className={cx('auth-input')}
                        size="small"
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => {
                            let letter = e.target.value;
                            if (!letter.startsWith(' ')) {
                                letter = removeVietnameseTones(letter).replace(/-|[A-z]/g, '');
                                setMobileNumber(letter.replace(/ /g, '').replace(/-/g, '').trim());
                            }
                        }}
                    />
                    <div>
                        <MyTextField
                            label="Year of Birth (YYYY)"
                            className={cx('auth-input')}
                            size="small"
                            type="text"
                            value={birthYear}
                            onChange={(e) => {
                                let letter = e.target.value;
                                if (!letter.startsWith(' ')) {
                                    letter = removeVietnameseTones(letter)
                                        .replace(/-|[A-z]/g, '')
                                        .replace(/ /g, '')
                                        .replace(/-/g, '')
                                        .trim()
                                        .slice(0, 4);
                                    const currentYear = Number(new Date().getFullYear());
                                    if (Number(letter) > currentYear) letter = currentYear.toString();
                                    setbirthYear(letter);
                                }
                            }}
                        />
                    </div>

                    <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>

                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={gender}
                        onChange={(e) => {
                            const value = e.target.value;
                            setGender(value);
                        }}
                    >
                        <FormControlLabel
                            value="Female"
                            control={<Radio />}
                            label={
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Typography variant="h6">Female</Typography>
                                </Box>
                            }
                        />
                        <FormControlLabel
                            value="Male"
                            control={<Radio />}
                            label={
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Typography variant="h6">Male</Typography>
                                </Box>
                            }
                        />
                        <FormControlLabel
                            value="Orther"
                            control={<Radio />}
                            label={
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Typography variant="h6">Other</Typography>
                                </Box>
                            }
                        />
                    </RadioGroup>

                    <FormLabel id="demo-row-radio-buttons-group-label">Customs Avatar</FormLabel>

                    <RadioGroup
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={urlBox ? avatarSrc : avatar}
                        onChange={(e) => {
                            const value = e.target.value;
                            setAvatar(value);
                        }}
                    >
                        <FormControlLabel
                            onClick={() => {
                                setUrlBox(false);
                            }}
                            sx={{
                                mb: 6,
                                mt: 2,
                            }}
                            value="undefined"
                            control={<Radio />}
                            label={
                                <Box
                                    sx={{
                                        display: 'flex',
                                        width: '100%',
                                        flexDirection: 'unset',
                                        alignItems: 'center',
                                    }}
                                >
                                    <img className={cx('avartar')} src={images.not} alt="Loading" />
                                    <Typography variant="h6" sx={{ opacity: 0.5 }}>
                                        default avatar
                                    </Typography>{' '}
                                </Box>
                            }
                        />
                        <FormControlLabel
                            onClick={() => {
                                setUrlBox(false);
                            }}
                            sx={{
                                mb: 6,
                            }}
                            value="https://www.w3schools.com/howto/img_avatar2.png"
                            control={<Radio />}
                            label={
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        justifyContent: 'center',
                                        display: 'flex',
                                        width: '100%',
                                        flexDirection: 'unset',
                                        alignItems: 'center',
                                    }}
                                >
                                    <img className={cx('avartar')} src={images.female} alt="Loading" />
                                    <Typography variant="h6" sx={{ opacity: 0.5 }}>
                                        Female avatar
                                    </Typography>{' '}
                                </Box>
                            }
                        />
                        <FormControlLabel
                            onClick={() => {
                                setUrlBox(false);
                            }}
                            sx={{
                                mb: 6,
                            }}
                            value="https://www.w3schools.com/howto/img_avatar.png"
                            control={<Radio />}
                            label={
                                <Box
                                    sx={{
                                        display: 'flex',
                                        width: '100%',
                                        flexDirection: 'unset',
                                        alignItems: 'center',
                                    }}
                                >
                                    <img className={cx('avartar')} src={images.male} alt="Loading" />
                                    <Typography variant="h6" sx={{ opacity: 0.5 }}>
                                        Male avatar
                                    </Typography>
                                </Box>
                            }
                        />
                        <FormControlLabel
                            onClick={() => {
                                setUrlBox(true);
                                setAvatar('undefined');
                            }}
                            sx={{
                                mb: 6,
                                '& .MuiTypography-root': {
                                    width: '100%',
                                },
                            }}
                            value={urlBox ? avatarSrc : 'non'}
                            control={<Radio id="ct-url" />}
                            label={
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                    }}
                                >
                                    {!urlBox && (
                                        <Typography variant="h6" sx={{ opacity: 0.5 }}>
                                            Customs avatar
                                        </Typography>
                                    )}
                                    {urlBox && (
                                        <MyTextField
                                            sx={{
                                                width: '100%',
                                                '& label': {
                                                    lineHeight: 1,
                                                },

                                                '& input': {
                                                    padding: '5px 14px',
                                                },
                                            }}
                                            label="Enter avatar url"
                                            size="small"
                                            type="text"
                                            value={avatarSrc}
                                            onChange={(e) => {
                                                let letter = e.target.value;
                                                if (!letter.startsWith(' ')) {
                                                    setAvatarSrc(letter);
                                                }
                                            }}
                                        />
                                    )}
                                </Box>
                            }
                        />
                    </RadioGroup>

                    <Button primary className={cx('auth-btn')} type="submit" onClick={handleSubmit}>
                        Submit
                    </Button>
                </FormControl>
            </div>
        </div>
    );
}

export default EditInfoUser;
