<template>
  <div>
    <template>
      <b-navbar>
          <template #brand>
              <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <div class="is-size-3">
                  <span style="color:#7957d5"><b>Polka</b></span>
                  <span id="sign" style="color:#000000"><b>Sign</b></span>
                </div>
                  <!-- <img
                      src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
                      alt="Lightweight UI components for Vue.js based on Bulma"
                  > -->
              </b-navbar-item>
          </template>
      </b-navbar>
    </template>
    <nuxt />
  </div>
</template>

<style scoped>
#sign {
  margin-left: -6px;
}
</style>