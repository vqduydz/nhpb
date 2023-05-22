// import classNames from 'classnames/bind';

// import { useDataStore } from '_/contexts/DataStoreContext';

// import { ForgotPassword, Login, Register } from '_/pages';
// import EditInfoUser from '_/utils/Auth/EditInfoUser';
// import Button from '../Button/Button';

// import styles from './Modal.module.scss';
// import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
// import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
// import removeVietnameseTones from '_/utills/removeVietnameseTones';

// const cx = classNames.bind(styles);

// Modal.propTypes = {};

// function Modal() {

//     return (
//         <div className={cx('wrapper')}>
//             <div onClick={handleHideModal} className={cx('overlay')}></div>
//             <div className={cx('inner')}>
//             <div className={cx('auth-wrapper')}>
//             <div className={cx('auth-form-wrapper')}>
//                 <h1 className={cx('auth-h1')}>EditInfoUser</h1>

//                 <FormControl fullWidth onSubmit={handleSubmit}>
//                     <MyTextField
//                         label="Phone Number"
//                         className={cx('auth-input')}
//                         size="small"
//                         type="text"
//                         value={phoneNumber}
//                         onChange={(e) => {
//                             let letter = e.target.value;
//                             if (!letter.startsWith(' ')) {
//                                 letter = removeVietnameseTones(letter).replace(/-|[A-z]/g, '');
//                                 setMobileNumber(letter.replace(/ /g, '').replace(/-/g, '').trim());
//                             }
//                         }}
//                     />
//                     <div>
//                         <MyTextField
//                             label="Year of Birth (YYYY)"
//                             className={cx('auth-input')}
//                             size="small"
//                             type="text"
//                             value={birthYear}
//                             onChange={(e) => {
//                                 let letter = e.target.value;
//                                 if (!letter.startsWith(' ')) {
//                                     letter = removeVietnameseTones(letter)
//                                         .replace(/-|[A-z]/g, '')
//                                         .replace(/ /g, '')
//                                         .replace(/-/g, '')
//                                         .trim()
//                                         .slice(0, 4);
//                                     const currentYear = Number(new Date().getFullYear());
//                                     if (Number(letter) > currentYear) letter = currentYear.toString();
//                                     setbirthYear(letter);
//                                 }
//                             }}
//                         />
//                     </div>

//                     <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>

//                     <RadioGroup
//                         row
//                         aria-labelledby="demo-row-radio-buttons-group-label"
//                         name="row-radio-buttons-group"
//                         value={gender}
//                         onChange={(e) => {
//                             const value = e.target.value;
//                             setGender(value);
//                         }}
//                     >
//                         <FormControlLabel
//                             value="Female"
//                             control={<Radio />}
//                             label={
//                                 <Box
//                                     sx={{
//                                         textAlign: 'center',
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         justifyContent: 'center',
//                                         flexDirection: 'column',
//                                     }}
//                                 >
//                                     <Typography variant="h6">Female</Typography>
//                                 </Box>
//                             }
//                         />
//                         <FormControlLabel
//                             value="Male"
//                             control={<Radio />}
//                             label={
//                                 <Box
//                                     sx={{
//                                         textAlign: 'center',
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         justifyContent: 'center',
//                                         flexDirection: 'column',
//                                     }}
//                                 >
//                                     <Typography variant="h6">Male</Typography>
//                                 </Box>
//                             }
//                         />
//                         <FormControlLabel
//                             value="Orther"
//                             control={<Radio />}
//                             label={
//                                 <Box
//                                     sx={{
//                                         textAlign: 'center',
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         justifyContent: 'center',
//                                         flexDirection: 'column',
//                                     }}
//                                 >
//                                     <Typography variant="h6">Other</Typography>
//                                 </Box>
//                             }
//                         />
//                     </RadioGroup>

//                     <FormLabel id="demo-row-radio-buttons-group-label">Customs Avatar</FormLabel>

