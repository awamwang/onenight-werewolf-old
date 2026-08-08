<template>
  <div class="index">
    <div class="head">
      <div class="global-restart" @click.prevent="restart"
           v-show="game.status === GameStatusEnum.OPERATE1 || game.status === GameStatusEnum.OPERATE2">重新开始</div>
    </div>
    <div class="head-placeholder"></div>
    <div class="config" v-if="game.status === GameStatusEnum.CONFIG">
      <h2>一夜终极狼人杀</h2>
      <van-cell-group inset>
        <van-field
          v-model="playerCount"
          type="digit"
          label="游戏人数"
          input-align="right"
          required
        />
        <van-field
          v-model="operateTimeout"
          type="digit"
          label="操作时间"
          input-align="right"
          required
        />
        <van-field
          v-model="rolesString"
          rows="3"
          autosize
          label="角色"
          type="textarea"
          input-align="right"
        />
      </van-cell-group>
      <footer>
        <van-button type="primary" block @click="confirmConfig">确定</van-button>
      </footer>
    </div>
    <div class="rule" v-if="game.status === GameStatusEnum.RULE">
      <div v-html="game.rule" class="text"></div>
      <footer>
        <van-button type="primary" block @click="confirmRule">知道了</van-button>
      </footer>
    </div>
    <div class="operate" v-if="game.status === GameStatusEnum.OPERATE1">
      <h2>{{game.curPosition}}号玩家操作</h2>
      <div v-if="operateStatus === 'stage_2'">
        <div class="role">你的身份是<span class="role-name" v-html="game.curPlayer.role.roleName"></span></div>
        <!--<div class="detail" v-html="game.curPlayer.role.operateGuide"></div>-->
        <div>
          <div v-if="game.curPlayer.role.roleName === '狼人'">
            点击“完成操作”查看结果
            <!--<checklist :title="game.curPlayer.role.operateGuide"-->
                       <!--:options="game.curPlayer.role.operateTargets"-->
                       <!--v-model="operateArgs"-->
                       <!--:max=2></checklist>-->
          </div>
          <div v-if="game.curPlayer.role.roleName === '爪牙'">
            点击“完成操作”查看结果
            <!--<checklist :title="game.curPlayer.role.operateGuide"-->
                       <!--:options="game.curPlayer.role.operateTargets"-->
                       <!--v-model="operateArgs"-->
                       <!--:max=2></checklist>-->
          </div>
          <div v-if="game.curPlayer.role.roleName === '预言家'">
            <target-checklist
              :title="game.curPlayer.role.operateGuide"
              :options="game.curPlayer.role.operateTargets"
              v-model="operateArgs"
              :max="2"
            />
          </div>
          <div v-if="game.curPlayer.role.roleName === '强盗'">
            <target-checklist
              :title="game.curPlayer.role.operateGuide"
              :options="game.curPlayer.role.operateTargets"
              v-model="operateArgs"
              :max="1"
            />
          </div>
          <div v-if="game.curPlayer.role.roleName === '捣蛋鬼'">
            <target-checklist
              :title="game.curPlayer.role.operateGuide"
              :options="game.curPlayer.role.operateTargets"
              v-model="operateArgs"
              :max="2"
            />
          </div>
          <div v-if="game.curPlayer.role.roleName === '失眠者'">
            点击“完成操作”查看结果
            <!--<checklist :title="game.curPlayer.role.operateGuide"-->
                       <!--:options="game.curPlayer.role.operateTargets"-->
                       <!--v-model="operateArgs"-->
                       <!--:max=2></checklist>-->
          </div>
          <div v-if="game.curPlayer.role.roleName === '酒鬼'">
            <target-checklist
              :title="game.curPlayer.role.operateGuide"
              :options="game.curPlayer.role.operateTargets"
              v-model="operateArgs"
              :max="2"
            />
          </div>
          <div v-if="game.curPlayer.role.roleName === '村民'">
            点击“完成操作”查看结果
            <!--<checklist :title="game.curPlayer.role.operateGuide"-->
                       <!--:options="game.curPlayer.role.operateTargets"-->
                       <!--v-model="operateArgs"-->
                       <!--:max=2></checklist>-->
          </div>
          <div v-if="game.curPlayer.role.roleName === '守卫'">
            点击“完成操作”查看结果
            <!--<checklist :title="game.curPlayer.role.operateGuide"-->
                       <!--:options="game.curPlayer.role.operateTargets"-->
                       <!--v-model="operateArgs"-->
                       <!--:max=2></checklist>-->
          </div>
        </div>
      </div>
      <div v-show="operateStatus === 'stage_3'">
        <div class="result" v-html="operateResult"></div>
      </div>
      <div class="footer-placeholder"></div>
      <footer>
        <van-button type="primary" block @click="startOperate1" v-show="operateStatus === 'stage_1'">开始操作</van-button>
        <van-button type="primary" block @click="finishOperate1" v-show="operateStatus === 'stage_2'">完成操作</van-button>
        <van-button type="primary" block @click="nextOperate1" v-show="operateStatus === 'stage_3'">下一位</van-button>
      </footer>
    </div>
    <div class="operate" v-if="game.status === GameStatusEnum.OPERATE2">
      <h2>{{game.curPosition}}号玩家操作</h2>
      <div v-show="operateStatus === 'stage_3'">
        <div class="operate-result" v-html="operateResult"></div>
        <div class="operate-log">
          上轮操作：{{game.operateLog[game.curPosition].roleName + '，' + game.operateLog[game.curPosition].operate}}
        </div>
      </div>
      <footer>
        <van-button type="primary" block @click="finishOperate2" v-show="operateStatus === 'stage_1'">查看结果</van-button>
        <van-button type="primary" block @click="nextOperate2" v-show="operateStatus === 'stage_3'">下一位</van-button>
      </footer>
    </div>
    <div class="argue" v-if="game.status === GameStatusEnum.ARGUE">
      <h2>请开始你们的表演</h2>
      <target-checklist
        title="选择投票对象"
        :options="game.getKillTargets()"
        v-model="operateArgs"
        :max="1"
      />
      <div class="footer-placeholder"></div>
      <footer>
        <van-button type="primary" block @click="finishArgue">投票</van-button>
      </footer>
    </div>
    <div class="result" v-if="game.status === GameStatusEnum.RESULT">
      <h2>游戏结束</h2>
      <div class="operate-result" v-html="operateResult"></div>
      <van-cell-group inset title="当前玩家角色情况为">
        <van-cell
          v-for="(player, key) in game.finalPlayers"
          :key="key"
          :title="key + '号'"
          :value="player.role.roleName"
        />
      </van-cell-group>
      <ol class="log">
        <li v-for="(log, key) in game.operateLog" :key="key" v-html="`${key}号：${log.roleName}, ${log.operate}`"></li>
      </ol>
      <div class="footer-placeholder"></div>
      <footer>
        <van-button type="primary" block @click="restart">重新开始</van-button>
      </footer>
    </div>
  </div>
