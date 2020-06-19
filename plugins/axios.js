export default function ({$axios}) {
    $axios.onError(error => {
        if (error.response.status === 400){
            console.log("error 400")
        }

    })
}
