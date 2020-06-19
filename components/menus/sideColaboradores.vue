<template>
    <ul class="list-group">
        <li v-if="tipoUser == 1 || tipoUser == 2" class="list-group-item"><nuxt-link  to="/colaborador/">Colaboradores</nuxt-link></li>
        <li v-if="tipoUser == 1 || tipoUser == 2" class="list-group-item"><nuxt-link   to="/colaborador/contratos">Contratos</nuxt-link></li>
        <li v-if="permisos.includes(11)" class="list-group-item"><nuxt-link  to="/colaborador/planillas/nuevo">Crear planillas</nuxt-link></li>
        <li v-if="permisos.includes(12)" class="list-group-item"><nuxt-link  to="/colaborador/planillas/">Planillas</nuxt-link></li>
        <li v-if="permisos.includes(13)" class="list-group-item"><nuxt-link  to="/colaborador/planillas/planillas">Planillas pendientes</nuxt-link></li>
        <li v-if="permisos.includes(41)" class="list-group-item"><nuxt-link  to="/contabilidad/">Catalogo Contable</nuxt-link></li>
        <li v-if="permisos.includes(42)" class="list-group-item"><nuxt-link  to="/contabilidad/cajas">Cajas</nuxt-link></li>
        <li v-if="permisos.includes(44)" class="list-group-item"><nuxt-link  to="/contabilidad/cajas_chicas">Cajas Chicas</nuxt-link></li>
        <li v-if="permisos.includes(43)" class="list-group-item"><nuxt-link  to="/contabilidad/bancos">Bancos</nuxt-link></li>
        <li v-if="permisos.includes(43)" class="list-group-item"><nuxt-link  to="/proveedores/nuevo">Crear Proveedor</nuxt-link></li>
        <li v-if="permisos.includes(43)" class="list-group-item"><nuxt-link  to="/proveedores/">Proveedores</nuxt-link></li>
        <li v-if="permisos.includes(43)" class="list-group-item"><nuxt-link  to="/proveedores/contactos">Contectos de Proveedores</nuxt-link></li>
    </ul>
</template>

<script>
    export default {
        name: "sideColaboradores",
        computed:{
            tipoUser: function () {
                return this.$store.state.tipoUsuario
            },
            permisos:function () {
                return this.$store.state.permisosUser
            }
        }
    }
</script>

<style scoped lang="stylus">
    .links
        color #17c964
</style>
