const axios = require('axios');
const parser = require('fast-xml-parser');
const got = require('got');
const fs = require('fs');

module.exports = () => {
    return new Promise(async (resolve, reject) => {
        // Descargamos la información de la páginas de las cámaras
        const { data } = await axios.get('https://datos.madrid.es/egob/catalogo/202088-0-trafico-camaras.kml');

        // Recuperamos el array con todas las cámaras
        const { kml: { Document: { Placemark: arrPlacemarks } } } = parser.parse(data);

        // Seleccionamos una cámara aleatoria
        const randomNum = Math.floor(Math.random() * arrPlacemarks.length);
        const camaraSeleccionada = arrPlacemarks[randomNum];

        const camName = camaraSeleccionada.ExtendedData.Data[1].Value;

        // Recuperamos la url de la imagen desde la descripción
        const urlStartIndex = camaraSeleccionada.description.indexOf('img src=') + 8;
        const urlEndIndex = camaraSeleccionada.description.indexOf(' ', urlStartIndex);
        const urlImage = camaraSeleccionada.description.substring(urlStartIndex, urlEndIndex);

        const nombre = urlImage.substring(urlImage.indexOf('Camara'), urlImage.indexOf('.jpg'));

        resolve({ name: nombre, url: urlImage, camName: camName });
        // Descarga la imagen
        //const { body } = await got(urlImage, { responseType: 'buffer' });
        //fs.appendFileSync(`./images/${nombre}.jpg`, body);
    });


}