<template>
    <ul class="list-group">
        <li class="list-group-item"><nuxt-link class="links" to="/usuarios/">Administración de Usuarios</nuxt-link></li>
        <li class="list-group-item"><nuxt-link class="links" to="/usuarios/nuevo">Creación de Usuarios</nuxt-link></li>
        <li class="list-group-item"><nuxt-link class="links" to="/usuarios/modulos">Módulos</nuxt-link></li>
        <li class="list-group-item"><nuxt-link class="links" to="/colaborador/nuevo">Crear Colaborador</nuxt-link></li>
        <li class="list-group-item"><nuxt-link class="links" to="/administrador/sucursales/nuevo">Crear Sucursales</nuxt-link></li>
        <li class="list-group-item"><nuxt-link class="links" to="/administrador/sucursales">Administración de Sucursales</nuxt-link></li>
        <li class="list-group-item"><nuxt-link to="#">Surtidora Laínez</nuxt-link></li>
    </ul>
</template>

<script>
    export default {
        name: "sideSmall"
    }
</script>

<style scoped lang="stylus">
.links
    color #17c964
</style>
