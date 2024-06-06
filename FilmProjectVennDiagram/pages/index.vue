<template>
    <div>
        <div class="action-container">
            <div class="action-buttons">
                <button
                    @click="addSearchBar"
                    class="">Add
                </button>
                <button
                    @click="removeSearchBar"
                    class="">Remove
                </button>
                <button 
                    @click="submitNames(inputValue)"
                    class="">MATCH!
                </button>
            </div>

            <div class="search-bars">
                <SearchBarCompApi v-for="searchBar, index in inputValue" 
                    :key="searchBar.id" 
                    v-model="inputValue[index].value"
                    class="search-bar"
                />
            </div>
    
        </div>
       
        <div class="results-container">
            <div v-for="movie in movies" :key="movie.id" class="movie-result">
                <h2>{{ movie.title }}</h2>
                <h3>{{ movie.releaseDate }}</h3>
                <img :src="`${imageUrl}${movie.posterPath}`">
                
            </div>
        </div>
            
        </div>

</template>

<script setup lang="ts">
import type {MovieData, PersonData} from "../types/types"

    let personData = ref<PersonData[] | null>(null)
    let movieCreditResults = ref<MovieData[] | null>(null)
    let inputValue = ref<SearchBar[]>([])
    type SearchBar = {
        id: number,
        value: string
    }
    let searchBarCount: number = 2
    let movies = ref([])
    let imageUrl: string = 'https://image.tmdb.org/t/p/w500'

    const getPersonData = async(person: string) => {
        const {data} = await useFetch<PersonData | null>(`/api/person/${person}`)
        personData.value?.push(data as PersonData)
    }

    const submitNames = async(searchBars: SearchBar[]) => {        
        personData.value = []
        for (let i = 0; i < searchBars.length; ++i){
            await getPersonData(searchBars[i].value)
        }
        
        await retrieveMovies()
        if (movieCreditResults.value !== null){
            //crossReference(movieCreditResults.value)
            await crossReference2(movieCreditResults.value)
        }
        else {
            console.log('movieCreditResults is null')
        } 
    }

    const retrieveMovies = async() => {
        let people: number[] = []
        if (personData.value !== null){
            for (let i = 0; i < personData.value.length; ++i){
                people.push(personData.value[i].value[0].id)
            }
        }
        else {
            console.log('personData is null')
        }
       
        movieCreditResults.value = []
        if (people.length > 1){
            for (let i = 0; i < people.length; ++i){
                await getMovieData(people[i])
            }
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

    const crossReference2 = async(movieCreditResults: MovieData[]) => {
        const matchedMovies: MovieData[] = []
        let totalMovies: MovieData[] = []
        for (let i = 0; i < movieCreditResults.length; ++i){
            movieCreditResults[i].movies.forEach(movie => {
                totalMovies.push(movie)
            })
        }

        matchMovies(totalMovies)
    }

    const matchMovies = async(totalMovies: MovieData[]) => {
        const countMap = new Map<string, number>()
        totalMovies.forEach(movie => {
            const movieStr = JSON.stringify(movie)

            if (countMap.has(movieStr)){
                countMap.set(movieStr, (countMap.get(movieStr) || 0)+ 1)
            }
            else {
                countMap.set(movieStr, 1)
            }
        })
        // countMap = {key, value}
        const matchedMovies: MovieData[] = []
        countMap.forEach((movie, key) => {
            if (movie === searchBarCount){
                console.log(JSON.parse(key))
                matchedMovies.push(JSON.parse(key))
            }
           //console.log(`movie: ${movie}`)
           //console.log(`key: ${key}`)
        })

        movies.value = matchedMovies
        await sortMovieResults(movies.value)
    }

    const addSearchBar = () => {
        searchBarCount++
        let searchBar: SearchBar = {id: searchBarCount, value: ''}
        inputValue.value.push(searchBar)
    }

    const removeSearchBar = () => {
        if (searchBarCount > 0 && searchBarCount >= 2) {
            searchBarCount--
            inputValue.value.pop()
        }
        // add fun error message when user tries to remove one of the last two search bars
    }

    const computeSearchBars = onMounted(() => {
        for (let i = 0; i < searchBarCount; ++i){
            let searchBar: SearchBar = {id: i+1, value: ''}
            inputValue.value.push(searchBar)

        }
    })

</script>

     
<style scoped>
    .action-container {
        border: 1px solid black;
        margin: 1rem;
        padding: 2rem 2rem;
        display: flex;
        align-items: baseline;
    }
    .action-buttons {
        display: inline-block;

        
    }
    .action-buttons button {
        margin: 5px;
        padding: 5px;       
        background-color: darkgreen;
        color: white;
        border-radius: 15px;
        display: flex;
        width: 100%;
        justify-content: center;
    }
    .search-bars {
        display: inline-flex;
        padding: 1em;
        width: min-content;
    }
    .search-bar {

    }
    .movie-result {
        display: inline;
        padding: 1em;
        width: 25%;
    }
    .results-container {
        display: flex;
        justify-content: space-around;
        align-items: stretch;
        flex-wrap: wrap;
    }
</style>