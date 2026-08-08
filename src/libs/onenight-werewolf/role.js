import * as wolfGame from './game'

function randomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const NightNight = `漫漫长夜。。。`

export default class Role {

  constructor (roleName, game) {
    this.game = game
    this.roleName = roleName
  }

  get operateGuide () {
    switch (this.roleName) {
      case '狼人':
        return '看看我的狼同伴，或者看看剩下了什么好东西'
      case '爪牙':
        return '我的主人，你在哪里'
      case '预言家':
        return '请选择查验目标'
      case '强盗':
        return '请选择抢劫目标'
      case '捣蛋鬼':
        return '请选择两个目标（不能选择自己）'
      case '失眠者':
        return '等待是我今生做过最有意思的事情'
      case '酒鬼':
        return '请选择两个目标'
      case '村民':
        return '励志做个愚民，闭眼到底'
      case '守卫':
        return '看看我的好基友在哪里'
      default:
        return '你木有技能！'
    }
  }

  get operateTargets () {
    switch (this.roleName) {
      case '狼人':
        return []
      case '爪牙':
        return []
      case '预言家':
        return Array.from(new Array(this.game.playerCount + wolfGame.LEFT_ROLE_COUNT), (val, index) => index + 1)
      case '强盗':
        return Array.from(new Array(this.game.playerCount), (val, index) => index + 1)
      case '捣蛋鬼':
        return Array.from(new Array(this.game.playerCount), (val, index) => index + 1)
      case '失眠者':
        return []
      case '酒鬼':
        return Array.from(new Array(wolfGame.LEFT_ROLE_COUNT), (val, index) => this.game.playerCount + index + 1)
      case '村民':
        return []
      case '皮匠':
        return []
      case '守卫':
        return []
      default:
        return []
    }
  }

  operate1 (position) {
    switch (this.roleName) {
      case '狼人':
        return () => {
          let otherWolfs = this.game.findOtherPlayers(position, '狼人')
          if (otherWolfs.length === 0) {
            let randomIndex = randomInt(1, wolfGame.LEFT_ROLE_COUNT)
            let randomRole = this.game.players[this.game.playerCount + randomIndex].role
            this.game.operateLog[position] = {roleName: this.game.players[position].role.roleName, operate: `底牌${randomRole.roleName}`}
            return `底牌中有一个角色是${randomRole.roleName}`
          }

          this.game.operateLog[position] = {roleName: this.game.players[position].role.roleName, operate: `${otherWolfs.join('、')}号同伴`}
          return `你的同伴是${otherWolfs.join('、')}号玩家`
        }
      case '爪牙':
        return () => {
          let wolfs = this.game.findPlayers('狼人')
          if (wolfs.length === 0) {
            this.game.operateLog[position] = {roleName: this.game.players[position].role.roleName, operate: `无狼`}
            return `场上没有狼人`
          }

          this.game.operateLog[position] = {roleName: this.game.players[position].role.roleName, operate: `${wolfs.join('、')}号狼`}
          return `你的狼小主是${wolfs.join('、')}号玩家`
        }
      case '预言家':
        return (list) => {
          if (list.length === 0) {
            throw new Error('请选择操作目标')
          }
          if (list.length > 2) {
            throw new Error('最多查验2名目标')
          }
          if (list[0] <= this.game.playerCount || list[1] <= this.game.playerCount) {
            if (list.length > 1) {
              throw new Error('最多查验1名玩家')
            }
            if (list[0] === position) {
              throw new Error('不能查验自己')
            }
          } else {
            if (list.length !== 2) {
              throw new Error('请查看2张底牌')
            }
          }

          this.game.operateLog[position] = {roleName: this.game.players[position].role.roleName, operate: `查验${list.join('、')}`}
          return list.map((item) => {
            return `${item}号玩家身份是${this.game.getRoleName(item)}`
          }).join('；')
        }
      case '强盗':
        return (list) => {
          if (list.length === 0) {
            throw new Error('请选择操作目标')
          }
          if (list.length > 1) {
            throw new Error('最多抢夺1张底牌')
          }
          if (list.includes(position)) {
            throw new Error('不能抢夺自己')
          }

          this.game.operateCache[this.roleName] = [position, list[0]]

          this.game.operateLog[position] = {roleName: this.game.players[position].role.roleName, operate: `抢夺${list[0]}`}
          return `你抢夺了${list[0]}号玩家的角色`
        }
      case '捣蛋鬼':
        return (list) => {
          if (list.length === 0) {
            throw new Error('请选择操作目标')
          }
          if (list.length !== 2) {
            throw new Error('需要2个操作目标')
          }
          if (list.includes(position)) {
            throw new Error('不能交换自己')
          }

          this.game.operateCache[this.roleName] = list

          this.game.operateLog[position] = {roleName: this.game.players[position].role.roleName, operate: `交换${list[0]}、${list[1]}`}
          return `你交换了${list[0]}号玩家与${list[1]}号玩家的角色`
        }
      case '失眠者':
        return () => {
          this.game.operateLog[position] = {roleName: this.game.players[position].role.roleName, operate: `无`}
          return NightNight
        }
      case '酒鬼':
        return () => {
          if (list.length === 0) {
            throw new Error('请选择操作目标')
          }
          if (list.length > 1) {
            throw new Error('最多交换1张底牌')
          }

          this.game.operateLog[position] = {roleName: this.game.players[position].role.roleName, operate: `list[0]号`}
          this.game.operateCache[this.roleName] = [position, list[0]]

          return `你已撒酒疯`
        }
      case '村民':
        return () => {
          this.game.operateLog[position] = {roleName: this.game.players[position].role.roleName, operate: `无`}
          return NightNight
        }
      case '皮匠':
        return () => {
          this.game.operateLog[position] = {roleName: this.game.players[position].role.roleName, operate: `无`}
          return NightNight
        }
      case '守卫':
        return () => {
          let otherGuards = this.game.findOtherPlayers(position, '守卫')
          if (otherGuards.length === 0) {
            this.game.operateLog[position] = {roleName: this.game.players[position].role.roleName, operate: `无同伴`}
            return `你是孤独的勇士！`
          }

          this.game.operateLog[position] = {roleName: this.game.players[position].role.roleName, operate: `${otherGuards.join('、')}号同伴`}
          return `你的同伴是${otherGuards.join('、')}号玩家`
        }
      default:
        return () => {
          return '错误的操作'
        }
    }
  }

  operate2 (position) {
    switch (this.roleName) {
      case '狼人':
        return () => {
          return NightNight
        }
      case '爪牙':
        return () => {
          return NightNight
        }
      case '预言家':
        return () => {
          return NightNight
        }
      case '强盗':
        return () => {
          return NightNight
        }
      case '捣蛋鬼':
        return () => {
          return NightNight
        }
      case '失眠者':
        return () => {
          return `你现在的角色是${this.game.getFinalRoleName(position)}`
        }
      case '酒鬼':
        return () => {
          return NightNight
        }
      case '村民':
        return () => {
          return NightNight
        }
      case '皮匠':
        return () => {
          return NightNight
        }
      case '守卫':
        return () => {
          return NightNight
        }
      default:
        return () => {
          return NightNight
        }
    }
  }

}