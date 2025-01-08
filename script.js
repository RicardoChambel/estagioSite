// CARREGAR DADOS NA TABELA -----------------------------------------------
function loadTableData() {
    // (PARA DEBUG) ****
    console.log("!! LOADTABLEDATA !! ");

    const dataTable = document.getElementById('dataTable');
    const data = JSON.parse(localStorage.getItem('formData')) || [];

    if(!data || data.length == 0){ // SE NÃO HOUVER DADOS
        console.log("Nenhum dado encontrado no localStorage.");
        return; // NÃO TENTA CARREGAR A TABELA
    }

    // APAGAR A TABELA ANTES DE ADICIONAR OS NOVOS DADOS
    dataTable.innerHTML = ` 
        <tr class="tabela-main-header">
            <th><i class="fa-solid fa-trash"></i></th>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telemóvel</th>
            <th>CC</th>
            <th>localidade</th>
            <th>genero</th>
        </tr>
    `;

    // ADICIONAR AS LINHAS DA TABELA
    data.forEach((item, index) => {
        if (!item || !item.nome){
            console.warn(`Item inválido encontrado no índice ${index}.`);
            return; // SE NÃO EXISTIR NOME, NÃO ADICIONAR
        }

        const row = document.createElement('tr');
        row.className = 'tableRow';
        row.setAttribute('title', 'Clicar para editar');
        row.setAttribute('data-index', index);  // GUARDAR O INDICE DO ITEM NA LINHA PARA USAR AO CLICAR
        row.innerHTML = `
            <td><button title="Apagar Dados" id="tabelaBTN-remover-${index}" class="tabelaBTN-remover"><i class="fa-solid fa-xmark"></i></button></td>
            <td>${index}</td>
            <td>${item.nome}</td>
            <td>${item.email}</td>
            <td>${item.tele}</td>
            <td>${item.cc}</td>
            <td>${item.localidade}</td>
            <td>${item.genero}</td>
        `;

        // Adicionar o listener para o botão de remover
        const removeButton = row.querySelector(`#tabelaBTN-remover-${index}`);
        removeButton.addEventListener('click', (event) => {
            event.stopPropagation();  // IMPEDIR QUE O LISTENER DO ROW ACONTEÇA
            removeData(index); // REMOVER OS DADOS DA PESSOA "SELECIONADA"
        });

        row.addEventListener('click', () => fillFormWithData(index));  // ADICIONAR LISTENER PARA PREENCHER O FORMULÁRIO COM OS DADOS DA LINHA CLICADA
        dataTable.appendChild(row);
    });
    document.getElementById('updateBtn').style.display="none";// ESCONDER O BOTÃO DE ATUALIZAR
    document.getElementById('cancelarBtn').style.display="none";// ESCONDER O BOTÃO DE CANCELAR
}



// APAGAR DADOS DO LOCALSTORAGE -----------------------------------------------
function removeData(index){
    // (PARA DEBUG) ****
    console.log("!! REMOVEDATA !! ");
    
    const data = JSON.parse(localStorage.getItem('formData')) || [];

    data.splice(index, 1); // APAGAR PELO INDICE

    localStorage.setItem('formData', JSON.stringify(data)); // ATUALIZAR O LOCALSTORAGE

    if(index==0 && data.length==0 ){ // SE FOR O UNICO ELEMENTO NA TABELA
        window.location.reload(); // RECARREGAR A PÁGINA
    }

    loadTableData(); // CARREGAR OUTRA VEZ OS DADOS NA TABELA

    
    form = document.getElementById('form');
    form.reset();// APAGAR O FORMULÁRIO
    document.getElementById('updateBtn').style.display="none";// ESCONDER O BOTÃO DE ATUALIZAR
    document.getElementById('cancelarBtn').style.display="none";// ESCONDER O BOTÃO DE CANCELAR

}

