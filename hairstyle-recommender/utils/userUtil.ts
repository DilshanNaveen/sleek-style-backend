export const getUUID = async () => {
    const response = await fetch('https://www.uuidgenerator.net/api/version4');
    return response.json();
};