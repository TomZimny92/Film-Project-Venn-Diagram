<template>
    <div>
        <input
           v-model="inputValue"
           @keyup="filterSearchBar"
           :placeholder="label"
           v-bind="$attrs"
           @input="$emit('update:inputValue', $event.target.value)"
        /> 
        <ul v-if="filteredResults && inputValue !== ''">
            <li v-for="person in filteredResults" :key="person.id" @click="selectPerson(person)" class="person-list">
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
    let filteredResults: Ref<[]> = ref([])
    const imageUrl: string = 'https://image.tmdb.org/t/p/w500/'
    const inputValue = defineModel()
    //const model = defineModel()
    const label: string ='Enter name...'

    const emit = defineEmits(['add', 'input', 'update', 'update:inputValue'])

    const selectPerson = (person: String) => {
        inputValue.value = person.fullName
        filteredResults.value = []
    }

    const filterSearchBar = async () => {
        if (inputValue.value){
            filteredResults.value = []
            const {data} = await useFetch(`/api/person/${inputValue.value}`)
            await sortSearchBarResults(data.value, 'popularity')
        }
    }

    const sortSearchBarResults = async (data: any, popularity: string) => {
        await sort(data, popularity)
        filteredResults.value = data
    }

</script>


<style scoped>
    .person-list {
        list-style-type: none;
       
        display: flex;
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
