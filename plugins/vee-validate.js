import Vue from 'vue'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'
import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { hexToU8a, isHex } from '@polkadot/util'

extend('required', {
  ...required,
  message: 'This field is required.',
})

extend('isValidAddress', {
  message: 'Not a valid address.',
  validate: (address) => {
    try {
      encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))
      return true
    } catch (error) {
      return false
    }
  },
})

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
