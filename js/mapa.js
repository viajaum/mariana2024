const mapa = L.map('map', {
  attributionControl: false
}).setView([-30.09,-52.90702], 10);

L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  maxZoom: 20
}).addTo(mapa);

function entrarTelaCheia() {
  const elemento = document.documentElement;
  if (elemento.requestFullscreen) {
    elemento.requestFullscreen();
  } else if (elemento.mozRequestFullScreen) {
    elemento.mozRequestFullScreen();
  } else if (elemento.webkitRequestFullscreen) {
    elemento.webkitRequestFullscreen();
  } else if (elemento.msRequestFullscreen) {
    elemento.msRequestFullscreen();
  }
}

function sairTelaCheia() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

const fullscreenBtn = document.getElementById('fullscreen-btn');
fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    entrarTelaCheia();
  } else {
    sairTelaCheia();
  }
});

const arquivos = [
  { nome: "mariana.csv", cor: "#72386e" },
];

const camadasLocais = L.layerGroup();
const listaLocais = [];

arquivos.forEach(arquivo => {
  Papa.parse(`data/${arquivo.nome}`, {
    download: true,
    header: true,
    delimiter: ";",
    complete: function(results) {
      results.data.forEach(linha => {
        const votos = parseInt(linha.Votos);
        const lat = parseFloat(linha.Latitude);
        const lon = parseFloat(linha.Longitude);
      
        if (!isNaN(lat) && !isNaN(lon) && !isNaN(votos) && votos > 0) {
          // marcador visual
          const visual = L.circleMarker([lat, lon], {
            radius: Math.sqrt(votos) * 3,
            color: arquivo.cor,
            fillColor: arquivo.cor,
            fillOpacity: 0.9,
            weight: 1
          }).addTo(camadasLocais);
      
          // marcador invisível clicável
          const markerInvisivel = L.marker([lat, lon], {
            icon: L.divIcon({
              className: 'invisivel',
              html: '',
              iconSize: [30, 30], // aumenta a área clicável
              iconAnchor: [15, 15] // centraliza a área no ponto
            })
          }).addTo(camadasLocais);
          
          markerInvisivel.bindPopup(`<strong>${linha.Local}</strong><br>Votos: ${votos}<br>`);
      
          listaLocais.push({
            nome: linha.Local,
            votos: votos,
            lat: lat,
            lon: lon
          });
        }
      });
      

      gerarListaDeLocais();
    }
  });
});

function gerarListaDeLocais() {
  listaLocais.sort((a, b) => b.votos - a.votos);
  const lista = document.getElementById("municipios-list");
  lista.innerHTML = "";
  listaLocais.forEach(local => {
    const li = document.createElement("li");
    li.textContent = `${local.nome} | ${local.votos}`;
    li.style.cursor = "pointer";
    li.onclick = () => {
      mapa.setView([local.lat, local.lon], 17);
    };
    lista.appendChild(li);
  });
}

mapa.addLayer(camadasLocais);
