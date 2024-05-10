<template>
    <div>
        <div class="search-bars">
            <!--<SearchBar
                v-model="inputValue.searchBar1"
                label="Enter name..."
                type="text"
            />
            <SearchBar
                v-model="inputValue.searchBar2"
                label="Enter name..."
                type="text"
            />-->
            <SearchBarCompApi 
                v-model="inputValue.searchBar1"
                type="text"

            />
            <SearchBarCompApi 
                v-model="inputValue.searchBar2"
                type="text"
            />
            <TestComponent
                v-model="inputValue.searchBar1"
            />  
        </div>
        <div>
            <button @click="submitNames(inputValue.searchBar1, inputValue.searchBar2)">TestApi</button>
        </div>

        <div>
            <div v-for="movie in movies" :key="movie.id">
                <h2>{{ movie.title }}</h2>
                <img :src="`${imageUrl}${movie.posterPath}`">
                <h3>{{ movie.releaseDate }}</h3>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {MovieData, PersonData} from "../types/types"

    let personData = ref<PersonData[] | null>(null)
    let movieCreditResults = ref<MovieData[] | null>(null)
    let inputValue = reactive({
        searchBar1: '',
        searchBar2: ''
    })
    const count = ref(0)
    const movies = ref([])
    let imageUrl: string = 'https://image.tmdb.org/t/p/w500'

    const getPersonData = async(person: string) => {
        const {data} = await useFetch<PersonData | null>(`/api/person/${person}`)
        personData.value?.push(data as PersonData)
    }

    const submitNames = async(sb1: string, sb2: string) => {
        personData.value = []
        await getPersonData(sb1)
        await getPersonData(sb2)
        await retrieveMovies()
        if (movieCreditResults.value !== null){
            crossReference(movieCreditResults.value)
        }
        else {
            console.log('movieCreditResults is null')
        } 
    }

    const retrieveMovies = async() => {
        let personOne: number | undefined = 0
        let personTwo: number | undefined = 0 
        if (personData.value !== null){
            personOne = personData.value[0].value[0].id
            personTwo = personData.value[1].value[0].id
        }
        else {
            console.log('personData is null')
        }
       
        movieCreditResults.value = []
        if (personOne !== null && personTwo !== null){
            await getMovieData(personOne)
            await getMovieData(personTwo)
        }
       
    }

    const getMovieData = async(id?: number) => {
        const {data} = await useFetch<MovieData>(`/api/movies/${id}`)
        if (data !== null){
            movieCreditResults.value?.push(data.value)
        }
        
    }

    const sortMovieResults = async (movies: MovieData[]) => {
        const property = 'popularity'
        await sort(movies, property)
    }

    const crossReference = async(movieCreditResults: MovieData[]) => {
        const matchedMovies: MovieData[] = []
        for (let i = 0; i < movieCreditResults[0].movies.length; ++i){
            const movie1 = movieCreditResults[0].movies[i]

            for (let j = 0; j < movieCreditResults[1].movies.length; ++j){
                const movie2 = movieCreditResults[1].movies[j]
                if (movie1.id === movie2.id){
                    matchedMovies.push(movie1)
                }
            }
        }
        movies.value = matchedMovies
        await sortMovieResults(movies.value)
    }

</script>

     
<style scoped>
    .search-bars {
        display: flex;
    }
</style>