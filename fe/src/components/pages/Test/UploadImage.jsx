import React, { useState } from 'react';
import axios from 'axios';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { MyButton } from '_/components/common';
import removeVietnameseTones from '_/utills/removeVietnameseTones';

function UploadImage() {
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const uploadImage = async (name) => {
        try {
            const formData = new FormData();
            formData.append('image', image, name);
            const url = `${process.env.REACT_APP_API_ENDPOINT}/upload`;
            await axios.post(url, formData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        const name = removeVietnameseTones(data.get('name'));
        uploadImage(name.toLowerCase().replace(/ /g, '-'));
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <MyTextField type="file" onChange={handleImageChange} />
            <MyTextField
                sx={{ marginTop: '15px' }}
                size="small"
                required
                fullWidth
                id="name"
                name="name"
                type="text"
                autoFocus
            />
            <MyButton type="submit">Upload</MyButton>
        </form>
    );
}

export default UploadImage;
