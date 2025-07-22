<template>
  <div class ="container">
    <h2>Indices suivis</h2>

  <!-- Ajout d'un indices -->
    <form @submit.prevent="addIndice">
      <input v-model="newName" placeholder="Nom de l'indice" required />
      <input v-model="newSymbol" placeholder="Symbole" required />
      <button 
        type="submit" 
        id="ajouter"   
        style="background: none; border: none; cursor: pointer;"
      >
        <img 
          :src="ajouter" 
          alt="Ajouter"
          width="24" 
          height="24"
          style="position: relative; top: 8px" 
        />
      </button>
    </form>
 <!-- indices -->
    <ul>
      <li 
        v-for="indice in indices" 
        :key="indice.symbol" 
        style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #ddd;"
      >
       
        <span 
          @click="selectIndice(indice.symbol)" 
          style="cursor:pointer; flex: 1; display: flex; align-items: center;"
        >
          <img
            v-if="quotes[indice.symbol]"
            :src="Number(quotes[indice.symbol].changePercent) >= 0 ? upIcon : downIcon"
            alt="Variation"
            width="16"
            height="16"
            style="margin-right: 6px"
          />
          {{ indice.name }} ({{ indice.symbol }}) - Valeur actuelle : 
          <span v-if="quotes[indice.symbol]">{{ quotes[indice.symbol].price }}</span>
          <span v-else>Chargement...</span>
        </span>
        
        <!--boutons -->
        <div style="display: flex; gap: 8px;">
          <button 
            @click="editIndice(indice)"  
            style="background: none; border: none; cursor: pointer;"
          >
            <img :src="editIcon" alt="Modifier" width="24" height="24" />
          </button>

          <button 
            @click="deleteIndice(indice.symbol)"  
            style="background: none; border: none; cursor: pointer;"
          >
            <img :src="removeIcon" alt="Supprimer" width="24" height="24" />
          </button>
        </div>
      </li>
    </ul>
<!-- details -->
    <div v-if="selectedQuote">
      <h3>Détails pour {{ selectedQuote.name }}</h3>
      <p>Prix haut du jour : {{ selectedQuote.high }}</p>
      <p>Prix bas du jour : {{ selectedQuote.low }}</p>
      <p>
        Variation : 
        <span>
          {{ selectedQuote.changePercent }}%
        </span>
      </p>
    </div>
<!-- modifications -->
    <div v-if="editingIndice" style="margin-top: 20px;">
      <h3>Modifier l’indice</h3>
      <input v-model="editName" placeholder="Nom" />
      <input v-model="editSymbol" placeholder="Symbole" />
      <button @click="saveEdit">Enregistrer</button>
      <button @click="editingIndice = null">Annuler</button>
    </div>
  </div>
</template>

<script setup>
import ajouter from '../assets/add.png'
import removeIcon from '../assets/remove.png'
import editIcon from '../assets/edit.png'
import upIcon from '../assets/up.png'     
import downIcon from '../assets/down.png' 
import { ref, reactive, onMounted } from 'vue'
import { fetchQuote } from '../services/api'

const indices = ref([])
const quotes = reactive({})
const selectedQuote = ref(null)

const newName = ref('')
const newSymbol = ref('')
const editingIndice = ref(null)
const editName = ref('')
const editSymbol = ref('')

function editIndice(indice) {
  editingIndice.value = indice
  editName.value = indice.name
  editSymbol.value = indice.symbol
}

async function saveEdit() {
  const symbol = editSymbol.value.trim().toUpperCase()

  try {
    const data = await fetchQuote(symbol)

    indices.value = indices.value.filter(ind => ind.symbol !== editingIndice.value.symbol)

    indices.value.push({
      name: editName.value.trim(),
      symbol,
    })

    saveIndices()

    quotes[symbol] = {
      price: data.price,
      name: data.name,
      high: data.high,
      low: data.low,
      changePercent: data.changePercent !== undefined ? data.changePercent.toFixed(2) : '0.00',
    }

    editingIndice.value = null
  } catch (e) {
    alert('Symbole invalide')
  }
}

function loadIndices() {
  const saved = localStorage.getItem('indices')
  indices.value = saved ? JSON.parse(saved) : []
}

function deleteIndice(symbol) {
  indices.value = indices.value.filter(indice => indice.symbol !== symbol)
  localStorage.setItem('indices', JSON.stringify(indices.value))
  delete quotes[symbol]
  if (selectedQuote.value && selectedQuote.value.symbol === symbol) {
    selectedQuote.value = null
  }
}

function saveIndices() {
  localStorage.setItem('indices', JSON.stringify(indices.value))
}

async function loadQuotes() {
  for (const indice of indices.value) {
    try {
      const data = await fetchQuote(indice.symbol)
      quotes[indice.symbol] = {
        price: data.price,
        name: data.name,
        high: data.high,
        low: data.low,
        changePercent: data.changePercent !== undefined ? data.changePercent.toFixed(2) : '0.00',
      }
    } catch (e) {
      console.error('Erreur fetch quote:', e)
      quotes[indice.symbol] = { price: 'N/A' }
    }
  }
}

function selectIndice(symbol) {
  if (selectedQuote.value?.symbol === symbol) {
    selectedQuote.value = null
  } else {
    selectedQuote.value = {
      ...quotes[symbol],
      symbol,
    }
  }
}

async function addIndice() {
  const newIndice = {
    name: newName.value.trim(),
    symbol: newSymbol.value.trim().toUpperCase(),
  }

  if (indices.value.some(ind => ind.symbol === newIndice.symbol)) {
    alert('Indice déjà ajouté')
    return
  }

  try {
    await fetchQuote(newIndice.symbol)
  } catch (e) {
    alert('Symbole invalide')
    return
  }

  indices.value.push(newIndice)
  saveIndices()

  try {
    const data = await fetchQuote(newIndice.symbol)
    quotes[newIndice.symbol] = {
      price: data.price,
      name: data.name,
      high: data.high,
      low: data.low,
      changePercent: data.changePercent !== undefined ? data.changePercent.toFixed(2) : '0.00',
    }
  } catch {
    quotes[newIndice.symbol] = { price: 'N/A' }
  }

  newName.value = ''
  newSymbol.value = ''
}

onMounted(async () => {
  loadIndices()
  await loadQuotes()
})
</script>

<style>
input {
  padding: 6px 6px;
  font-size: 12px;
  border: 2px solid #2d2fc9; 
  border-radius: 12px;     
  background-color: #222;  
  color: #eee;           
  transition: border-color 0.3s ease;
}

input:focus,input:hover {   
  outline: none;
  background-color: #333;
}

#ajouter {
  margin-top: 4px;
}

.container {
  border: 1px solid #ccc;
  border-radius: 8px;       
  padding: 20px;            
  max-width: 600px;        
  margin: 20px auto;        
  background-color: #1818187d; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
}
</style>
