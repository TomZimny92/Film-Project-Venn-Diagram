export type { PersonData, MovieData }
type PersonData = {
    fullName?: string,
    id?: number,
    popularity?: number,
    profilePicture?: string,
    job?: string
}

type MovieData = {
    Id?: number,
    Title?: string,
    ReleaseDate?: string,
    PosterPath?: string,
    Popularity?: number       
}   
