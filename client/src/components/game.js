// View model's "this"
let vm = null
// Websocket instance
let ws = null

module.exports = require('vue').component('game', {
  data,
  methods: {
    addBot,
    pass,
    play,
    start,
    stop
  },
  mounted,
  template: require('./game.pug')()
})

function addBot() {
  console.log('(local) adding bot!')
  ws.send(JSON.stringify(['player:bot']))
}

function data() {
  return {
    activityLog: [],
    opponents: [
      {
        name: 'Kevin',
        maxHp: 10,
        hp: 10,
        discard: [
          {
            id: 'grab',
            type: 'counter'
          },
          {
            type: 'unknown'
          }
        ]
      },
      {
        name: 'Jimbo',
        maxHp: 10,
        hp: 12,
        discard: []
      }
    ],
    player: {
      hand: [],
      hp: 8,
      maxHp: 10
    },
    score: 12,
    started: null,
    stopped: null
  }
}

function mounted() {
  vm = this
  ws = new WebSocket(`ws://localhost:4000/${vm.$route.params.gameId}`)
  ws.onopen = onOpen
  ws.onmessage = onMessage
}

function onOpen() {
  ws.send(JSON.stringify(['player:join', {
    player: {
      name: 'Bob' + Math.floor(Math.random() * 1e3)
    }
  }]))
}

function onMessage({ data: msg }) {
  const [code, payload] = JSON.parse(msg)
  const codes = {
    'game:no-survivors': () => (vm.stopped = payload.stopped),
    'game:started': () => (vm.started = payload.started),
    'game:stopped': () => (vm.stopped = payload.stopped),
    'game:winner': () => (vm.stopped = payload.stopped)
  }

  if (payload.player) {
    vm.player.hand = payload.player.hand.map((card) => {
      return Object.assign(card, {
        selected: false
      })
    })
  }

  if (payload.message) {
    vm.activityLog.unshift(payload.message)
  }

  if (codes[code]) {
    codes[code]()
  }

  console.log(code, payload)
}

function pass() {
  ws.send(JSON.stringify(['player:pass']))
}

function play() {
  ws.send(JSON.stringify([
    'player:play',
    this.player.hand.filter(card => card.selected)
  ]))
}

function start() {
  console.log('(local) starting game!')
  ws.send(JSON.stringify(['game:start']))
}

function stop() {
  console.log('(local) stopping game!')
  ws.send(JSON.stringify(['game:stop']))
}
