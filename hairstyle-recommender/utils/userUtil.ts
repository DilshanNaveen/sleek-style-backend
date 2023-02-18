export const getUUID = async () => {
    const response = await fetch('https://www.uuidgenerator.net/api/version4');
    console.log("response :", response);
    return response.json()[0];
};