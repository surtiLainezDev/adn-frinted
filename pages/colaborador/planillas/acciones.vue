<template>
    <div class="row">
        <div class="col-md-6">
            <vs-card>
                <vs-list>
                    <vs-list-header color="success" title="Totales Agregados"></vs-list-header>
                    <vs-list-item v-if="index.tipo === 1" :title="index.nombre" v-for="index in item.acciones">
                        <strong>L {{index.total}}</strong>
                    </vs-list-item>
                    <vs-list-item title="Total"><strong>L {{item.total_agregado}}</strong></vs-list-item>
                </vs-list>
            </vs-card>
        </div>
        <div class="col-md-6">
            <vs-card>
                <vs-list>
                    <vs-list-header color="danger" title="Totales Deducidos"></vs-list-header>
                    <vs-list-item v-if="index.tipo === 2" :title="index.nombre" v-for="index in item.acciones">
                        <strong>L {{index.total}}</strong>
                    </vs-list-item>
                    <vs-list-item title="Total"><strong>L {{item.total_deducido}}</strong></vs-list-item>
                </vs-list>
            </vs-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "acciones",
        props:{
            item: Object,
        }
    }
</script>

<style scoped>

</style>
