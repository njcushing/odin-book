const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

const isStringBase64 = (value: string): boolean => {
    return base64regex.test(value);
};

export default isStringBase64;
