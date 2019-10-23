<template>
  <div class="logo">
    {{ txt }}
  </div>
</template>

<style>
  .logo {
    color: green;
  }
</style>

<script>
export default {
  name: 'App',
  data: function () {
    return {
      txt: 'hello common-cli in index'
    }
  }
}
</script>
