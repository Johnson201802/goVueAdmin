<template>
  <div class="components-container">
    <el-drag-select v-model="value" style="width:500px;" multiple placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-drag-select>

    <div style="margin-top:30px;">
      <el-tag v-for="item of value" :key="item" style="margin-right:15px;">
        {{ item }}
      </el-tag>
    </div>
  </div>
</template>

<script>
import ElDragSelect from '@/components/DragSelect' // base on element-ui

export default {
  name: 'DragSelectDemo',
  components: { ElDragSelect },
  data() {
    return {
      value: ['1', '2', '3'],
      options: [{
        value: '1',
        label: 'Apple'
      }, {
        value: '2',
        label: 'Banana'
      }, {
        value: '3',
        label: 'Orange'
      }, {
        value: '4',
        label: 'Pear'
      }, {
        value: '5',
        label: 'Strawberry'
      }]
    }
  }
}
</script>
