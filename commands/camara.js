const axios = require('axios');
const parser = require('fast-xml-parser');
const geolib = require('geolib');

const getCams = async () => {
    // Descargamos la información de la páginas de las cámaras
    const { data } = await axios.get('https://datos.madrid.es/egob/catalogo/202088-0-trafico-camaras.kml');

    // Recuperamos el array con todas las cámaras
    const { kml: { Document: { Placemark: arrPlacemarks } } } = parser.parse(data);

    return arrPlacemarks;
}

const parseCamInfo = (description) => {
    const urlStartIndex = description.indexOf('img src=') + 8;
    const urlEndIndex = description.indexOf(' ', urlStartIndex);
    const urlImage = description.substring(urlStartIndex, urlEndIndex);

    const nombre = urlImage.substring(urlImage.indexOf('Camara'), urlImage.indexOf('.jpg'));

    return ({ name: nombre, url: urlImage });
}

const randomCam = () => {
    return new Promise(async (resolve, reject) => {
        const arrPlacemarks = await getCams();

        // Seleccionamos una cámara aleatoria
        const randomNum = Math.floor(Math.random() * arrPlacemarks.length);
        const camaraSeleccionada = arrPlacemarks[randomNum];

        const camName = camaraSeleccionada.ExtendedData.Data[1].Value;

        const camInfo = parseCamInfo(camaraSeleccionada.description);
        resolve({ ...camInfo, camName: camName });
        // Descarga la imagen
        //const { body } = await got(urlImage, { responseType: 'buffer' });
        //fs.appendFileSync(`./images/${nombre}.jpg`, body);
    });
}

const closest = (latitude, longitude) => {
    return new Promise(async (resolve, reject) => {
        const arrPlacemarks = await getCams();
        let closest = { distance: -1, cam: null };
        arrPlacemarks.forEach(placemark => {
            placemarkCoords = placemark.Point.coordinates.split(',');
            const lambdaDistance = geolib.getDistance({
                latitude: latitude, longitude: longitude
            }, {
                latitude: placemarkCoords[1], longitude: placemarkCoords[0]
            });
            if (closest.distance == -1 || lambdaDistance < closest.distance) {
                closest = { distance: lambdaDistance, cam: placemark };
            }
        });
        const camName = closest.cam.ExtendedData.Data[1].Value;
        const camInfo = parseCamInfo(closest.cam.description);
        resolve({ ...camInfo, camName: camName });
    });
}

module.exports = {
    randomCam: randomCam,
    closest: closest
}