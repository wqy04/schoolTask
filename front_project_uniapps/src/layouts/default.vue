<template>
  <wd-config-provider :theme="theme" :theme-vars="themeVars">
    <slot />
    <wd-toast />
    <wd-message-box />
  </wd-config-provider>
</template>

<script lang="ts" setup>
import { piniaUseStoreRefs } from '@/store'
import type { ConfigProviderThemeVars } from 'wot-design-uni'

const { theme } = piniaUseStoreRefs()

const themeVars = ref<ConfigProviderThemeVars>({})

watch(theme, (val) => {
  themeVars.value =
    val === 'light'
      ? {}
      : {
          colorTheme: 'red',
          buttonPrimaryBgColor: '#07c160',
          buttonPrimaryColor: '#fff',
        }
})
</script>