</template>

<script>
  // import Api from 'api'
  import { default as Game, GameStatusEnum } from '../libs/onenight-werewolf/game'
  import TargetChecklist from '../components/TargetChecklist.vue'

  const DEFAULT_PLAYER_COUNT = 8
  const DEFAULT_OPERATE_TIMEOUT = 20

  export default {
    components: {
      TargetChecklist
    },
    data () {
      return {
        game: new Game(localStorage.getItem('gamePlayerCount') || DEFAULT_PLAYER_COUNT,
        localStorage.getItem('gameOperateTimeout') || DEFAULT_OPERATE_TIMEOUT),
        GameStatusEnum: GameStatusEnum,
        rolesString: localStorage.getItem('gameRolesString') || '',
        operateStatus: 'stage_1',
        operateArgs: [],
        operateResult: ''
      }
    },
    computed: {
      playerCount: {
        get () {
          return String(this.game.playerCount ?? '')
        },
        set (value) {
          this.game.playerCount = value
        }
      },
      operateTimeout: {
        get () {
          return String(this.game.operateTimeout ?? '')
        },
        set (value) {
          this.game.operateTimeout = value
        }
      }
    },
    watch: {
      'game.defaultRoleNames' (value) {
        if (!this.rolesString.length) {
          this.rolesString = value.join('、')
        }
      },
      'game.curPosition' () {
      }
    },
    created () {
      this.game.playerCount = this.game.playerCount
    },
    methods: {
      saveConfig () {
        localStorage.setItem('gamePlayerCount', this.game.playerCount)
        localStorage.setItem('gameOperateTimeout', this.game.operateTimeout)
        localStorage.setItem('gameRolesString', this.rolesString)
      },
      confirmConfig () {
        try {
          this.game.setRoleNames(this.rolesString)
          this.game.startRuleShow()
          this.saveConfig()
        } catch (e) {
          this.alert(e.message)
        }
      },
      confirmRule () {
        this.game.startOperate1()
      },
      startOperate1 () {
        this.operateStatus = 'stage_2'
      },
      finishOperate1 () {
        try {
          this.operateResult = this.game.curPlayer.role.operate1(this.game.curPosition)(this.operateArgs)
          this.operateStatus = 'stage_3'
        } catch (e) {
          this.alert(e.message)
        }
      },
      nextOperate1 () {
        this.operateStatus = 'stage_1'
        this.operateArgs = []
        this.operateResult = ''
        this.game.operate1(this.game.curPosition + 1)
      },
      finishOperate2 () {
        try {
          this.operateResult = this.game.curPlayer.role.operate2(this.game.curPosition)()
          this.operateStatus = 'stage_3'
        } catch (e) {
          this.alert(e.message)
        }
      },
      nextOperate2 () {
        this.operateStatus = 'stage_1'
        this.operateArgs = []
        this.operateResult = ''
        this.game.operate2(this.game.curPosition + 1)
      },
      finishArgue () {
        try {
          this.operateResult = this.game.getKillResult()(this.operateArgs)
        } catch (e) {
          this.alert(e.message)
        }
      },
      restart () {
        let playerCount = localStorage.getItem('gamePlayerCount') || DEFAULT_PLAYER_COUNT
        let operateTimeout = localStorage.getItem('gameOperateTimeout') || DEFAULT_OPERATE_TIMEOUT
        let rolesString = localStorage.getItem('gameRolesString')
        this.game = new Game(playerCount, operateTimeout)
        if (rolesString && rolesString.length) {
          this.$nextTick(() => {
            this.rolesString = rolesString
          })
        }
        this.operateStatus = 'stage_1'
        this.operateArgs = []
      }
    }
    // beforeRouteEnter (to, from, next) {
    //   // Api.getSetting().then(response => {
    //   //   console.log(response)
    //   //   next()
    //   // })
    //   setTimeout(() => {
    //     next()
    //   }, 1000)
    // }
  }
</script>

<style lang="postcss" scoped>
  .index {

    .head {
      .global-restart {
        position: relative;
        margin: 10px 15px ;
        text-align: left;
        text-decoration: underline;
        color: #e24546;
        &:before {
          content: '';
          position: absolute;
          top: -5px;
          right: -5px;
          bottom: -5px;
          left: -5px;
        }
      }
      margin-bottom: 40px;
    }

    h1, h2 {
      font-weight: normal;
    }

    .rule {
      .text {
        padding: 15px;
        text-align: center;
        vertical-align: center;
      }
    }

    .operate {
      .role {
        margin-top: 30px;
        text-align: center;
        vertical-align: center;
        .role-name {
          font-size: 20px;
          color: #ff5568;
        }
      }
      .detail {

      }
      .operate-result {
        margin-top: 10px;
        color: #ff5568;
      }
    }

    .result {
      .log {
        margin: 10px 15px 0 15px;
        font-size: 13px;
        li {
          display: block;
          text-align: left;
        }
      }
    }

    .operate-log {
      font-size: 14px;
      color: #aaa;
    }

    .footer-placeholder {
      width: 100%;
      height: 42px;
    }

    footer {
      padding: 0 16px 16px;
    }

  }
</style>
