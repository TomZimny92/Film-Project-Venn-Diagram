<template>
    <input v-model="modelValue" /> 
</template>

<script setup lang="ts">
    const modelValue = defineModel({type: String})
</script>