<template>
  <div id="app">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive">
      </router-view>
  </div>
</template>

<script>
// 禁止ios缩放
window.onload = function () {
  document.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  })
  document.addEventListener('gesturestart', function (event) {
    event.preventDefault()
  })
}
export default {
  name: 'App'
}
</script>

<style>
html, body{
  height: 100%;
}
#app {
  font-family:PingFangSC;
  height: 100%;
}
</style>
