//VARIAVEIS


const tempElement = document.querySelector('#tempLocal');

//FUNÇÕES
document.getElementById('infoForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o envio do formulário

    const cepInput = document.getElementById('cepInput');
    const cep = cepInput.value;



    // Verifica se o CEP está vazio
    if (cep.trim() === '') {
        alert("CEP não pode estar em branco.");
        // Continua com as outras funções mesmo que o CEP esteja em branco
    } else if (!validarCEP(cep)) {
        alert("Formato inválido de CEP. Coloque apenas os 8 números sem o traço.");
        // Continua com as outras funções mesmo que o formato do CEP seja inválido
    } else {
        try {
            const cepInfo = await buscarCEP(cep);
            if (cepInfo.erro) {
                alert("CEP não encontrado.");
                // Continua com as outras funções mesmo que o CEP não seja encontrado
            } else {
                alterarInformacoesEndereco(cepInfo);
            }
        } catch (error) {
            alert("Ocorreu um erro ao buscar informações do CEP:", error);
        }
    }

    // Continua com a busca de temperatura mesmo que ocorra um erro nas informações do CEP
    const latitudeInput = document.getElementById('coordenadas_Latitude');
    const longitudeInput = document.getElementById('coordenadas_Longitude');
    const latitude = parseFloat(latitudeInput.value);
    const longitude = parseFloat(longitudeInput.value);

    // Verifica se as coordenadas estão vazias
    if (isNaN(latitude) || isNaN(longitude)) {
        alert("Latitude ou longitude não podem estar em branco.");
        return; // Encerra a função se as coordenadas estiverem em branco
    }

    // Validação das coordenadas
    if (!isFinite(latitude) || !isFinite(longitude)) {
        alert("Latitude ou longitude inválida.");
        return; // Encerra a função se as coordenadas forem inválidas
    }

    try {
        const temperatura = await buscarTemperatura(latitude, longitude);
        console.log("Temperatura na região:", temperatura);

        const tempSpan = document.getElementById('tempLocal');
        tempSpan.textContent = `Previsão de tempo de acordo com a região: ${temperatura}° C`;

    } catch (error) {
        alert("Ocorreu um erro ao buscar temperatura:", error);
    }
});

function validarCEP(cep) {
    // Expressão regular para validar o formato do CEP (8 dígitos)
    const regexCEP = /^[0-9]{8}$/;
    return regexCEP.test(cep);
}

async function buscarCEP(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        verificarStatusHTTP(response);
        if (!response.ok) {
            throw new Error('Erro ao buscar CEP');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

function alterarInformacoesEndereco(cepInfo) {
    const logradouroSpan = document.getElementById('logradouro');
    const bairroSpan = document.getElementById('bairro');
    const estadoSpan = document.getElementById('estado');

    logradouroSpan.textContent = cepInfo.logradouro;
    bairroSpan.textContent = cepInfo.bairro;
    estadoSpan.textContent = `${cepInfo.localidade}/${cepInfo.uf}`;
}

async function buscarTemperatura(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`;

    try {
        const response = await fetch(url);
        verificarStatusHTTP(response);
        if (!response.ok) {
            throw new Error('Erro ao buscar temperatura');
        }
        const data = await response.json();
        // Ajuste na forma de acessar o valor da temperatura
        return data.hourly.temperature_2m[0]; // Assumindo que temperature_2m é um array de temperaturas
    } catch (error) {
        alert("Erro ao buscar temperatura:", error);
    }
}

function verificarStatusHTTP(response) {
    if (!response.ok) {
        throw new Error(`Erro na requisição: Status ${response.status}`);
    } else {
        console.log('Código HTTP 200 ok')
    }
}