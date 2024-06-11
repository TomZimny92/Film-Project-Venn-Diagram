<template>
    <div>
        <input
           v-model="inputValue"
           @keyup="filterSearchBar"
           :placeholder="label"
           type="text"
            class="p-1 border-solid border-2 border-gray-300"
           v-bind="$attrs"
           @input="$emit('update:inputValue', $event.target.value)"
           @focus="inputFocus = true"
           @keydown.down="highlightNext"
        /> 
        <ul role="listbox" v-if="filteredResults && inputValue !== '' && inputFocus === true" class="person-list">
            <li v-for="(person, index) in filteredResults" 
                :key="person.id" 
                @click="selectPerson(person)" 
                
                :class="{ higlighted: index === highlightedIndex }"
                role="option"
                >
                <div class="person-image">
                    <img :src="`${imageUrl}${person.profilePicture}`" height="100" width="67" loading="eager" />
                </div>
                <div class="person-details">
                    <div class="person-name">
                        {{ person.fullName }}
                    </div>
                    <div class="person-job">
                        ({{ person.job }})
                    </div>
                </div>
               
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import type { PersonData } from '../types/types'
    let filteredResults: Ref<PersonData[]> = ref([])
    const imageUrl: string = 'https://image.tmdb.org/t/p/w500/'
    const inputValue = defineModel()
    let personId: number | undefined
    const label: string ='Enter name...'

    const emit = defineEmits(['add', 'input', 'update', 'update:inputValue'])

    let inputFocus: Ref<boolean> = ref(true)
    let highlightedIndex: number = -1

    const selectPerson = (person: PersonData) => {
        inputValue.value = person.fullName
        personId = person.id
        filteredResults.value = []
    }

    const filterSearchBar = async () => {
        if (inputValue.value){
            filteredResults.value = []
            try {
                const {data} = await useFetch(`/api/person/${inputValue.value}`)
                console.log(data.value)
                await sortSearchBarResults(data.value, 'popularity')
            }
            catch (error) {
                console.log(error)
            }
            
        }
    }

    const sortSearchBarResults = async (data: any, popularity: string) => {
        await sort(data, popularity)
        filteredResults.value = data
    }

    const selectSearchBarOption = (event: KeyboardEvent) => {
        let listIndex: number = -1
        if (event.key === 'ArrowDown') {
            if (filteredResults.value.length > 0) {
                listIndex++
                filteredResults.value[listIndex].focus = true
            }
        }
    }

    const highlightNext = () => {
        if (filteredResults.value.length === 0){
            return
        }
        highlightedIndex = (highlightedIndex + 1) % filteredResults.value.length
    }

    const highlightPrevious = () => {
        if (highlightedIndex > 0) {
            highlightedIndex--
        }
    }

    const isCurrentIndex = (filteredResultIndex: number) => {
        return filteredResultIndex === highlightedIndex
    }



</script>


<style scoped>
    .person-list {
        list-style-type: none;
        background-color: blue;
        display: flex;
    }
    .person-list:hover {
        background-color: brown;
        list-style-type: none;
        display: flex;
    }
    .person-list li.highlighted {
        background: #ddd;
    }
    .person-image {
        display: inline;   
        
    }
    .person-name {
        display: block;
        
        font-weight: bold;
        font-size: 19px;
    }
    .person-job {
        display: inline;
        font-weight: italic;
    }
    .person-details {
        display: block;
    }
</style>
