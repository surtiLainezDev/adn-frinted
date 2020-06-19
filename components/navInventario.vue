<template>
    <div style="height: 510px; overflow-y: scroll; padding: 15px">
        <h6 class="text-center">Menú</h6>
        <vs-divider></vs-divider>
        <div class="row"><div class="col"><b-link to="/inventario/">Menú</b-link></div></div>
        <div class="row"><div class="col"><b-link v-if="permisos.includes(310)" to="/inventario/articulos/nuevo">Articulo Nuevo</b-link></div></div>
        <div class="row"><div class="col"><b-link v-if="permisos.includes(32)" to="/inventario/ordenes-compra/nuevo">Crear orden de Compra</b-link></div></div>
        <div class="row"><div class="col"><b-link v-if="permisos.includes(39)" to="/inventario/articulos/">Inventario</b-link></div></div>
        <div class="row"><div class="col"><b-link v-if="permisos.includes(310)" to="/inventario/articulos/entrada">Ingresar Orden de Entrada</b-link></div></div>
    </div>
</template>

<script>
    export default {
        name: "navInventario",
        computed:{
            permisos:function () {
                return this.$store.state.permisosUser
            }
        }
    }
</script>

<style scoped>

</style>
