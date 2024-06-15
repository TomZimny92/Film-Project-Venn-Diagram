<template>
    <div class="autocomplete">
        <input 
            type="text"
            v-model="testInputValue"
            @input="filterOptions"
            @keydown.down="highlightNext"
            @keydown.up="highlightPrev"
            @keydown.enter="selectOption"
        />
        <ul v-if="filteredOptions.length" class="options-list">
            <li
                v-for="(option, index) in filteredOptions" 
                :key="index"
                :class="{ 'highlighted': index === highlightedIndex }"
                @mousedown.prevent="selectOption(option)"
            >
                {{ option }}
            </li>
        </ul>            
    </div>
</template>

<script setup lang="ts">
    let props: any = defineProps({
        options: {
            type: Array
        }
    })
    let testInputValue = defineModel()
    let filteredOptions: Ref<string[]> = ref([])
    let highlightedIndex: number = -1

    const filterOptions = () => {
        const query = testInputValue.value.toLowerCase()
        filteredOptions.value = props.options.filter((option: string) => option.toLowerCase().includes(query))
        highlightedIndex = -1
    }

    const highlightNext = () => {
        if (filteredOptions.value.length === 0) return
        highlightedIndex = (highlightedIndex + 1) % filteredOptions.value.length

    }

    const highlightPrev = () => {
        if (filteredOptions.value.length === 0) return
        highlightedIndex = (highlightedIndex - 1 + filteredOptions.value.length) % filteredOptions.value.length
    }

    const selectOption = (index = highlightedIndex) => {
        if (index >= 0 || index < filteredOptions.value.length){
            testInputValue.value = filteredOptions.value[index]
            filteredOptions.value = []
            highlightedIndex = -1
        }
    }
</script>

<style>
    .autocomplete {
    position: relative;
    width: 300px;
    margin: 0 auto;
    border: 1px solid black;
    }

    input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    }

    .options-list {
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid #ccc;
    border-top: none;
    max-height: 150px;
    overflow-y: auto;
    background: #fff;
    }

    .options-list li {
    padding: 8px;
    cursor: pointer;
    }

    .options-list li.highlighted {
    background: blue;
    }
</style>