//                     <RadioGroup
//                         sx={{
//                             display: 'flex',
//                             flexDirection: 'column',
//                         }}
//                         row
//                         aria-labelledby="demo-row-radio-buttons-group-label"
//                         name="row-radio-buttons-group"
//                         value={urlBox ? avatarSrc : avatar}
//                         onChange={(e) => {
//                             const value = e.target.value;
//                             setAvatar(value);
//                         }}
//                     >
//                         <FormControlLabel
//                             onClick={() => {
//                                 setUrlBox(false);
//                             }}
//                             sx={{
//                                 mb: 6,
//                                 mt: 2,
//                             }}
//                             value="undefined"
//                             control={<Radio />}
//                             label={
//                                 <Box
//                                     sx={{
//                                         display: 'flex',
//                                         width: '100%',
//                                         flexDirection: 'unset',
//                                         alignItems: 'center',
//                                     }}
//                                 >
//                                     <img className={cx('avartar')} src={images.not} alt="Loading" />
//                                     <Typography variant="h6" sx={{ opacity: 0.5 }}>
//                                         default avatar
//                                     </Typography>{' '}
//                                 </Box>
//                             }
//                         />
//                         <FormControlLabel
//                             onClick={() => {
//                                 setUrlBox(false);
//                             }}
//                             sx={{
//                                 mb: 6,
//                             }}
//                             value="https://www.w3schools.com/howto/img_avatar2.png"
//                             control={<Radio />}
//                             label={
//                                 <Box
//                                     sx={{
//                                         textAlign: 'center',
//                                         justifyContent: 'center',
//                                         display: 'flex',
//                                         width: '100%',
//                                         flexDirection: 'unset',
//                                         alignItems: 'center',
//                                     }}
//                                 >
//                                     <img className={cx('avartar')} src={images.female} alt="Loading" />
//                                     <Typography variant="h6" sx={{ opacity: 0.5 }}>
//                                         Female avatar
//                                     </Typography>{' '}
//                                 </Box>
//                             }
//                         />
//                         <FormControlLabel
//                             onClick={() => {
//                                 setUrlBox(false);
//                             }}
//                             sx={{
//                                 mb: 6,
//                             }}
//                             value="https://www.w3schools.com/howto/img_avatar.png"
//                             control={<Radio />}
//                             label={
//                                 <Box
//                                     sx={{
//                                         display: 'flex',
//                                         width: '100%',
//                                         flexDirection: 'unset',
//                                         alignItems: 'center',
//                                     }}
//                                 >
//                                     <img className={cx('avartar')} src={images.male} alt="Loading" />
//                                     <Typography variant="h6" sx={{ opacity: 0.5 }}>
//                                         Male avatar
//                                     </Typography>
//                                 </Box>
//                             }
//                         />
//                         <FormControlLabel
//                             onClick={() => {
//                                 setUrlBox(true);
//                                 setAvatar('undefined');
//                             }}
//                             sx={{
//                                 mb: 6,
//                                 '& .MuiTypography-root': {
//                                     width: '100%',
//                                 },
//                             }}
//                             value={urlBox ? avatarSrc : 'non'}
//                             control={<Radio id="ct-url" />}
//                             label={
//                                 <Box
//                                     sx={{
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         justifyContent: 'center',
//                                         flexDirection: 'column',
//                                     }}
//                                 >
//                                     {!urlBox && (
//                                         <Typography variant="h6" sx={{ opacity: 0.5 }}>
//                                             Customs avatar
//                                         </Typography>
//                                     )}
//                                     {urlBox && (
//                                         <MyTextField
//                                             sx={{
//                                                 width: '100%',
//                                                 '& label': {
//                                                     lineHeight: 1,
//                                                 },

//                                                 '& input': {
//                                                     padding: '5px 14px',
//                                                 },
//                                             }}
//                                             label="Enter avatar url"
//                                             size="small"
//                                             type="text"
//                                             value={avatarSrc}
//                                             onChange={(e) => {
//                                                 let letter = e.target.value;
//                                                 if (!letter.startsWith(' ')) {
//                                                     setAvatarSrc(letter);
//                                                 }
//                                             }}
//                                         />
//                                     )}
//                                 </Box>
//                             }
//                         />
//                     </RadioGroup>

//                     <Button primary className={cx('auth-btn')} type="submit" onClick={handleSubmit}>
//                         Submit
//                     </Button>
//                 </FormControl>
//             </div>
//         </div>
//             </div>
//         </div>
//     );
// }

// export default Modal;
