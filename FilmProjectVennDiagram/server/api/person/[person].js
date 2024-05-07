
export default defineEventHandler(async (event) => {

    const { person } = event.context.params    
    //console.log(`person: ${person}`)
    const { baseUrl } = useRuntimeConfig()
    const { accessToken } = useRuntimeConfig()

    //const uri = `https://api.themoviedb.org/3/search/person?query=${person}&include_adult=false&language=en_US$page=1`

    const uri = `${baseUrl}search/person?query=${person}&include_adult=false&language=en_US$page=1`
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    }
    const personData = await $fetch(uri, options)
        //.then(personData => personData = JSON.stringify(personData))
    const personResult = []
    for (let i = 0; i < personData.results.length; ++i){
        if (personData.results[i].popularity > 1){
            const relevantDetails = {
                fullName: String,
                id: Number,
                popularity: Number,
                profilePicture: String,
                job: String
            }
            relevantDetails.fullName = personData.results[i].name
            relevantDetails.id = personData.results[i].id
            relevantDetails.popularity = personData.results[i].popularity
            relevantDetails.profilePicture = personData.results[i].profile_path
            relevantDetails.job = personData.results[i].known_for_department
            personResult.push(relevantDetails) 
        }
        
    }
 
   
    //console.log(personData)
    return personResult 
})

