const item_input = document.getElementById('item-input')
const alerta = document.getElementById('alerta')
const btn_adicionar = document.getElementById('btn-adicionar')
const btn_baixar = document.getElementById('btn-baixar')
const btn_enviar = document.getElementById('btn-enviar')

const ul_shopping_list = document.getElementById('shopping-list')
let shopping_list = []

function isItemRepitido(nome) {
    return shopping_list.some(item =>
        item.name.trim().toLowerCase() === nome.trim().toLowerCase()
    )
}

function renderShoppingList() {

    if (shopping_list.length === 0) {
        ul_shopping_list.innerHTML = '<p id="empty-message">A lista de compras está vazia.</p>'
        return
    }

    ul_shopping_list.innerHTML = shopping_list.map((item, index) => `
        <li class="shopping-item">
            <div class="item-content">
                <span class="item-name">
                    <input type="checkbox" name="item-checkbox" id="item-${index}" class="checkbox">
                    ${item.name}
                </span>
                <span class="item-date">${item.date}</span>
            </div>
            <div class="item-actions">
                <img src="./img/lixeira-de-reciclagem.png" alt="icone de lixeira" class="delete-icon">
            </div>
        </li>
    `).join('')

    // Checkbox (marcar como concluído)
    const checkboxes = document.querySelectorAll('.checkbox')
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                checkbox.parentElement.classList.add('completed')
            } else {
                checkbox.parentElement.classList.remove('completed')
            }
        })
    })

    // Remover item
    const deleteIcons = document.querySelectorAll('.delete-icon')
    deleteIcons.forEach((icon, index) => {
        icon.addEventListener('click', (e) => {
            e.preventDefault()
            shopping_list.splice(index, 1)
            renderShoppingList()
        })
    })
}

function downloadShoppingList() {
    const dataStr = `Lista de Compras: ${new Date().toLocaleDateString('pt-BR')}\n\n${shopping_list.map(item => `${item.name}`).join('\n')}`

    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(dataStr))
    downloadAnchorNode.setAttribute("download", "shopping_list.csv")

    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
}

btn_baixar.addEventListener('click', (event) => {
    event.preventDefault()

    if (shopping_list.length < 5) {
        alerta.textContent = 'A lista de compras deve ter pelo menos 5 itens para ser baixada.'
        return
    }

    alerta.textContent = ''
    downloadShoppingList()
})

function sendShoppingList() {
    if (shopping_list.length < 5) {
        alerta.textContent = 'A lista de compras deve ter pelo menos 5 itens para ser enviada.'
        return
    }

    alerta.textContent = ''
    const dataStr = `Lista de Compras: ${new Date().toLocaleDateString('pt-BR')}\n\n${shopping_list.map(item => `${item.name}`).join('\n')}`

    const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(dataStr)}`
    window.open(whatsappLink, '_blank')
}

btn_enviar.addEventListener('click', (event) => {
    event.preventDefault()
    sendShoppingList()
})

// ➕ Adicionar item
btn_adicionar.addEventListener('click', (event) => {
    event.preventDefault()

    const item_name = item_input.value.trim()

    if (item_name === '') {
        alerta.textContent = 'Por favor, insira um nome para o item.'
        return
    }

    if (isItemRepitido(item_name)) {
        alerta.textContent = 'O item já existe na lista de compras.'
        return
    }

    alerta.textContent = ''

    const Data = new Date()
    const formattedDate =
        Data.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) +
        ' às ' +
        Data.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        })

    const item = {
        name: item_name,
        date: formattedDate
    }

    shopping_list.push(item)

    renderShoppingList()

    item_input.value = ''
})