<template>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :loading="isLoading"
    :pagination="false"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'leadStatus'">
        <span
          :style="{
            backgroundColor: record.leadStatus.color,
            display: 'inline-block',
            borderRadius: '4px',
            paddingInline: '4px',
          }"
          >{{ record.leadStatus.name }}</span
        >
      </template>
      <template v-if="column.key === 'responsibileUser'">
        <a-flex align="center" gap="small">
          <a-avatar size="small" style="background-color: #68a1d0">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <span>{{ record.responsibileUser }}</span>
        </a-flex>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import type { LeadsData } from '../types/LeadsData';
import type { ColumnsType } from 'ant-design-vue/es/table';

const { dataSource, columns, isLoading } = defineProps<{
  dataSource: LeadsData;
  columns: ColumnsType;
  isLoading: boolean;
}>();
</script>

<style>
.ant-table-content {
  padding: 1rem;
}
</style>
