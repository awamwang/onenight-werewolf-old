<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
  background:
    radial-gradient(ellipse at top, rgba(226, 69, 70, 0.08), transparent 55%),
    linear-gradient(180deg, #f7f4ef 0%, #efe8df 100%);
}
</style>
