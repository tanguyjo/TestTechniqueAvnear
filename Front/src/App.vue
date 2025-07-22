<script setup>
import List from './components/List.vue';
</script>

<template>
  <div class="app-container">
    <h1>Suivi des indices boursiers</h1>
    <List />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  box-sizing: border-box;
  text-align: center;

  max-width: 800px;  
  margin-left: auto;
  margin-right: auto; 
}

</style>
