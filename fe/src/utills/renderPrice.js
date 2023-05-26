const renderPrice = (price) => {
    if (isNaN(price)) return;
    const options = { style: 'currency', currency: 'VND' };
    return `${price.toLocaleString('vi-VN', options)}`;
};

export default renderPrice;
