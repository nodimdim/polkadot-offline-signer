<template>
  <div>
    <label for="file-upload">
      <section class="section">
          <div v-if="fileName" class="content has-text-centered">
            <p>
              <b-icon icon="check" size="is-large"></b-icon>
            </p>
            <p>Reading menmonic from file: <b>{{ fileName }}</b></p>
          </div>
          <div v-else class="content has-text-centered">
            <p>
              <b-icon icon="upload" size="is-large"></b-icon>
            </p>
            <p>Click here to upload your mnemonic file</p>
          </div>
        </section>
    </label>
    <input id="file-upload" type="file" @change="loadTextFromFile">
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileName: ''
    }
  },
  methods: {
    loadTextFromFile(ev) {
      const file = ev.target.files[0]
      const reader = new FileReader()
      reader.onload = e => {
        this.fileName = file.name
        this.$emit("load", e.target.result)
      }
      reader.readAsText(file)
    }
  },
  mounted() {
    this.$root.$on('reset-app', () => {
      this.fileName = ''
    })
  }
};
</script>

<style scoped>
input {
  display: none;
}
section {
  border: 1px dotted black;
  border-radius: 3px;
}
</style>
