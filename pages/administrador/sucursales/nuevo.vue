<template>
    <vs-card style="padding: 5px">
        <div class="row">
            <div class="col-md-2">
                <side-small/>
            </div>
            <div class="col-md-10">
                <div class="row">
                    <div class="col-auto"><h5>Creando Sucursal</h5></div>
                    <div class="col">
                        <vs-progress v-if="isPeticion" indeterminate color="success"></vs-progress>
                    </div>
                </div>
                <vs-divider></vs-divider>

                <div class="row">
                    <div class="col-md-4 form-group">
                        <label >Departamento</label>
                        <select class="form-control form-control-sm" v-model="depto" @change="cargarMunicipios">
                            <option v-for="item in Departamentos" :value="item.id">{{item.nombre}}</option>
                        </select>
                    </div>
                    <div class="col-md-4 form-group">
                        <label >Municipio</label>
                        <select class="form-control form-control-sm" v-model="newSucursal.municipio" @change="cargarCiudades">
                            <option v-for="item in municipios" :value="item.id">{{item.nombre}}</option>
                        </select>
                    </div>
                    <div class="col-md-4 form-group">
                        <label >Ciudad/Aldea/Caserio</label>
                        <select class="form-control form-control-sm"
                                :class="{'is-invalid': $v.newSucursal.ciudad.$error}"
                                v-model.trim="newSucursal.ciudad">
                            <option v-for="item in ciudades" :value="item.id">{{item.nombres}}</option>
                        </select>
                        <div v-if="$v.newSucursal.ciudad.$error">
                            <div class="error" v-if="!$v.newSucursal.ciudad.required">Este campo es requerido.</div>
                            <div class="error" v-if="!$v.newSucursal.ciudad.numeric">Este campo tiene que ser un numérico.</div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-9 form-group">
                        <label >Nombre de la Sucursal</label>
                        <input type="text" class="form-control form-control-sm"
                               :class="{ 'is-invalid': $v.newSucursal.nombre.$error}"
                               v-model.trim="$v.newSucursal.nombre.$model"
                               >
                        <div v-if="$v.newSucursal.nombre.$error">
                            <div class="error" v-if="!$v.newSucursal.nombre.required">El nombre de la sucursal es requerido.</div>
                            <div class="error" v-if="!$v.newSucursal.nombre.min">El nombre de la sucursal debe tener mínimo 10 carácteres.</div>
                            <div class="error" v-if="!$v.newSucursal.nombre.max">El nombre de la sucursal no debe ser mayor a 50 carácteres.</div>
                        </div>
                    </div>
                    <div class="col-md-3 form-group">
                        <label >Abreviatura</label>
                        <input type="text" class="form-control form-control-sm"
                               :class="{ 'is-invalid': $v.newSucursal.abreviatura.$error}"
                               v-model.trim="$v.newSucursal.abreviatura.$model">
                        <div v-if="$v.newSucursal.abreviatura.$error">
                            <div class="error" v-if="!$v.newSucursal.abreviatura.required">La abreviatura es requerida.</div>
                            <div class="error" v-if="!$v.newSucursal.abreviatura.min">La abreviatura debe tener mínimo 3 carácteres.</div>
                            <div class="error" v-if="!$v.newSucursal.abreviatura.max">La abreviatura debe tener máximo 5 carácteres.</div>
                        </div>
                    </div>
                </div>


                <div class="row">
                    <div class="col-md-4 form-group">
                        <label >Correo Eléctronico</label>
                        <input type="text" class="form-control form-control-sm"
                               :class="{ 'is-invalid': $v.newSucursal.email.$error}"
                               v-model.trim="$v.newSucursal.email.$model">
                        <div v-if="$v.newSucursal.email.$error">
                            <div class="error" v-if="!$v.newSucursal.email.email">Este campo tiene que ser un correo.</div>
                        </div>
                    </div>
                    <div class="col-md-4 form-group">
                        <label >Telefono</label>
                        <input type="text" class="form-control form-control-sm"
                               :class="{ 'is-invalid': $v.newSucursal.telefono.$error}"
                               v-model.trim="$v.newSucursal.telefono.$model">
                        <div v-if="$v.newSucursal.telefono.$error">
                            <div class="error" v-if="!$v.newSucursal.telefono.numeric">Este campo tiene que ser numérico.</div>
                            <div class="error" v-if="!$v.newSucursal.telefono.min">Este campo tiene que tener mínimo 8 carácteres.</div>
                            <div class="error" v-if="!$v.newSucursal.telefono.max">Este campo tiene que tener máximo 8 carácteres. </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col form-group">
                        <label >Dirección Completa</label>
                        <textarea cols="20" rows="2" :class="{ 'is-invalid': $v.newSucursal.direccion.$error}"
                                  class="form-control form-control-sm" v-model.trim="$v.newSucursal.direccion.$model"></textarea>
                        <div v-if="$v.newSucursal.direccion.$error">
                            <div class="error" v-if="!$v.newSucursal.direccion.required">La dirección es requerida.</div>
                            <div class="error" v-if="!$v.newSucursal.direccion.max">La dirección debe tener máximo 400 carácteres.</div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col form-group d-flex justify-content-end">
                        <vs-button color="success" :disabled="isPeticion" @click="verificarForm" type="filled">Registrar Sucursal</vs-button>
                    </div>
                </div>

                <div class="row" v-if="erroresServidor" style="padding: 15px">
                    <ErroresServidor :errores="erroresServidor"/>
                </div>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import { required, minLength, numeric , maxLength, email} from 'vuelidate/lib/validators'
    import sideSmall from "../../../components/menus/sideSmall";
    import ErroresServidor from "../../../components/ErroresServidor";
    export default {
        data(){
            return{
                erroresServidor: [],
                isAlert:true,
                depto: null,
                municipios: null,
                ciudades: null,
                newSucursal:{
                    municipio:null,
                    ciudad: null,
                    nombre: null,
                    abreviatura: null,
                    email: null,
                    telefono: null,
                    direccion: null
                },
                isSubmit:null,
                isAlert:null,
                isPeticion: false,
            }
        },
        validations:{
            newSucursal:{
                nombre:{required, min:minLength(10), max:maxLength(50)},
                abreviatura:{required, min:minLength(3), max:maxLength(5)},
                email:{email},
                telefono: {min:minLength(8), max:maxLength(8), numeric},
                ciudad: {required, numeric},
                direccion: {required, max:maxLength(400)}
            }
        },
        name: "nuevo",
        components:{
            sideSmall,
            ErroresServidor
        },
        asyncData({$axios, store}){
            return $axios.get('/departamentos', {
                headers:{
                    'Authorization': `Bearer ${store.state.token}`
                }
            }).then((res)=>{
                return{
                    Departamentos: res.data.depto
                }
            })
        },
        methods:{
            cargarMunicipios: function () {
                this.isPeticion = true
                this.$axios.get('/municipios/'+this.depto,{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token
                    }
                }).then((res)=>{
                    this.municipios = res.data.municipios
                    this.isPeticion = false
                })
            },
            cargarCiudades: function () {
                this.isPeticion = true
                this.$axios.get('/ciudades/'+this.newSucursal.municipio,{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token
                    }
                }).then((res)=>{
                    this.ciudades = res.data.ciudades
                    this.isPeticion = false
                })
            },
            verificarForm: function () {
                this.erroresServidor = [];
                this.$v.$touch()
                if (this.$v.$invalid) {
                    this.isAlert= true
                    this.erroresServidor = ['Tienes que llenar todos los campos.']
                    // si en input del formulario falla se activara al alerta
                } else {
                    this.isSubmit = 'PENDING'
                    setTimeout(() => {
                        this.isSubmit = 'OK'
                        this.isAlert = false //La alerta se desactivara
                        this.RegistrarSucursal()
                    }, 500)
                }
            },
            RegistrarSucursal: function () {
                this.isPeticion = true
                this.$axios.post('/sucursales',{
                    nombre:      this.newSucursal.nombre,
                    abreviatura: this.newSucursal.abreviatura,
                    email:       this.newSucursal.email,
                    telefono:    this.newSucursal.telefono,
                    ciudad:      this.newSucursal.ciudad,
                    direccion:   this.newSucursal.direccion
                },{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token
                    }
                }).then((res)=>{
                    this.erroresServidor = []
                    this.isPeticion = false
                    if (res.data.error){
                        for ( let index in res.data.error){
                            this.erroresServidor.push(res.data.error[index][0])
                        }
                    }else if (res.data.status){
                        this.$vs.notify({
                            title: 'Registro Exitoso',
                            text: `Se registro exitosamente la sucursal ${this.newSucursal.nombre}.`,
                            color: 'success',
                            position: 'top-right'
                        });
                        this.$router.replace({path:"/administrador/sucursales/"})
                    }
                })
            }
        },
    }
</script>

<style scoped lang="stylus">
.error
    color red
</style>
