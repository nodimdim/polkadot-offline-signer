<template>
  <section class="section">
    <Logo></Logo>
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-two-thirds">
          <Form />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Form from '~/components/Form.vue'
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Form,
    Logo,
  },
  mounted(){
    this.$root.$emit('use-connection', 'default')
 },
}
</script>