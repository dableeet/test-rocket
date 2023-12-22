<template>
  <header>
    <a-flex style="height: 100%" justify="space-between" align="center">
      <h2 style="display: inline-block; margin: 0">Rocket Test</h2>
      <a-flex align="center" gap="small">
        <a-tooltip
          v-if="isLessThenThreeSymbols && hasTheSearchStarted"
          title="Поиск работает от 3 символов"
          placement="top"
        >
          <warning-outlined style="font-size: 1rem; color: rgb(243, 165, 20)" />
        </a-tooltip>
        <a-input
          placeholder="Найти..."
          style="width: 200px; height: 28px"
          @change="onChange"
          @input="debouncedSearch"
          :value="searchInput"
          ><template #suffix><search-outlined /></template
        ></a-input>
      </a-flex>
    </a-flex>
  </header>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { ChangeEvent } from 'ant-design-vue/es/_util/EventInterface';

import { SearchOutlined, WarningOutlined } from '@ant-design/icons-vue';

import debounce from 'debounce';

const { searchLead } = defineProps<{
  searchLead: (value?: string) => Promise<void>;
}>();

const searchInput = ref('');
const isLessThenThreeSymbols = ref(true);
const hasTheSearchStarted = ref(false);

function onChange(event: ChangeEvent) {
  const searchValue = event.target.value || '';

  searchInput.value = searchValue;

  if (searchValue) {
    hasTheSearchStarted.value = true;
  } else {
    hasTheSearchStarted.value = false;
  }

  if (searchValue.length > 3) {
    isLessThenThreeSymbols.value = false;
  } else {
    isLessThenThreeSymbols.value = true;
  }
}

function onInput(event: ChangeEvent) {
  const searchValue = event.target.value || '';

  if (!isLessThenThreeSymbols.value || !searchValue) {
    searchLead(searchValue);
  }
}

const debouncedSearch = debounce(onInput, 500);
</script>
<style scoped>
header {
  height: 3rem;
  border-bottom: 0.5px solid rgba(128, 128, 128, 0.194);
  padding-inline: 1rem;
}
</style>
