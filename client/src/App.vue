<template>
  <a-flex vertical class="container">
    <Header :searchLead="fetchData" />
    <Table :dataSource="dataSource" :columns="columns" :isLoading="isLoading" />
  </a-flex>
</template>

<script lang="ts">
import axios from 'axios';

import Table from './components/Table.vue';
import Header from './components/Header.vue';

import type { LeadsData } from './types/LeadsData.ts';
import type { ColumnsType } from 'ant-design-vue/es/table';

export default {
  components: {
    Table,
    Header,
  },
  data() {
    return {
      dataSource: [] as LeadsData,
      columns: [
        {
          title: 'Название',
          key: 'name',
          dataIndex: 'name',
        },
        {
          title: 'Бюджет',
          key: 'price',
          dataIndex: 'price',
        },
        {
          title: 'Статус',
          key: 'leadStatus',
          dataIndex: 'leadStatus',
        },
        {
          title: 'Ответственный',
          key: 'responsibileUser',
          dataIndex: 'responsibileUser',
        },
        {
          title: 'Дата создания',
          key: 'createdAt',
          dataIndex: 'createdAt',
        },
      ] as ColumnsType,
      isLoading: false,
    };
  },

  methods: {
    async fetchData(searchValue?: string) {
      if (this.isLoading) return;

      this.isLoading = true;
      const url = 'http://localhost:3000';
      const endPoint = !searchValue
        ? '/api/leads'
        : `/api/leads?searchFilter=${searchValue}`;

      try {
        const { data } = await axios.get<LeadsData | 'not found'>(
          `${url + endPoint}`
        );

        if (data === 'not found') {
          this.isLoading = false;
          this.dataSource = [];
          return;
        }

        this.dataSource = data;
      } catch (error) {
        console.log(error);
      }
      this.isLoading = false;
    },
  },

  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.container {
  max-width: 1440px;
  min-width: fit-content;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  margin: auto;
  padding-bottom: 0.5rem;
}
</style>
