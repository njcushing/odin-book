const convertArrayBufferToBase64 = async (buffer: ArrayBuffer): Promise<string> => {
    const base64url: string = await new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(new Blob([buffer]));
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.onerror = (error) => reject(error);
    });
    return base64url.slice(base64url.indexOf(",") + 1); // trim `data:...;base64,` from start
};

export default convertArrayBufferToBase64;
