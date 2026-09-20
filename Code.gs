function doGet(e) {
  return HtmlService.createTemplateFromFile('APPOnibus')
    .evaluate()
    .setTitle('Transporte JBS')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag(
      'viewport',
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    );
}

/**
 * Permite incluir outros arquivos HTML (como o CSS) dentro de APPOnibus.html
 * usando a sintaxe: <?!= include('CssEstilo'); ?>
 * Necessário para o template funcionar com createTemplateFromFile().
 */
function include(nomeArquivo) {
  return HtmlService.createHtmlOutputFromFile(nomeArquivo).getContent();
}


/**
 * Converte um endereço em coordenadas usando Nominatim.
 * Faz uma busca principal pelo endereço completo e, caso falhe (devido a número predial ausente no OSM),
 * tenta automaticamente uma segunda busca apenas pelo nome da rua/cidade.
 */
function geocodeEndereco(endereco) {
  if (!endereco || !String(endereco).trim()) return null;

  try {
    // 1ª Tentativa: Endereço completo com número
    var coords = consultarNominatim(endereco);
    if (coords) return coords;

    // 2ª Tentativa: Remove números e caracteres especiais e tenta novamente (Fallback)
    var enderecoSemNumero = String(endereco)
      .replace(/Rua:|Av:|Avenida:|Praça:/gi, '')
      .replace(/\sx\s/gi, ' e ')
      .replace(/\d+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (enderecoSemNumero !== endereco) {
      return consultarNominatim(enderecoSemNumero);
    }
  } catch (err) {
    console.error('Erro no geocode: ' + err);
  }

  return null;
}

/**
 * Função auxiliar para requisição ao Nominatim
 */
function consultarNominatim(query) {
  var url =
    'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=' +
    encodeURIComponent(query);

  var options = {
    method: 'get',
    headers: {
      'User-Agent': 'TransporteJBSApp/1.0 (Google Apps Script)'
    },
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  var status = response.getResponseCode();

  if (status >= 200 && status < 300) {
    var data = JSON.parse(response.getContentText());
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
  }
  return null;
}

/**
 * Obtém uma rota aproximada entre o usuário e o ponto.
 */
function obterRota(lat1, lng1, lat2, lng2) {
  try {
    var url =
      'https://router.project-osrm.org/route/v1/driving/' +
      encodeURIComponent(lng1) + ',' + encodeURIComponent(lat1) + ';' +
      encodeURIComponent(lng2) + ',' + encodeURIComponent(lat2) +
      '?overview=full&geometries=geojson';

    var response = UrlFetchApp.fetch(url, {
      method: 'get',
      muteHttpExceptions: true
    });

    var status = response.getResponseCode();
    if (status < 200 || status >= 300) return null;

    var data = JSON.parse(response.getContentText());

    if (
      data &&
      data.routes &&
      data.routes.length > 0 &&
      data.routes[0].geometry &&
      data.routes[0].geometry.coordinates
    ) {
      return {
        coordinates: data.routes[0].geometry.coordinates
      };
    }
  } catch (err) {
    console.error('Erro na rota: ' + err);
  }

  return null;
}


