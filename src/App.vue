<template>
  <div id="app">
    <router-link :to="{path:'/product/sku'}"></router-link>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
