// View model's "this
let vm = null
// Websocket instance
let ws = null

module.exports = require('vue').component('game', {
  data,
  methods: {

  },
  mounted,
  template: require('./game.pug')()
})

function data() {
  return {
    activityLog: [],
    player: {
      hand: [
        {
          id: 'gut-punch',
          name: 'Gut Punch',
          type: 'attack'
        },
        {
          disabled: true,
          id: 'block',
          name: 'Block',
          type: 'counter'
        },
        {
          id: 'a-gun',
          name: 'A Gun',
          type: 'unstoppable'
        },
        {
          type: 'unknown'
        }
      ],
      hp: 8,
      maxHp: 10
    }
  }
}

function mounted() {
  vm = this
  ws = new WebSocket('ws://localhost:4000')
  ws.onopen = onOpen
  ws.onmessage = onMessage
}

function onOpen() {
  ws.send(JSON.stringify([
    'player:join',
    {
      gameId: vm.$route.params.gameId,
      player: {
        name: 'Bob' + Math.floor(Math.random() * 1e3)
      }
    }
  ]))
}

function onMessage({ data: msg }) {
  const [code, message, payload] = JSON.parse(msg)
  const codes = {
    'player:joined': () => {
      ws.send(JSON.stringify(['game:start']))
    },
    'player:status': () => {
      console.log(vm)
      vm.player.hand = payload.player.hand
    }
  }
  if (codes[code]) {
    codes[code]()
  }

  console.log(code, message, payload)
}
