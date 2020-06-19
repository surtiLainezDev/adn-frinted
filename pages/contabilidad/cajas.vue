<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2"><side-colaboradores/></div>
            <div class="col-md-10">
                <!--                <div v-if="$fetchState.pending">-->
                <!--                    <vs-progress indeterminate color="success"></vs-progress>-->
                <!--                </div>-->
                <div >
                    <vs-progress v-if="isPeticion" color="success" indeterminate></vs-progress>
                    <tituloh5 titulo="Cajas"/>
                    <div class="row">
                        <div class="col-md-8">
                            <vs-table
                                    search
                                    max-items="10" pagination
                                    :data="Cajas">
                                <template slot="header">
                                    <h4>
                                        Cajas Activas
                                    </h4>
                                </template>
                                <template slot="thead">
                                    <vs-th>Sucursal</vs-th>
                                    <vs-th>Usuario</vs-th>
                                    <vs-th>Código</vs-th>
                                    <vs-th>Num.</vs-th>
                                    <vs-th class="d-flex justify-content-center">Acciones</vs-th>
                                </template>

                                <template slot-scope="{data}">
                                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" >
                                        <vs-td>
                                            {{data[indextr].nombre}}
                                        </vs-td>
                                        <vs-td >
                                            {{data[indextr].usuario}}
                                        </vs-td>
                                        <vs-td >
                                            {{data[indextr].codigo}}
                                        </vs-td>
                                        <vs-td >
                                            {{data[indextr].num_caja}}
                                        </vs-td>
                                        <vs-td class="d-flex justify-content-center">
                                            <vs-button  @click="popurEdit(data[indextr].suc,data[indextr].nombre, data[indextr].caja)"
                                                        radius color="warning" type="flat" icon="create"></vs-button>
                                            <vs-button @click="irCajas(data[indextr].caja)"
                                                       radius  color="success" type="flat" icon="visibility"></vs-button>
                                        </vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </div>
                        <div class="col-md-4">
                            <h6 class="text-center">Creando Caja</h6>
                            <div class="row">
                                <div class="col form-group">
                                    <label>Elegir Sucursal</label>
                                    <select v-model="caja.sucursal" class="form-control form-control-sm" @change="buscarUser">
                                        <option :value="item.id" v-for="item in Sucursales">{{item.nombre}}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col form-group">
                                    <label>Usuario Responsable</label>
                                    <select v-model="caja.user" v-if="Users" :class="{'disabled': Users}" class="form-control-sm form-control">
                                        <option  v-for="item in Users.users" :value="item.id">{{item.usuario}}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col form-group d-flex justify-content-end ">
                                    <vs-button size="small" :disabled="isBtn"  color="success" @click="saveCaja(1)" type="filled">Agregar Caja</vs-button>
                                </div>
                            </div>
                            <div class="row" v-if="erroresServidor">
                                <div class="col">
                                    <ErroresServidor :errores="erroresServidor"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <vs-prompt color="success"
                               title="Registro Exitoso"
                               accept-text="Aceptar"
                               @accept="cargarCajas"
                               button-cancel
                               :active.sync="prompt.state">
                        <div >
                            {{prompt.msg}}
                        </div>
                    </vs-prompt>
                    <vs-popup :title="caja.nombre" :active.sync="isPopup">
                        <div style="padding: 5px">
                            <div class="form-group">
                                <label>Usuario Responsable</label>
                                <select v-model="caja.user" v-if="Users" :class="{'disabled': Users}" class="form-control-sm form-control">
                                    <option  v-for="item in Users.users" :value="item.id">{{item.usuario}}</option>
                                </select>
                            </div>
                            <div class="form-group d-flex justify-content-end">
                                <vs-button size="small" :disabled="isBtn"  color="success" @click="saveCaja(2)" type="filled">Agregar Caja</vs-button>
                            </div>
                            <div class="row" v-if="erroresServidor">
                                <div class="col">
                                    <ErroresServidor :errores="erroresServidor"/>
                                </div>
                            </div>
                        </div>
                    </vs-popup>
                </div>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import sideColaboradores from "../../components/menus/sideColaboradores";
    import tituloh5 from "../../components/tituloh5";
    import ErroresServidor from "../../components/ErroresServidor";

    export default {
        name: "cajas",
        data(){
            return{
                isPopup:         false,
                prompt:          {
                    state: false,
                    msg:   '',
                },
                isBtn:           true,
                erroresServidor: [],
                isPeticion:      false,
                Sucursales:      null,
                Users:           null,
                caja:            {
                    sucursal:    null,
                    user: null,
                    nombre: null,
                    caja: null
                },
                editUser:        null,
                Cajas:           []
            }
        },
        methods:{
            irCajas(id){
                this.$router.replace({path:'/cajas/'+id})
            },
            popurEdit(suc,nombre, caja){
                this.isPopup       = true;
                this.caja.sucursal = suc
                this.caja.nombre   = nombre
                this.caja.caja     = caja
                this.buscarUser();
            },
            saveCaja(tipo){
                this.erroresServidor = []
                this.isBtn = true
                this.$axios.post('cajas',{
                    sucursal:    this.caja.sucursal,
                    user_id:     this.caja.user,
                    abreviatura: this.Users.abreviatura,
                    tipo:        tipo,
                    caja:        this.caja.caja
                },{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    this.isBtn = false
                    this.isPopup = false
                    if (res.status === 200){
                        this.caja.user = null
                        if (tipo === 1){
                            this.prompt.msg = `La caja en ${this.Users.nombre} se registro exitosamente.`
                        }else if (tipo == 2){
                            this.prompt.msg = `La caja en ${this.Users.nombre} ha sido actualizada exitosamente.`
                        }
                        this.prompt.state = true
                    }
                }).catch((error)=>{
                    this.isBtn = false
                    if (error.response.status === 422){
                        for (let err in error.response.data.errors){
                            for (let suberror in error.response.data.errors[err]){
                                this.erroresServidor.push(error.response.data.errors[err][suberror])
                            }
                        }
                    }
                })
            },
            buscarUser(){
                this.isPeticion = true
                this.$axios.get('buscar_user/'+this.caja.sucursal,{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.isBtn = false
                        this.Users = res.data.users
                        this.isPeticion = false
                    }
                })
            },
            cargarCajas(){
                this.$axios.get('cajas',{
                    headers:{
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    this.Cajas = res.data.cajas
                })
            },
            cargarSucursales(){
                this.$axios.get('/sucursales',{
                    headers:{
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    this.Sucursales = res.data.suc
                })
            }
        },
        created() {
            this.cargarCajas();
            this.cargarSucursales()
        },
        components:{
            sideColaboradores,
            tituloh5, ErroresServidor
        },
    }
</script>

<style scoped>

</style>
