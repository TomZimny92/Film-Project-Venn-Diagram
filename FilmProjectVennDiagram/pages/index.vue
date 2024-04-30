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
import Id from "~/server/api/movies/[id]"
import type {MovieData, PersonData} from "../types/types"

    let personData = ref<PersonData[] | null>(null)
    const movieCreditResults: Ref<MovieData>[]([null, null])
    let inputValue = reactive({
        searchBar1: '',
        searchBar2: ''
    })
    let movies = ref([])
    let imageUrl: string = 'https://image.tmdb.org/t/p/w500'

    const getPersonData = async(person: string) => {
        const {data} = await useFetch<PersonData | null>(`/api/person/${person}`)
        if (data !== null) {
            personData.value?.push(data as PersonData)
        }
    }

    const submitNames = async(sb1: string, sb2: string) => {
        personData.value = []
        await getPersonData(sb1)
        await getPersonData(sb2)
        await retrieveMoveies()
        crossReference(movieCreditResults)
    }

    const retrieveMovies = async() => {
        const personOne = personData.value[0].value[0].id
        const personTwo = personData.value[1].value[0].id
        movieCreditResults.value = []
        await getMovieData(personOne)
        await getMovieData(personTwo)
    }

    const getMovieData = async(id: string) => {
        const {data} = await useFetch<MovieData>(`/api/movies/${id}`)
        movieCreditResults.value.push(data)
    }

</script>

//export default {

    //methods: {
        //async getPersonData(person){
            //const {data} = await useFetch(`/api/person/${person}`)
            //this.personData.push(data)
        //},
        //async submitNames(sb1, sb2){
            //this.personData = []
            //await this.getPersonData(sb1)
            //await this.getPersonData(sb2)
            //await this.retrieveMovies()
            //this.crossReference(this.movieCreditResults)

        //},
        //async retrieveMovies() {
            //const personOne = this.personData[0].value[0].id
            //const personTwo = this.personData[1].value[0].id
            //this.movieCreditResults = []
            //await this.getMovieData(personOne)
            //await this.getMovieData(personTwo)        
        //},
        //async getMovieData(id){
            //const {data} = await useFetch(`/api/movies/${id}`)
            //this.movieCreditResults.push(data)
        //},

        //async sortMovieResults(movies){
            //const searchBar = this.$refs.SearchBar
            //if (searchBar){
                //await searchBar.quickSort(movies, 0, movies.length - 1, 'popularity')
            //}
            //const property = 'popularity'
            //return sort(movies, property)
        //},


        //async crossReference(movieCreditResults){
            //const matchedMovies = []
            //for (let i = 0; i < movieCreditResults[0].value.movies.length; ++i){
                //const movie1 = movieCreditResults[0].value.movies[i]

                //for (let j = 0; j < movieCreditResults[1].value.movies.length; ++j){
                    //const movie2 = movieCreditResults[1].value.movies[j]
                    //if (movie1.id === movie2.id){
                        //matchedMovies.push(movie1)
                    //}
                //}
            //}
            //this.movies = matchedMovies
            //await this.sortMovieResults(this.movies)
        //}
    //}
//}
     
<style scoped>
    .search-bars {
        display: flex;
    }
</style>