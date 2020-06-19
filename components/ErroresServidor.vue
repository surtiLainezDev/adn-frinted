<template>
    <div>
        <vs-alert  color="danger" icon="new_releases"
                   v-for="item in errores" style="margin-top: 5px">
            <span>{{item}}</span>
        </vs-alert>
    </div>
</template>

<script>
    export default {
        name: "ErroresServidor",
        props:{
            errores: Array
        }
    }
</script>

<style scoped>

</style>
