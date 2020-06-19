<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2">
                <side-small/>
            </div>
            <div class="col-md-10">
                <vs-progress v-if="isPeticion"
                             indeterminate color="success"></vs-progress>
                <div class="row">
                    <div class="col">
                        <vs-table v-model="selectedUsuarios" @selected="handleSelected"
                                  :data="usuarios" search max-items="10" pagination>
                            <template slot="header">
                                <h4>Usuarios</h4>
                            </template>
                            <template slot="thead">
                                <vs-th>Colaborador</vs-th>
                                <vs-th>Puesto</vs-th>
                                <vs-th>Usuario</vs-th>
                                <vs-th>Tipo</vs-th>
                                <vs-th>Correo</vs-th>
                                <vs-th>Num. Ingreso</vs-th>
                                <vs-th>Estado</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" :data="tr" v-for="(tr, indextr) in data" >
                                    <vs-td :data="data[indextr].nombres">{{data[indextr].nombres}} {{data[indextr].apellidos}}</vs-td>
                                    <vs-td :data="data[indextr].puesto">{{data[indextr].puesto}}</vs-td>
                                    <vs-td :data="data[indextr].usuario">{{data[indextr].usuario}}</vs-td>
                                    <vs-td :data="data[indextr].tipo">{{data[indextr].tipo}}</vs-td>
                                    <vs-td :data="data[indextr].email">{{data[indextr].email}}</vs-td>
                                    <vs-td :data="data[indextr].num_ingreso">{{data[indextr].num_ingreso}}</vs-td>
                                    <vs-td :data="data[indextr].estado">
                                        <vs-chip v-if="data[indextr].estado === 1" color="success">Activo</vs-chip>
                                        <vs-chip v-if="data[indextr].estado === 0" color="danger">Inactivo</vs-chip>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                </div>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import sideSmall from "../../components/menus/sideSmall";
    export default {
        name: "index",
        data(){
            return{
                usuarios: [],
                isPeticion: false,
                selectedUsuarios: null,

            }
        },
        components:{
            sideSmall
        },
        methods:{
            handleSelected() {
                this.$router.replace({path:'/usuarios/'+this.selectedUsuarios.user})
            },
        },
        async fetch (){
            this.isPeticion = true
            this.usuarios =(await this.$axios.get('/usuarios', {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.token
                }
            })).data.usuarios
            this.isPeticion = false
        }
    }
</script>

<style scoped>

</style>
