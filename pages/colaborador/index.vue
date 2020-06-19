<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2">
                <side-colaboradores/>
            </div>
            <div class="col-md-10">
                <div class="row" v-if="isPeticion">
                    <div class="col">
                        <vs-progress  indeterminate color="success"></vs-progress>
                    </div>
                </div>

                <vs-table v-model="selectedTable" @selected="redireccionarColaborador"
                          max-items="10" pagination search :data="Colaboradores">
                    <template slot="header">
                        <h4>Colaboradores</h4>
                    </template>

                    <template slot="thead">
                        <vs-th>Nombre Completo</vs-th>
                        <vs-th>Identidad</vs-th>
                        <vs-th>Correo</vs-th>
                        <vs-th>Telefono</vs-th>
                        <vs-th>Sucursal Asignada</vs-th>
                        <vs-th>Puesto</vs-th>
                        <vs-th>Estado</vs-th>
                    </template>

                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" :data="tr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].nombres">{{data[indextr].nombres}} {{data[indextr].apellidos}}</vs-td>
                            <vs-td :data="data[indextr].identidad">{{data[indextr].identidad}}</vs-td>
                            <vs-td :data="data[indextr].email">{{data[indextr].email}}</vs-td>
                            <vs-td :data="data[indextr].telefono">{{data[indextr].telefono}}</vs-td>
                            <vs-td :data="data[indextr].sucursal">{{data[indextr].sucursal}}</vs-td>
                            <vs-td :data="data[indextr].puesto">{{data[indextr].puesto}}</vs-td>
                            <vs-td :data="data[indextr].estado">
                                <vs-chip v-if="data[indextr].estado === 1" color="success">Activo</vs-chip>
                                <vs-chip v-if="data[indextr].estado === 0" color="danger">Inactivo</vs-chip>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>

            </div>
        </div>
    </vs-card>
</template>

<script>
    import sideColaboradores from "../../components/menus/sideColaboradores";
    export default {
        name: "index",
        components:{
            sideColaboradores
        },
        data(){
            return{
                Colaboradores: [],
                isPeticion:    false,
                selectedTable: [],
            }
        },
        methods:{
            cargarColaboradores: function () {
                this.isPeticion = true
                this.$axios.get('/colaboradores',{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token
                    }
                }).then((res)=>{
                    this.Colaboradores = res.data.colaboradores
                    this.isPeticion = false
                })
            },
            redireccionarColaborador: function () {
                this.$router.replace({path:'/colaborador/'+this.selectedTable.col})
            }
        },
        mounted() {
            this.cargarColaboradores();
        }
    }
</script>

<style scoped>

</style>
