<template>
  <div class="w-1/2 mx-auto py-20">
    <div class="w-full shadow-2xl subpixel-antialiased rounded h-64 bg-black border-black mx-auto">
      <div
        id="headerTerminal"
        class="flex items-center h-6 rounded-t bg-gray-100 border-b border-gray-500 text-center text-black"
      >
        <div
          id="closebtn"
          class="flex ml-2 items-center text-center border-red-900 bg-red-500 shadow-inner rounded-full w-3 h-3"
        />
        <div
          id="minbtn"
          class="ml-2 border-yellow-900 bg-yellow-500 shadow-inner rounded-full w-3 h-3"
        />
        <div
          id="maxbtn"
          class="ml-2 border-green-900 bg-green-500 shadow-inner rounded-full w-3 h-3"
        />
        <div id="terminaltitle" class="mx-auto pr-16">
          <p class="text-center text-sm">
            <logo />Terminal
            <logo />
          </p>
        </div>
      </div>
      <div id="console" class="pl-1 pt-1 h-auto text-green-500 font-mono text-xs bg-black">
        <p class="pb-1">
          Last login: {{ new Date().toUTCString() }} on ttys002
        </p>
        <p v-for="counter in counters" :key="counter.id" class="pb-1">
          <span class="text-red-600">@lakatos88</span>
          <span class="text-yellow-600 mx-1">></span>
          <span class="text-blue-600">~/nexmo/nexmo-nuxt-call</span>
          <span class="text-red-600 mx-1">$</span>
          <span v-if="!counter.message" class="blink" contenteditable="true" @click.once="stopBlinking" @keydown.enter.once="runCommand">_</span>
          <span v-if="counter.message">{{ counter.message }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  data () {
    return {
      counters: [{ id: 0 }]
    }
  },
  mounted () {
    console.log(process.env.WS_URL)
    const ws = new WebSocket(process.env.WS_URL)

    ws.onmessage = (event) => {
      this.counters[this.counters.length - 1].message = event.data
      this.counters.push({ id: this.counters.length })
    }
  },
  methods: {
    stopBlinking (event) {
      event.target.classList.remove('blink')
      event.target.textContent = '\u00A0'
    },
    async runCommand (event) {
      const splitCommand = event.target.textContent.trim().split(' ')
      event.target.contentEditable = false
      if (splitCommand.length > 3 && splitCommand[0] === 'nexmo' && splitCommand[1] === 'call') {
        const call = await this.$axios.$get(`/api/make?text=${splitCommand.slice(3).join(' ')}&number=${splitCommand[2]}`)
        this.counters.push({ id: this.counters.length, message: call })
      } else {
        this.counters.push({ id: this.counters.length, message: `Unrecognized command "${splitCommand[0]}".` })
      }
      this.counters.push({ id: this.counters.length })
    }
  }
}
</script>

<style>
.NuxtLogo {
  width: 10px;
  height: 10px;
  position: relative;
  margin: 0 10px;
  bottom: 2px;
  display: inline-block;
}

.blink {
  animation-duration: 1s;
  animation-name: blink;
  animation-iteration-count: infinite;
}

@keyframes blink {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
