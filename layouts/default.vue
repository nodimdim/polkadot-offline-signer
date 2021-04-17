<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-third">
          <Connections></Connections>
          <NewConnection></NewConnection>
        </div>
        <div class="column"></div>
        <div class="column is-half">
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

export default {
  components: {
    Form,
    Connections,
    NewConnection,
  },
}
</script>
