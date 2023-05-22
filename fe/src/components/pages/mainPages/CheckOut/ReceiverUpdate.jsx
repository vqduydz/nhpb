import ClearIcon from '@mui/icons-material/Clear';
import { Box, Snackbar, Typography } from '@mui/material';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { unwrapResult } from '@reduxjs/toolkit';
import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { tphcm } from '_/data/data';
import useDebounce from '_/hook/useDebounce';
import { login, updateUser } from '_/redux/slices';
import { capitalize } from '_/utills';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import DropDown from '../../Test/DropDown';

const ReceiverUpdate = ({ updateModel, setUpdateModel, setReceiver }) => {
    const dispatch = useDispatch();
    const { setSnackbar, currentUser, token } = useAuth();
    const { setLoading } = useThemMui();
    const [libraries] = useState(['places']);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });
    // eslint-disable-next-line no-unused-vars
    const [districts, setDistricts] = useState(
        tphcm.districts.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        }),
    );

    const [searchValue, setSearchValue] = useState('');
    const debounce = useDebounce(searchValue, 500);
    const [districtSelect, setDistrictSelect] = useState(
        updateModel.orderer ? currentUser.district : districts[0].name,
    );
    const [wardList, setWardList] = useState([]);
    const [wardSelect, setWardSelect] = useState('');
    const [addressList, setAddressList] = useState([]);
    const [addressSelect, setAddressSelect] = useState('');
    const [position, setPosition] = useState();

    const GOONG_API_KEY = process.env.REACT_APP_GOONG_API_KEY;

    const handleMarkerDragEnd = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setPosition({ lat, lng });
    };

    useEffect(() => {
        if (isLoaded) {
            const address = currentUser.address || `${wardSelect}, ${districtSelect}, ${tphcm.name}` || tphcm.name;
            const url = `https://rsapi.goong.io/geocode?address=${address}&api_key=${GOONG_API_KEY}`;

            axios.get(url).then((res) => {
                const position = res.data.results[0].geometry.location;
                setPosition(position);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, wardSelect, districtSelect]);

    useEffect(() => {
        if (!districtSelect) return;
        const district = { ...districts.filter((district) => district.name === districtSelect)[0] };
        const wardList = district.wards.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        setWardSelect(wardList[0].name);
        setWardList(wardList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [districtSelect]);

    const handleUpdate = async (event) => {
        event.preventDefault();

        // setLoading(true);
        const data = new FormData(event.currentTarget);
        if (updateModel.orderer) {
            try {
                const dataUpdate = {
                    id: currentUser.id,
                    address: `${addressSelect}, ${wardSelect}, ${districtSelect}, ${tphcm.name}`,
                    position: JSON.stringify(position),
                };

                dispatch(updateUser(dataUpdate))
                    .then(unwrapResult)
                    .then(() => {
                        dispatch(login(token))
                            .then(unwrapResult)
                            .then(() => {
                                setLoading(false);
                                setUpdateModel(false);
                            })
                            .catch((e) => {
                                setLoading(false);
                                const message = e.errorMessage;
                                setSnackbar({ open: true, message: message, status: 'error' });
                            });
                    })
                    .catch((e) => {
                        setLoading(false);
                        const message = e.errorMessage;
                        setSnackbar({ open: true, message: message, status: 'error' });
                    });

                return;
            } catch (error) {}
        }
        const name = capitalize(data.get('name'));
        const phoneNumber = data.get('phoneNumber');
        // setLoading(false);
        setReceiver({
            status: true,
            name,
            phoneNumber,
            address: `${addressSelect}, ${wardSelect}, ${districtSelect}, ${tphcm.name}`,
            position,
        });
        setUpdateModel(false);
    };
    // map
    useEffect(() => {
        if (!debounce.trim()) return;
        if (!debounce || !wardSelect) return;
        const place = `${debounce},${wardSelect}, ${districtSelect}, ${tphcm.name}`;
        const url = `https://rsapi.goong.io/geocode?address=${place}&api_key=${GOONG_API_KEY}`;
        axios.get(url).then((res) => {
            const position = res.data.results[0].geometry.location;
            const { address_components } = res.data.results[0];
            const addressComp = address_components
                .slice(0, 2)
                .map((item) => item.long_name)
                .join(' ');
            setAddressList([searchValue, addressComp]);
            setPosition(position);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounce]);

    useEffect(() => {
        setSearchValue('');
    }, [wardSelect, districtSelect]);

    return (
        <Box
            sx={{
                '& .MuiSnackbar-anchorOriginTopCenter': {
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: '100%',
                    '& .MuiAlert-root': {
                        flexDirection: 'column',
                        alignItems: 'center',
                        fontSize: '2rem',
                        '& .MuiSvgIcon-root': { fontSize: '2.5rem' },
                        '& .MuiAlert-action': { display: 'none' },
                    },
                },
            }}
        >
            <Snackbar
                // TransitionComponent={TransitionDown}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={updateModel.orderer || updateModel.receiver}
                onClose={() => {
                    setUpdateModel(false);
                }}
            >
                <Box
                    sx={{
                        backgroundColor: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        alignItems: 'center',
                        boxShadow: '0 0 10px 5px #00000012',
                        width: '100%',
                        maxWidth: '768px',
                        position: 'relative',
                    }}
                >
                    <MyButton
                        style={{
                            borderRadius: '50%',
                            padding: '0 0',
                            position: 'absolute',
                            right: '10px',
                            top: '10px',
                        }}
                        color={{ bgColor: '#fe2c55', mainColor: '', subColor: '' }}
                        className="action"
                        onClick={() => {
                            setUpdateModel(false);
                        }}
                    >
                        <ClearIcon />
                    </MyButton>
                    <form
                        autoComplete="off"
                        onSubmit={handleUpdate}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            width: '100%',
                            maxWidth: '768px',
                            padding: '20px 30px',
                        }}
                    >
                        <Typography fontSize={'2rem'} fontWeight={700}>
                            {updateModel.receiver ? 'CẬP NHẬT THÔNG TIN NGƯỜI NHẬN' : 'CẬP NHẬT ĐỊA CHỈ GIAO HÀNG'}
                        </Typography>

                        {updateModel.receiver && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '10px',
                                    alignItems: 'center',
                                    flexDirection: { 0: 'column', 768: 'row' },
                                }}
                            >
                                <MyTextField
                                    sx={{ marginTop: '15px' }}
                                    size="small"
                                    label="Nhập họ & tên người nhận"
                                    required
                                    fullWidth
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoFocus
                                />
                                <MyTextField
                                    sx={{ marginTop: '15px' }}
                                    size="small"
                                    label="Nhập số điện thoại người nhận"
                                    fullWidth
                                    name="phoneNumber"
                                    type="number"
                                    id="phoneNumber"
                                    required
                                />
                            </Box>
                        )}
                        <Typography fontWeight={500} fontSize={'1.4rem'}>
                            Hiện tại Nhà hàng Phố Biển chỉ giao hàng tại {districts.map((d) => d.name).join(', ')} trong{' '}
                            {tphcm.name}.
                        </Typography>
                        <Box
                            sx={{
                                marginTop: '15px',
                                display: 'flex',
                                gap: '5px',
                                alignItems: 'center',
                                flexDirection: { 0: 'column', 768: 'row' },
                            }}
                        >
                            <MyTextField
                                required
                                size="small"
                                label="Tỉnh/Thành Phố"
                                fullWidth
                                name="provine"
                                type="text"
                                id="provine"
                                defaultValue="TP. Hồ Chí Minh"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />

                            <DropDown
                                dropList={districts.map((district) => district.name)}
                                result={districtSelect}
                                setResult={setDistrictSelect}
                            />

                            <DropDown
                                dropList={wardList.map((ward) => ward.name)}
                                result={wardSelect}
                                setResult={setWardSelect}
                            />
                        </Box>

                        <DropDown
                            input={{
                                status: true,
                                inputLabel: 'Nhập địa chỉ',
                                setSearchValue: setSearchValue,
                                searchValue: searchValue,
                            }}
                            dropList={addressList}
                            result={addressSelect}
                            setResult={setAddressSelect}
                        />

                        <GoogleMap mapContainerStyle={{ height: '500px', width: '100%' }} center={position} zoom={20}>
                            <MarkerF
                                position={currentUser.position || position}
                                draggable
                                onDragEnd={handleMarkerDragEnd}
                            />
                        </GoogleMap>

                        <Box
                            sx={{
                                mt: '10px',
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '10px',
                                '& .action': {
                                    padding: '5px 15px',
                                },
                            }}
                        >
                            <MyButton
                                type="submit"
                                color={{ bgColor: 'green', mainColor: '', subColor: '' }}
                                className="action"
                                onClick={() => {}}
                            >
                                Xác nhận
                            </MyButton>
                        </Box>
                    </form>
                </Box>
            </Snackbar>
        </Box>
    );
};

export default ReceiverUpdate;
