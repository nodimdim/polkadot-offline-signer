<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-third">
          <Logo></Logo>
          <br>
          <br>
          <Connections></Connections>
          <NewConnection></NewConnection>
        </div>
        <div class="column"></div>
        <div class="column is-three-fifths">
          <Form />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Form from '~/components/Form.vue'
import Connections from '~/components/Connections.vue'
import NewConnection from '~/components/NewConnection.vue'
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Form,
    Connections,
    NewConnection,
  },
}
</script>