// PREENCHER O FORMULÁRIO (A PARTIR DO INDICE DA PESSOA) -----------------------------------------------
function fillFormWithData(index) {
    // (PARA DEBUG) ****
    console.log("!! FILLFORMWITHDATA !! ");

    const data = JSON.parse(localStorage.getItem('formData')) || [];
    const item = data[index];

    // PREENCHER O FORMULÁRIO COM OS DADOS DA PESSOA
    document.getElementById('id').value = index;
    document.getElementById('nome').value = item.nome;
    document.getElementById('email').value = item.email;
    newGenero = item.genero;
    console.log(item.genero)
    if(newGenero == "M"){
        document.getElementById('masculino').click();
    }else if(newGenero == "F"){
        document.getElementById('feminino').click();
    }else{
        document.getElementById('outro').click();
    }
    document.getElementById('tele').value = item.tele;
    document.getElementById('cc').value = item.cc;
    document.getElementById('localidade').value = item.localidade;

    // ADICIONAR UM ATRIBUTO AO FORMULÁRIO PARA INDICAR QUE ESTÁ A EDITAR DADOS DE UMA PESSOA SELECIONADA
    document.getElementById('form').setAttribute('data-edit-index', index);

    // MOSTRAR O BOTÃO DE ATUALIZAR E O BOTÃO DE CANCELAR
    document.getElementById('updateBtn').style.display="block";
    document.getElementById('cancelarBtn').style.display="block";
}

// GUARDAR DADOS NO LOCALSTORAGE -----------------------------------------------
function saveData(event) {
    // (PARA DEBUG) ****
    console.log("!! SAVEDATA !! ");
    
    event.preventDefault();// PREVENIR O FORMULÁRIO DE DAR RESET À PÁGINA AO SUBMETER

    const form = document.getElementById('form');
    if(!form){
        console.error("Não há nenhum elemento com seguinte id -> form !");
        return;
    }

    /* PARA TRANSFORMAR "MASCULINO", "FEMININO" E "OUTRO" EM "M" "F" E "O"*/
    if(form.genero.value == "masculino"){
        newGenero = "M";
    }else if(form.genero.value == "feminino"){
        newGenero = "F";
    }else{
        newGenero = "O";
    }

    const newData = {
        nome: form.nome.value,
        email: form.email.value,
        genero: newGenero,
        tele: form.tele.value,
        cc: form.cc.value,
        localidade: form.localidade.value,
    };

    // (PARA DEBUG) VERIFICAR O QUE ESTÁ A SER GUARDADO ****
    console.log(newData);

    const editIndex = form.getAttribute('data-edit-index'); // VARIAVEL PARA USAR AO VERIFICAR SE O FORM ESTÁ A EDITAR OS DADOS DE UMA PESSOA
    const isAdd = event.submitter.id === 'addBtn'; // VARIAVEL PARA USAR AO VERIFICAR SE O BOTÃO 'Adicionar' FOI O BOTÃO USADO
    const isUpdate = event.submitter.id === 'updateBtn'; // VARIAVEL PARA USAR AO VERIFICAR SE O BOTÃO 'Atualizar' FOI O BOTÃO USADO

    const data = JSON.parse(localStorage.getItem('formData')) || [];

    if (isUpdate && editIndex !== null) { // SE O FORM ESTIVER A EDITAR E O BOTÃO USADO FOI O 'Atualizar'
        document.getElementById('updateBtn').style.display="none";// ESCONDER O BOTÃO DE ATUALIZAR
        document.getElementById('cancelarBtn').style.display="none";// ESCONDER O BOTÃO DE CANCELAR
        data[editIndex] = newData; // SUBSTITUIR OS DADOS DA PESSOA
        form.removeAttribute('data-edit-index'); // REMOVER O ATRIBUTO DE ESTAR A EDITAR DADOS DE UMA PESSOA AO FORM

    } else if(isAdd){ // O BOTÃO USADO FOI O 'Adicionar'
        data.push(newData); // SIMPLESMENTE ADICIONAR OS NOVOS DADOS DA PESSOA
    }

    // (PARA DEBUG) ****
    console.log("Dados após salvar:", data);

    // GUARDAR OS NOVOS DADOS NO LOCALSTORAGE
    localStorage.setItem('formData', JSON.stringify(data));

    // CARREGAR OS DADOS NA TABELA
    loadTableData();

    // APAGAR O FORMULARIO
    form.reset();
}

// ADICIONAR LISTENER PARA OS BOTÕES DE SUBMIT DO FORMULÁRIO
document.getElementById('form').addEventListener('submit', saveData);
// APAGAR O FORMULÁRIO AO CLICAR NO BOTÃO DE CANCELAR
form = document.getElementById('form');
document.getElementById('cancelarBtn').addEventListener('click', form.reset);

// CARREGAR DADOS NA TABELA QUANDO A PÁGINA CARREGA
document.addEventListener('DOMContentLoaded', loadTableData);
