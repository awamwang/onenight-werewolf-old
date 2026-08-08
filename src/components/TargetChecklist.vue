<template>
  <div class="target-checklist">
    <div class="title" v-if="title">{{ title }}</div>
    <van-checkbox-group v-model="innerValue" :max="max">
      <van-cell-group inset>
        <van-cell
          v-for="option in options"
          :key="option"
          clickable
          :title="`${option}号`"
          @click="toggle(option)"
        >
          <template #right-icon>
            <van-checkbox :name="option" @click.stop />
          </template>
        </van-cell>
      </van-cell-group>
    </van-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'TargetChecklist',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    max: {
      type: Number,
      default: 0
    }
  },
  emits: ['update:modelValue'],
  computed: {
    innerValue: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('update:modelValue', value.map(Number))
      }
    }
  },
  methods: {
    toggle (option) {
      const next = [...this.innerValue]
      const index = next.indexOf(option)
      if (index > -1) {
        next.splice(index, 1)
      } else {
        if (this.max > 0 && next.length >= this.max) {
          return
        }
        next.push(option)
      }
      this.innerValue = next
    }
  }
}
</script>

<style scoped>
.target-checklist {
  margin-top: 12px;
  text-align: left;
}

.title {
  margin: 0 16px 8px;
  color: #646566;
  font-size: 14px;
}
</style>
