// 化身幽灵Doppelganger,狼人Werewolf,爪牙Minion,守夜人Mason,预言家Seer,强盗Robber,捣蛋鬼Troublemaker,
// 酒鬼Drunk,失眠者Insomniac,皮匠Tanner,猎人Hunter,村民Villager
import Player from './player'

function isEmpty (value) {
  return !value || Object.keys(value).length === 0
}

function shuffle (list) {
  const result = [...list]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export const LEFT_ROLE_COUNT = 3
export const GameStatusEnum = {
  CONFIG: 1,
  RULE: 2,
  OPERATE1: 3,
  OPERATE2: 4,
  ARGUE: 5,
  VOTE: 6,
  RESULT: 7
}
export const availableRoles = {
  '狼人': 1,
  '爪牙': 1,
  '预言家': 1,
  '强盗': 1,
  '捣蛋鬼': 1,
  '失眠者': 1,
  '酒鬼': 1,
  '村民': 1,
  '守卫': 1,
  '皮匠': 1
}
const roleNamesSet = {
  3: ['狼人', '狼人', '预言家', '强盗', '捣蛋鬼', '村民'],  // ['狼人', '爪牙', '预言家', '强盗', '酒鬼', '村民']
  4: ['狼人', '狼人', '预言家', '强盗', '捣蛋鬼', '村民', '村民'],  // ['狼人', '爪牙', '预言家', '强盗', '捣蛋鬼', '酒鬼', '村民']
  5: ['狼人', '狼人', '预言家', '强盗', '捣蛋鬼', '村民', '村民', '村民'],  // ['狼人', '爪牙', '预言家', '强盗', '捣蛋鬼', '酒鬼', '村民', '村民']
  6: ['狼人', '狼人', '爪牙', '预言家', '强盗', '捣蛋鬼', '失眠者', '村民', '村民'],  //
  7: ['狼人', '狼人', '爪牙', '预言家', '强盗', '捣蛋鬼', '失眠者', '村民', '村民', '村民'],
  8: ['狼人', '狼人', '爪牙', '预言家', '强盗', '捣蛋鬼', '失眠者', '守卫', '守卫', '村民', '村民'],
  9: ['狼人', '狼人', '爪牙', '预言家', '强盗', '捣蛋鬼', '酒鬼', '村民', '村民', '村民', '村民', '村民']
}

export default class Game {

  constructor (playerCount = 8, operateTimeout = 20) {
    this.status = GameStatusEnum.CONFIG
    this._playerCount = playerCount
    this._operateTimeout = operateTimeout

    this.defaultRoleNames = []
    this.roleNames = []
    this.players = {}
    this.finalPlayers = {}
    this.rule = ''

    this.curPosition = -1
    this.curRole = null

    this.operateCache = {}
    this.operateLog = {}
  }

  get playerCount () {
    return this._playerCount
  }

  set playerCount (value) {
    value = parseInt(value) || null
    this._playerCount = value
    this.getDefaultRoleNames(value)
  }

  get operateTimeout () {
    return this._operateTimeout
  }

  set operateTimeout (value) {
    this._operateTimeout = value
  }

  get finalRoleNames () {
    let names = []
    if (isEmpty(this.finalPlayers)) {
      return names
    }

    for (let i = this.playerCount + LEFT_ROLE_COUNT; i >= 1; i--) {
      names.unshift(this.finalPlayers[i].role.roleName)
    }

    return names
  }

  // 配置阶段
  getDefaultRoleNames (playerCount) {
    if (playerCount === null) {
      return
    }
    // console.log('playerCount', playerCount)

    if (!roleNamesSet[playerCount]) {
      window.alert('unavailable player count')
      throw new Error('unavailable player count')
    }

    this.defaultRoleNames = roleNamesSet[playerCount]
  }

  setRoleNames (rolesString) {
    let roleNames = rolesString.split('、')
    this.checkRoleNames(roleNames)

    this.roleNames = roleNames
  }

  checkRoleNames (roleNames) {
    if (roleNames.length !== this.playerCount + LEFT_ROLE_COUNT) {
      throw new Error(`wrong role count, should be ${(this.playerCount + LEFT_ROLE_COUNT)}`)
    }
    roleNames.map((role) => {
      if (!availableRoles[role]) {
        throw new Error(`unavailable role "${role}"`)
      }
    })
  }

  // 规则说明阶段
  startRuleShow () {
    this.getPlayers()
    this.getRule1()
    this.status = GameStatusEnum.RULE
  }

  getPlayers () {
    let roleNames = shuffle(this.roleNames)
    for (let position = this.playerCount + LEFT_ROLE_COUNT; position >= 1; position--) {
      this.players[position] = new Player(roleNames[position - 1], position, this)
      this.finalPlayers[position] = new Player(roleNames[position - 1], position, this)
    }
  }

  getRule1 () {
    this.rule = `请各位玩家闭眼，按照顺时针方向传递手机，每人有${this._operateTimeout}s时间操作`
  }

  // 操作阶段
  startOperate1 () {
    this.status = GameStatusEnum.OPERATE1
    this.operate1(1)
  }

  startOperate2 () {
    this.finishOperate1()

    if (!this.roleNames.includes('失眠者')) {
      this.status = GameStatusEnum.ARGUE
      return
    }

    this.status = GameStatusEnum.OPERATE2
    this.operate2(1)
  }

  operate1 (position) {
    this.operateResultShow = false
    if (position > this.playerCount) {
      this.startOperate2()
      return
    }

    this.curPlayer = this.players[position]
    this.curPosition = position
    setTimeout(() => {
      // this.curRole.operate()
      // this.operateResult = this.getOperateResult()
      // this.operateResultShow = true
      // setTimeout(() => {
      //   this.operate(i + 1)
      // }, 5 * 1000)
    }, this._operateTimeout)
  }

  operate2 (position) {
    this.operateResultShow = false
    if (position > this.playerCount) {
      this.status = GameStatusEnum.ARGUE
      return
    }

    this.curPlayer = this.players[position]
    this.curPosition = position
    setTimeout(() => {
      // this.curRole.operate()
      // this.operateResult = this.getOperateResult()
      // this.operateResultShow = true
      // setTimeout(() => {
      //   this.operate(i + 1)
      // }, 5 * 1000)
    }, this._operateTimeout)
  }

  finishOperate1 () {
    ['强盗', '捣蛋鬼', '酒鬼'].map((roleName) => {
      if (this.operateCache[roleName]) {
        this.switchRole(...this.operateCache[roleName])
      }
    })
  }

  getRule2 () {
    this.rule = `请各位玩家闭眼，按照顺时针方向传递手机，每人有${this._operateTimeout}s时间操作，最后一位玩家操作后大家睁眼`
  }

  // 结果阶段
  getKillTargets () {
    return Array.from(new Array(this.playerCount + LEFT_ROLE_COUNT), (val, index) => index + 1)
  }

  getKillResult () {
    return (list) => {
      if (list.length === 0) {
        throw new Error('请选择操作目标')
      }
      if (list.length > 1) {
        throw new Error('最多票决1名玩家')
      }

      let killedPosition = list[0]
      let killedRoleName = this.finalPlayers[killedPosition].role.roleName
      let result

      if (killedPosition <= this.playerCount) {
        if ([
          '爪牙',
          '预言家',
          '强盗',
          '捣蛋鬼',
          '失眠者',
          '酒鬼',
          '村民',
          '守卫'
        ].includes(killedRoleName)) {
          result = `${killedPosition}玩家的角色是${killedRoleName}，狼人胜利`
        }
        if ([
          '狼人'
        ].includes(killedRoleName)) {
          result = `${killedPosition}玩家的角色是${killedRoleName}，平民胜利`
        }
        if ([
          '皮匠'
        ].includes(killedRoleName)) {
          result = `${killedPosition}玩家的角色是${killedRoleName}，皮匠胜利`
        }
      } else {
        if (this.finalRoleNames.slice(0, -3).includes('狼人')) {
          result = `场上有狼人，狼人胜利`
        } else {
          result = `狼人都在底牌中，平民胜利`
        }
      }

      this.status = GameStatusEnum.RESULT
      return result
    }
  }
  
  // 辅助操作
  findOtherPlayers (position, roleName) {
    let players = this.players
    let otherRoles = []

    for (let i = this.playerCount; i >= 1; i--) {
      let player = players[i]
      if (player.role.roleName === roleName && player.position !== position) {
        otherRoles.unshift(player.position)
      }
    }

    return otherRoles
  }

  findPlayers (roleName) {
    let players = this.players
    let wolfs = []

    for (let i = this.playerCount; i >= 1; i--) {
      let player = players[i]
      if (player.role.roleName === roleName) {
        wolfs.unshift(player.position)
      }
    }

    return wolfs
  }

  getRoleName (position) {
    let players = this.players

    return players[position].role.roleName
  }

  getFinalRoleName (position) {
    let players = this.finalPlayers

    return players[position].role.roleName
  }

  switchRole (position1, position2) {
    let players = this.finalPlayers

    let temp = players[position1]
    players[position1] = players[position2]
    players[position2] = temp
  }
}