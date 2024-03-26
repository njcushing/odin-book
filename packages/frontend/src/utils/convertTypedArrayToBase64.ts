const convertTypedArrayToBase64 = (arr: number[]) => {
    return btoa(String.fromCharCode.apply(null, arr));
};

export default convertTypedArrayToBase64;
