<template>
    <div>
        <div class="container">
            <div class="action-container">
                <div class="search-bar">
                    <SearchBarCompApi v-for="searchBar, index in inputValue" 
                        :key="searchBar.id" 
                        v-model="inputValue[index].value"
                        class="action-element"
                    />
                    <div class="action-element">
                        <button
                            @click="addSearchBar"
                            class="p-1 border-solid border-2 border-gray-300"
                        >Add</button>
                    </div>
                    <div class="action-element">
                        <button 
                            @click="submitNames(inputValue)"
                            class="p-1 border-solid border-2 border-gray-300"    
                        >TestApi</button>
                            
                    </div>
                </div>
                
            </div>
            
            <div class="results-container">
                <div class="movie-result-wrapper">
                    <div v-for="movie in movies" :key="movie.id" class="movie-result">
                        <h2>{{ movie.title }}</h2>
                        <h3>{{ movie.releaseDate }}</h3>
                        <img :src="`${imageUrl}${movie.posterPath}`">
                        
                    </div>
                </div>
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

    const computeSearchBars = onMounted(() => {
        for (let i = 0; i < searchBarCount; ++i){
            let searchBar: SearchBar = {id: i+1, value: ''}
            inputValue.value.push(searchBar)

        }
    })

</script>

     
<style scoped>
    .container {
        width: 100%;
    }
    .action-container {
            width: 100%; /* or any specific width */
            white-space: nowrap; /* prevents wrapping to the next line */
    }
    .action-element {
            display: inline-block;
            background-color: lightblue; /* just for visualization */
            padding: 20px; /* just for visualization */
            margin: 5px; /* space between items */
            vertical-align: top; /* optional: to align items at the top */        
    }
    .results-container {
        width: 100%;
    }
    .movie-result {
        width: 25%; /* or any specific width */
        margin-bottom: 10px; /* space between divs */
        background-color: lightblue; /* just for visualization */
        padding: 20px; /* just for visualization */
    }
    .movie-result-wrapper {
        width: 100%;
        border: solid 1px black;

    }
</style>