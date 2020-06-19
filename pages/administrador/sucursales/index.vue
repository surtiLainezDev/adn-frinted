<template>
    <vs-card style="padding: 5px">

        <div class="row">
            <div class="col-md-2">
                <side-small/>
            </div>
            <div class="col-md-10">
                <div class="row" v-if="isReload">
                    <div class="col">
                        <vs-progress  indeterminate color="success">primary</vs-progress>
                    </div>
                </div>
                <vs-table v-model="selectedTable" max-items="10" pagination search :data="datosSucursal">
                    <template slot="header">
                        <div class="row">
                            <div class="col">
                                <h4>Sucursales</h4>
                            </div>
                            <div class="col">
                                <vs-button color="success" @click="sucursalNuevoRedirect"
                                           type="flat" icon="add_circle"></vs-button>
                                <vs-button color="warning" @click="reloadPage"
                                           type="flat" icon="sync"></vs-button>
                            </div>
                        </div>
                    </template>
                    <template slot="thead">
                        <vs-th>Nombre</vs-th>
                        <vs-th>Abreviatura </vs-th>
                        <vs-th>Email</vs-th>
                        <vs-th>Telefono</vs-th>
                        <vs-th>Ubicación</vs-th>
                        <vs-th class="d-flex justify-content-center">Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" :data="tr" v-for="(tr, indextr) in data" >
                            <vs-td :data="data[indextr].id">{{data[indextr].nombre}}</vs-td>
                            <vs-td :data="data[indextr].abreviatura">{{data[indextr].abreviatura}}</vs-td>
                            <vs-td :data="data[indextr].email">{{data[indextr].email}}</vs-td>
                            <vs-td :data="data[indextr].telefono">{{data[indextr].telefono}}</vs-td>
                            <vs-td :data="data[indextr].ciudad">{{data[indextr].ciudad}}, {{data[indextr].depto}}</vs-td>
                            <vs-td class="d-flex justify-content-center">
                                <vs-button @click="popupEdit"
                                           color="warning" size="small" type="flat" icon="edit"></vs-button>
                                <vs-button color="success" @click="goSucursal(tr)" size="small" type="flat" icon="visibility"></vs-button>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
                <vs-popup :title="'Editando Sucursal '+selectedTable.nombre " :active.sync="isPopup">
                    <div class="bodyPopup">
                        <div class="row">
                            <div class="col-auto">
                                <label for="">Agregar Sucursal al Catálogo Contable: </label>
                            </div>
                            <div class="col" v-if="selectedTable.isContable === 0">
                                <vs-switch @click="selectedTable.isContable = !selectedTable.isContable"
                                           v-model="selectedTable.isContable" />
                            </div>
                            <div class="col" v-else>
                                <vs-switch v-model="selectedTable.isContable" />
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-auto"><label >Nombre:</label></div>
                            <div class="col">
                                <input type="text"
                                       :class="{ 'is-invalid': $v.selectedTable.nombre.$error}"
                                       v-model.trim="$v.selectedTable.nombre.$model"
                                       class="form-control form-control-sm">
                                <div v-if="$v.selectedTable.nombre.$error">
                                    <div class="error" v-if="!$v.selectedTable.nombre.required">Este campo es requerido.</div>
                                    <div class="error" v-if="!$v.selectedTable.nombre.min">Este campo debe tener mínimo 10 carácteres.</div>
                                    <div class="error" v-if="!$v.selectedTable.nombre.max">Este campo no debe ser mayor a 50 carácteres.</div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-2"><label >Abreviatura:</label></div>
                            <div class="col-md-2">
                                <input type="text"
                                       :class="{ 'is-invalid': $v.selectedTable.abreviatura.$error}"
                                       v-model.trim="$v.selectedTable.abreviatura.$model"
                                       class="form-control form-control-sm">
                                <div v-if="$v.selectedTable.abreviatura.$error">
                                    <div class="error" v-if="!$v.selectedTable.required">Este campo es requerido.</div>
                                    <div class="error" v-if="!$v.selectedTable.min">Este campo debe tener mínimo 3 carácteres.</div>
                                    <div class="error" v-if="!$v.selectedTable.max">Este campo no debe ser mayor a 5 carácteres.</div>
                                </div>
                            </div>
                            <div class="col-md-2"><label >Correo:</label></div>
                            <div class="col-md-6">
                                <input type="text"
                                       :class="{ 'is-invalid': $v.selectedTable.email.$error}"
                                       v-model.trim="$v.selectedTable.email.$model" class="form-control form-control-sm">
                                <div v-if="$v.selectedTable.email.$error">
                                    <div class="error" v-if="!$v.selectedTable.email.email">Este campo tiene que ser un correo valido.</div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-2"><label >Telefono:</label></div>
                            <div class="col-md-3">
                                <input type="text"
                                       :class="{ 'is-invalid': $v.selectedTable.telefono.$error}"
                                       v-model.trim="$v.selectedTable.telefono.$model" class="form-control form-control-sm">
                                <div v-if="$v.selectedTable.telefono.$error">
                                    <div class="error" v-if="!$v.selectedTable.telefono.numeric">Este campo es solo acepta números.</div>
                                    <div class="error" v-if="!$v.selectedTable.telefono.min">Este campo debe tener mínimo 8 carácteres.</div>
                                    <div class="error" v-if="!$v.selectedTable.telefono.max">Este campo no debe ser mayor a 8 carácteres.</div>
                                </div>
                            </div>
                            <div class="col-md-2"><label >Ubicación:</label></div>
                            <div class="col-md-5">
                                <input type="text" disabled :value="selectedTable.ciudad+', '+selectedTable.depto" class="form-control form-control-sm">
                            </div>
                        </div>

                        <div class="row">
                            <div class="col form-group">
                                <label>Dirección:</label>
                                <textarea
                                        :class="{ 'is-invalid': $v.selectedTable.dir.$error}"
                                        v-model.trim="$v.selectedTable.dir.$model"
                                        cols="20" rows="2" class="form-control form-control-sm"></textarea>
                                <div v-if="$v.selectedTable.dir.$error">
                                    <div class="error" v-if="!$v.selectedTable.dir.required">Este campo es requerido.</div>
                                    <div class="error" v-if="!$v.selectedTable.dir.max">Este campo no debe ser mayor a 400 carácteres.</div>
                                </div>
                            </div>
                        </div>
                        <vs-divider></vs-divider>
                        <div class="row">
                            <div class="col-md-8" v-if="erroresServidor">
                                <ErroresServidor :errores="erroresServidor"/>
                            </div>
                            <div class="col-md-4 d-flex justify-content-end">
                                <vs-button @click="verificarForm" color="success" type="filled">Registrar Cambios</vs-button>
                            </div>
                        </div>
                    </div>
                </vs-popup>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import sideSmall from "../../../components/menus/sideSmall";
    import ErroresServidor from "../../../components/ErroresServidor";
    import {email, maxLength, minLength, numeric, required} from "vuelidate/lib/validators";
    import reload from "../../../middleware/reload";
    export default {
        name: "sucursales",
        data(){
            return{
                isPeticion:      false,
                isReload:        true,
                isPopup:         false,
                selectedTable:   [],
                erroresServidor: [],
                datosSucursal:   [],
                isContable:      false,
                select:          []
            }
        },
        components:{
            sideSmall,
            ErroresServidor
        },
        mounted() {
            this.reloadPage();
        },
        validations:{
            selectedTable:{
                nombre:{required, min:minLength(10), max:maxLength(50)},
                abreviatura:{required, min:minLength(3), max:maxLength(5)},
                email:{email},
                telefono: {min:minLength(8), max:maxLength(8), numeric},
                dir: {required, max:maxLength(400)}
            }
        },
        methods:{
            goSucursal(tr){
                this.$router.replace({path:"/administrador/sucursales/"+tr.id})
            },
            sucursalNuevoRedirect: function () {
                this.$router.replace({path:"/administrador/sucursales/nuevo"})
            },
            popupEdit: function () {
                this.selectedTable = this.select
                this.erroresServidor = [];
                this.isPopup = true
            },
            verificarForm: function () {
                this.erroresServidor = [];
                this.$v.$touch()
                if (this.$v.$invalid) {
                    this.erroresServidor = ['Tienes que completar todos los campos.']
                    // si en input del formulario falla se activara al alerta
                } else {
                    setTimeout(() => {
                        this.editarSucursal()
                    }, 500)
                }
            },
            editarSucursal: function () {
                this.$axios.put('/sucursales/'+this.selectedTable.id,{
                    nombre:      this.selectedTable.nombre,
                    abreviatura: this.selectedTable.abreviatura,
                    dir:         this.selectedTable.dir,
                    telefono:    this.selectedTable.telefono,
                    email:       this.selectedTable.email,
                    isContable:  this.selectedTable.isContable
                },{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.data.error){
                        this.erroresServidor = res.data.error
                    }else if (res.data.status){
                        this.$vs.notify({
                            title: 'Cambio Exitoso',
                            text: `Se registro el cambio exitosamente de la sucursal ${this.selectedTable.nombre}.`,
                            color: 'success',
                            position: 'top-right'
                        });
                        this.isPopup = false
                        this.reloadPage();
                    }
                }).catch((res)=>{
                    alert("falta")
                })
            },
            reloadPage: function () {
                this.isReload = true
                this.$axios.get('/sucursales',{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token
                    }
                }).then((res)=>{
                    this.isReload = false
                    this.datosSucursal = res.data.suc
                })
            }
        }
    }
</script>

<style scoped lang="stylus">
    .bodyPopup
        padding 5px
    .bodyPopup .row
        margin-top 20px
    .error
        color red
</style>
