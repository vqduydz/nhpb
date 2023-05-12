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
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import DistrictDrop from './DistrictDrop';
import WardDrop from './WardDrop';
import axios from 'axios';
import AddressDrop from './AddressDrop';

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

    const districts = tphcm.districts.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });

    const [searchValue, setSearchValue] = useState('');
    const debounce = useDebounce(searchValue, 500);
    const [districtSelect, setDistrictSelect] = useState('');
    const [wardSelect, setWardSelect] = useState('');
    const [wardList, setWardList] = useState([]);
    const [addressList, setAddressList] = useState([]);
    const [position, setPosition] = useState(null);
    const [receiverUpdate, setReceiverUpdate] = useState({
        name: '',
        phoneNumber: '',
        address: {
            specificAddress: '',
            ward: '',
            district: '',
        },
        specificPosition: position,
    });
    const receiverUpdateMeno = useMemo(() => receiverUpdate, [receiverUpdate]);
    const { name, phoneNumber, address, specificPosition } = receiverUpdateMeno;

    const GOONG_API_KEY = process.env.REACT_APP_GOONG_API_KEY;

    const handleMarkerDragEnd = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setReceiverUpdate({ ...receiverUpdateMeno, specificPosition: { lat, lng } });
    };

    useEffect(() => {
        if (isLoaded) {
            const address = currentUser.address || tphcm.name;
            const url = `https://rsapi.goong.io/geocode?address=${address}&api_key=${GOONG_API_KEY}`;

            axios.get(url).then((res) => {
                const position = res.data.results[0].geometry.location;
                setPosition(position);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded]);

    useEffect(() => {
        setWardList([]);

        if (!districtSelect) return;

        setWardList(
            districtSelect.wards.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            }),
        );
    }, [districtSelect]);
    const handleUpdate = async (event) => {
        event.preventDefault();
        setLoading(true);
        const data = new FormData(event.currentTarget);
        const address = capitalize(data.get('address'));
        if (updateModel.orderer) {
            try {
                const dataUpdate = {
                    id: currentUser.id,
                    address: `${address}, ${wardSelect}, ${districtSelect.name}, ${tphcm.name}`,
                    position: JSON.stringify(position) || JSON.stringify(specificPosition),
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
        setLoading(false);
        setReceiver({
            status: true,
            name,
            phoneNumber,
            address: `${address}, ${wardSelect}, ${districtSelect.name}, ${tphcm.name}`,
            position: specificPosition,
        });
        setUpdateModel(false);
    };

    // map
    useEffect(() => {
        if (!address.specificAddress || !address.ward || !address.district) return;
        const place = `${address.specificAddress},${address.ward}, ${address.district}, ${tphcm.name}`;
        const url = `https://rsapi.goong.io/geocode?address=${place}&api_key=${GOONG_API_KEY}`;
        axios.get(url).then((res) => {
            const position = res.data.results[0].geometry.location;
            const { address_components } = res.data.results[0];
            const addressComp = address_components
                .slice(0, 2)
                .map((item) => item.long_name)
                .join(' ');

            setAddressList([address.specificAddress, addressComp]);
            setPosition(position);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    const handleChangeName = (e) => {
        const name = capitalize(e.target.value);
        setReceiverUpdate({ ...receiverUpdateMeno, name });
    };

    useEffect(() => {
        if (!debounce.trim()) return;
        setReceiverUpdate({
            ...receiverUpdateMeno,
            address: {
                ...receiverUpdateMeno.address,
                specificAddress: debounce,
            },
            specificPosition: null,
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounce]);

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
                                    onChange={handleChangeName}
                                    sx={{ marginTop: '15px' }}
                                    size="small"
                                    label="Nhập họ & tên người nhận"
                                    required
                                    fullWidth
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoFocus
                                    value={name}
                                />
                                <MyTextField
                                    onChange={(e) =>
                                        setReceiverUpdate({ ...receiverUpdateMeno, phoneNumber: e.target.value })
                                    }
                                    sx={{ marginTop: '15px' }}
                                    size="small"
                                    label="Nhập số điện thoại người nhận"
                                    fullWidth
                                    name="phoneNumber"
                                    type="number"
                                    id="phoneNumber"
                                    required
                                    value={phoneNumber}
                                />
                            </Box>
                        )}
                        <Typography fontWeight={500} fontSize={'1.4rem'}>
                            Hiện tại Nhà hàng Phố Biển chỉ giao hàng tại {districts.map((d) => d.name).join(', ')} trong{' '}
                            {tphcm.name}.
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '5px',
                                alignItems: 'center',
                                flexDirection: { 0: 'column', 768: 'row' },
                            }}
                        >
                            <MyTextField
                                required
                                sx={{ marginTop: '15px' }}
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
                            <DistrictDrop
                                districts={districts}
                                setDistrictSelect={setDistrictSelect}
                                setReceiverUpdate={setReceiverUpdate}
                                setSearchValue={setSearchValue}
                                receiverUpdateMeno={receiverUpdateMeno}
                            />
                            <WardDrop
                                wardList={wardList}
                                districtSelect={districtSelect}
                                setWardSelect={setWardSelect}
                                setReceiverUpdate={setReceiverUpdate}
                                setSearchValue={setSearchValue}
                                receiverUpdateMeno={receiverUpdateMeno}
                            />
                        </Box>
                        <AddressDrop
                            setSearchValue={setSearchValue}
                            searchValue={searchValue}
                            addressList={addressList}
                            setReceiverUpdate={setReceiverUpdate}
                            receiverUpdateMeno={receiverUpdateMeno}
                        />

                        <GoogleMap
                            mapContainerStyle={{ height: '500px', width: '100%' }}
                            center={specificPosition || position}
                            zoom={20}
                        >
                            <MarkerF
                                position={specificPosition || position}
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
