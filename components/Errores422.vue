<template>
    <div>
        <div v-for="(item, indice, index) in errores">
            <vs-alert  color="danger" icon="new_releases"
                       v-for="(i,a) in item" style="margin-top: 5px">
                <span>{{item[a]}}</span>
            </vs-alert>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Errores422",
        data(){
          return{
              errors: []
          }
        },
        props:{
            errores: Object
        },
        // mounted() {
        //     for (let err in this.errores){
        //         for (let suberror in error.response.data.errors[err]){
        //             this.erroresServidor.push(error.response.data.errors[err][suberror])
        //         }
        //     }
        // }
    }
</script>

<style scoped>

</style>
