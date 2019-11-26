var enderecoContrato = "0x53C34f4897a4111f9299a9b734aD1d5c380a8Ce5";
var provedor = new ethers.providers.Web3Provider(web3.currentProvider); // provedor Web3
ethereum.enable(); // confirma habilitação do ethereum
var signatario = provedor.getSigner(); // disponibiliza as funções de assinatura de transação
var contrato = new ethers.Contract(enderecoContrato, abiContrato, signatario); // passa o signatário do contrato em vez do provedor, pois é ele que realiza a transação

function registrarMudancaStatus() {
    var textoCampo = document.frmStatus.txtStatusPagamentoAluguel.value; //valor>do txt>no form>no doc
    var caixaStatusTx = document.getElementById("caixaStatusTx");
    if (textoCampo.length === 8) { // checa se o valor que quero enviar está correto
        caixaStatusTx.innerHTML = "Enviando transação...";
        contrato.mudaStatusPagamento(textoCampo) //chama função dentro do contrato. "textoCampo" é o parâmetro utilizado pela função no contrato
        .then( (transacao) => {       //promessa: mudança status. transação é um parâmetro.
            console.log("registrarMudancaStatus - Transacao ", transacao);   //recibo no console
            caixaStatusTx.innerHTML = "Transação enviada. Aguardando processamento...";
            transacao.wait()
            .then( (resultado) => {
                buscaStatusContrato();
                caixaStatusTx.innerHTML = "Transação realizada.";
            })        
            .catch( (err) => {
                console.error("registrarMudancaStatus - Aguardando tx ser minerada");
                console.error(err);
                caixaStatusTx.innerHTML = "Algo saiu errado: " + err.message;
            })
        })
        .catch( (err) => {
            console.error("registrarMudancaStatus");
            console.error(err);
            caixaStatusTx.innerHTML = "Algo saiu errado: " + err.message;
        })
    }
}

function buscaStatusContrato() {
    var status;
    var campoStatus = document.getElementById("campoStatus");     
    contrato.statusPagamentoAluguel()
    .then( (resultado) => {
        campoStatus.innerHTML = resultado;
    })
    .catch( (err) => {
        console.error(err);
        campoStatus.innerHTML = err;
    });
   
}
