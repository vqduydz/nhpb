const capitalize = (str) => {
    return str.toLowerCase().replace(/(^|\s)\S/g, (str) => {
        return str.toUpperCase();
    });
};
export default capitalize;
