const convertArrayBufferToBase64 = async (buffer: ArrayBuffer): Promise<string> => {
    const base64url: string = await new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(new Blob([buffer]));
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.onerror = (error) => reject(error);
    });
    return base64url;
};

export default convertArrayBufferToBase64;
