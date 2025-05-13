// Lógica inicial para capturar el formulario y preparar la estructura de blockchain

// --- Estructura básica de blockchain ---
class Block {
    constructor(index, timestamp, data, previousHash = "") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data; // { producto, comprador, cantidad }
        this.previousHash = previousHash;
        this.hash = "";
    }
}

const blockchain = [];

async function calculateHash(block) {
    const encoder = new TextEncoder();
    const data = encoder.encode(
        block.index + block.timestamp + JSON.stringify(block.data) + block.previousHash
    );
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function renderBlockchain() {
    let html = '';
    for (const block of blockchain) {
        html += `<div class="block">
            <strong>Bloque #${block.index}</strong><br>
            <b>Transacción:</b> Producto: ${block.data.producto}, Comprador: ${block.data.comprador}, Cantidad: ${block.data.cantidad}<br>
            <b>Hash Anterior:</b> <span class="hash">${block.previousHash}</span><br>
            <b>Hash Actual:</b> <span class="hash">${block.hash}</span><br>
            <b>Fecha:</b> ${block.timestamp}
        </div><hr>`;
    }
    document.getElementById('blockchainView').innerHTML = html || '<em>No hay bloques aún.</em>';
}

// Guardar blockchain en localStorage
function saveBlockchain() {
    localStorage.setItem('blockchain', JSON.stringify(blockchain));
}

// Cargar blockchain desde localStorage
async function loadBlockchain() {
    const data = localStorage.getItem('blockchain');
    if (data) {
        const arr = JSON.parse(data);
        blockchain.length = 0; // Limpiar array
        for (const b of arr) {
            // Reconstruir cada bloque y recalcular el hash para seguridad
            const block = new Block(b.index, b.timestamp, b.data, b.previousHash);
            block.hash = b.hash;
            blockchain.push(block);
        }
    }
}

// Modificar addBlock para guardar después de agregar
async function addBlock(data) {
    const index = blockchain.length;
    const timestamp = new Date().toISOString();
    const previousHash = index > 0 ? blockchain[blockchain.length - 1].hash : "0";
    const block = new Block(index, timestamp, data, previousHash);
    block.hash = await calculateHash(block);
    blockchain.push(block);
    console.log("Bloque agregado:", block);
    saveBlockchain();
    renderBlockchain();
}

// Modificar el submit para agregar el bloque

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('txForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const producto = document.getElementById('producto').value;
        const comprador = document.getElementById('comprador').value;
        const cantidad = document.getElementById('cantidad').value;
        await addBlock({ producto, comprador, cantidad });
        form.reset();
    });
    // Agregar contenedor visual si no existe
    let view = document.getElementById('blockchainView');
    if (!view) {
        view = document.createElement('section');
        view.id = 'blockchainView';
        view.style.maxWidth = '700px';
        view.style.margin = '2rem auto';
        document.body.appendChild(view);
    }
    // Botón de descarga
    let dlBtn = document.getElementById('downloadBlockchainBtn');
    if (!dlBtn) {
        dlBtn = document.createElement('button');
        dlBtn.id = 'downloadBlockchainBtn';
        dlBtn.textContent = 'Descargar Blockchain (JSON)';
        dlBtn.style.margin = '0 0 2rem 0';
        dlBtn.style.display = 'block';
        dlBtn.onclick = downloadBlockchain;
        document.body.insertBefore(dlBtn, document.getElementById('blockchainView'));
    }
    // Botón e input de importación
    let importBtn = document.getElementById('importBlockchainBtn');
    let importInput = document.getElementById('importBlockchainInput');
    if (!importBtn) {
        importBtn = document.createElement('button');
        importBtn.id = 'importBlockchainBtn';
        importBtn.textContent = 'Importar Blockchain (JSON)';
        importBtn.style.margin = '0 0 1rem 0';
        importBtn.style.display = 'block';
        importBtn.onclick = () => importInput.click();
        document.body.insertBefore(importBtn, document.getElementById('downloadBlockchainBtn').nextSibling);
    }
    if (!importInput) {
        importInput = document.createElement('input');
        importInput.type = 'file';
        importInput.accept = '.json,application/json';
        importInput.id = 'importBlockchainInput';
        importInput.style.display = 'none';
        importInput.onchange = (e) => {
            if (e.target.files.length > 0) {
                importBlockchainFromFile(e.target.files[0]);
                e.target.value = '';
            }
        };
        document.body.insertBefore(importInput, importBtn.nextSibling);
    }
    // Contenedor para centrar los botones de acción
    let actionsDiv = document.getElementById('blockchainActions');
    if (!actionsDiv) {
        actionsDiv = document.createElement('div');
        actionsDiv.id = 'blockchainActions';
        document.body.insertBefore(actionsDiv, document.getElementById('blockchainView'));
    }
    // Mover los botones dentro del contenedor centrado
    if (dlBtn && dlBtn.parentNode !== actionsDiv) actionsDiv.appendChild(dlBtn);
    if (importBtn && importBtn.parentNode !== actionsDiv) actionsDiv.appendChild(importBtn);
    if (importInput && importInput.parentNode !== actionsDiv) actionsDiv.appendChild(importInput);
    await loadBlockchain();
    renderBlockchain();
});

// Descargar blockchain como JSON
function downloadBlockchain() {
    const dataStr = JSON.stringify(blockchain, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blockchain.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Importar blockchain desde JSON
function importBlockchainFromFile(file) {
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const arr = JSON.parse(e.target.result);
            if (!Array.isArray(arr)) throw new Error('Formato inválido');
            blockchain.length = 0;
            for (const b of arr) {
                const block = new Block(b.index, b.timestamp, b.data, b.previousHash);
                block.hash = b.hash;
                blockchain.push(block);
            }
            saveBlockchain();
            renderBlockchain();
            alert('Blockchain importada correctamente.');
        } catch (err) {
            alert('Error al importar el archivo: ' + err.message);
        }
    };
    reader.readAsText(file);
}