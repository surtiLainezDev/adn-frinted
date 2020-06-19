<template>
    <div class="d-flex justify-content-center">
        <div class="w-25">
            <vs-card actionable>
                <div slot="header">
                    <div class="row">
                        <div class="col">
                            <strong>Bienvenido {{colaborador}} !</strong>
                        </div>
                    </div>
                </div>
                <div slot="media">
                    <img src="https://ign-surti.nyc3.digitaloceanspaces.com/sl.jpg">
                </div>
                <vs-divider></vs-divider>
                <p>Este sístema está aun en desarrollo. Esta es una versión de prueba. Si detectas un error o una mejora
                hazlo saber a surtilainez.it@gmail.com.</p>
            </vs-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        computed:{
            colaborador:function () {
                return this.$store.state.colaborador
            }
        }
    }
</script>

<style scoped>

</style>
