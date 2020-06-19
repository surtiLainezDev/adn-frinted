<template>
    <div class="row" v-for="item in data">
        <div class="col  d-flex justify-content-start">
            <vs-radio v-model="segundaPeticion" vs-value="1">{{item.nombre}}</vs-radio>
        </div>
    </div>
</template>

<script>
    export default {
        name: "buscador",
        props:{
            data: Object,
            buscador: String
        }
    }
</script>

<style scoped>

</style>
