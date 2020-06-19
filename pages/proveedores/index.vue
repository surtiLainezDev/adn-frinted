<template>
<vs-card>
    <div class="row">
        <div class="col-md-2"><side-colaboradores/></div>
        <div class="col-md-10">
            <vs-progress color="success" indeterminate v-if="isPeticion"></vs-progress>
            <vs-table @selected="goProveedor"
                      v-model="selectProveedor" stripe :data="Proveedores" search max-items="10" pagination>
                <template slot="header"><h5>Proveedores</h5></template>
                <template slot="thead">
                    <th>Nombre</th>
                    <th>Rtn</th>
                    <th>País</th>
                    <th>Correo Eléctronico</th>
                    <th>Teléfono</th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" :data="tr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].nombre">
                            <vs-chip color="#FFF" style="color: black" >
                                <vs-avatar v-if="data[indextr].logo" :src="data[indextr].logo"/>
                                <vs-avatar  v-else :text="data[indextr].nombre"/>
                                {{data[indextr].nombre}}
                            </vs-chip >
                        </vs-td>
                        <vs-td :data="data[indextr].rtn">{{data[indextr].rtn}}</vs-td>
                        <vs-td :data="data[indextr].pais">{{data[indextr].pais}}</vs-td>
                        <vs-td :data="data[indextr].email">{{data[indextr].email}}</vs-td>
                        <vs-td :data="data[indextr].telefono">{{data[indextr].telefono}}</vs-td>
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
                selectProveedor: null,
                Proveedores: [],
                isPeticion: false
            }
        },
        methods:{
            goProveedor(){
                this.$router.replace({path:'/proveedores/'+this.selectProveedor.id})
            }
        },
        async fetch (){
            this.isPeticion = true
            this.Proveedores =(await this.$axios.get('/proveedores/', {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.token
                }
            })).data.proveedores
            this.isPeticion = false
        }
    }
</script>

<style scoped>

</style>
