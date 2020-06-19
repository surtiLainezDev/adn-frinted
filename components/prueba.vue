<template>
    <vs-navbar v-model="activeItem" class="nabarx">
        <div slot="title">
            <vs-navbar-title>
                {{sucursal}}
            </vs-navbar-title>
        </div>

        <vs-navbar-item index="0" v-if="tipoUser == 1 || tipoUser == 2 || permisos.includes(1)">
            <vs-dropdown >
                <a class="a-icon" href="#">
                    Colaborador
                    <vs-icon icon="expand_more"></vs-icon>
                </a>

                <vs-dropdown-menu>
                    <div class="row">
                        <div v-if="tipoUser == 2 || tipoUser == 1" class="col">
                            <vs-dropdown-item to="/colaborador/">
                                Administración de Colaborador
                            </vs-dropdown-item>
                            <vs-dropdown-item   to="/colaborador/contratos">
                                Contratos
                            </vs-dropdown-item>
                            <vs-dropdown-item divider>
                                Colaboradores
                            </vs-dropdown-item>
                        </div>
                        <div class="col" v-if="permisos.includes(1)">
                            <vs-dropdown-item v-if="permisos.includes(11)" to="/colaborador/planillas/nuevo">
                                Crear Planilla
                            </vs-dropdown-item>
                            <vs-dropdown-item v-if="permisos.includes(12)" to="/colaborador/planillas/">
                                Planillas
                            </vs-dropdown-item>
                            <vs-dropdown-item v-if="permisos.includes(13)" to="/colaborador/planillas/planillas">
                                Planillas Pendientes
                            </vs-dropdown-item>
                            <vs-dropdown-item divider>
                                Planillas
                            </vs-dropdown-item>
                        </div>
                    </div>
                </vs-dropdown-menu>
            </vs-dropdown>
        </vs-navbar-item>


        <vs-navbar-item index="0" v-if="permisos.includes(4)">
            <vs-dropdown >
                <a class="a-icon" href="#">
                    Contanbilidad
                    <vs-icon icon="expand_more"></vs-icon>
                </a>
                <vs-dropdown-menu >
                    <vs-dropdown-item v-if="permisos.includes(41)" to="/contabilidad/">
                        Catalogo
                    </vs-dropdown-item>
                    <vs-dropdown-item v-if="permisos.includes(42)" to="/contabilidad/cajas">
                        Cajas
                    </vs-dropdown-item>
                    <vs-dropdown-item v-if="permisos.includes(44)" to="/contabilidad/cajas_chicas">
                        Cajas Chicas
                    </vs-dropdown-item>
                    <vs-dropdown-item v-if="permisos.includes(43)" to="/contabilidad/bancos">
                        Bancos
                    </vs-dropdown-item>
                </vs-dropdown-menu>
            </vs-dropdown>
        </vs-navbar-item>


        <vs-navbar-item index="0" v-if="tipoUser == 1">
            <vs-dropdown >
                <a class="a-icon" href="#">
                    Administrador
                    <vs-icon icon="expand_more"></vs-icon>
                </a>
                <vs-dropdown-menu>
                    <vs-dropdown-item  to="/usuarios/">
                        Administración de Usuarios
                    </vs-dropdown-item>
                    <vs-dropdown-item  to="/usuarios/nuevo">
                        Creación de Usuarios
                    </vs-dropdown-item>
                    <vs-dropdown-item  to="/usuarios/modulos">
                        Módulos
                    </vs-dropdown-item>
                    <vs-dropdown-item to="/administrador/sucursales/">
                        Sucursales
                    </vs-dropdown-item>
                    <vs-dropdown-item  to="/administrador/sucursales/nuevo">
                        Crear Sucursal
                    </vs-dropdown-item>
                    <vs-dropdown-item  to="/colaborador/nuevo">
                        Crear Colaborador
                    </vs-dropdown-item>
                </vs-dropdown-menu>
            </vs-dropdown>
        </vs-navbar-item>

        <vs-navbar-item index="1">
            <vs-button  color="success" disabled="true" type="flat" >{{user}}</vs-button>
        </vs-navbar-item>
        <vs-navbar-item index="2" icon="exit_to_app">
            <vs-button  color="danger" @click="logout" type="flat" icon="exit_to_app">Salir</vs-button>
        </vs-navbar-item>
    </vs-navbar>
</template>

<script>
    export default {
        name: "prueba"
    }
</script>

<style scoped>

</style>
