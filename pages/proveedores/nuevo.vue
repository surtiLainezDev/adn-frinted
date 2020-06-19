<template>
<vs-card>
    <div class="row">
        <div class="col-md-2"><side-colaboradores/></div>
        <div class="col-md-10">
            <tituloh5 titulo="Creando Nuevo Proveedor"/>
            <vs-progress indeterminate v-if="isPeticion" color="success"></vs-progress>
            <div class="row">
                <div class="col-md-9" style="margin-top: 12px">
                    <div class="row">
                        <div class="col-md-5 form-group">
                            <label>Nombre del Proveedor</label>
                            <input v-model.trim="$v.proveedor.nombre.$model"
                                    type="text" class="form-control form-control-sm">
                            <div v-if="$v.proveedor.nombre.$error">
                                <div class="error" v-if="!$v.proveedor.nombre.required">{{errores.required}}</div>
                                <div class="error" v-if="!$v.proveedor.nombre.max">{{errores.max}} 10.</div>
                                <div class="error" v-if="!$v.proveedor.nombre.min">{{errores.min}} 3.</div>
                            </div>
                        </div>
                        <div class="col-md-3 form-group">
                            <label>Rtn</label>
                            <input  v-model.trim="$v.proveedor.rtn.$model"
                                    type="text" class="form-control form-control-sm">
                            <div v-if="$v.proveedor.rtn.$error">
                                <div class="error" v-if="!$v.proveedor.rtn.required">{{errores.required}}</div>
                                <div class="error" v-if="!$v.proveedor.rtn.max">{{errores.max}} 20.</div>
                                <div class="error" v-if="!$v.proveedor.rtn.min">{{errores.min}} 14.</div>
                            </div>
                        </div>
                        <div class="col-md-2 form-group">
                            <label>País</label>
                            <input  v-model.trim="$v.proveedor.pais.$model"
                                    type="text" class="form-control form-control-sm">
                            <div v-if="$v.proveedor.pais.$error">
                                <div class="error" v-if="!$v.proveedor.pais.required">{{errores.required}}</div>
                                <div class="error" v-if="!$v.proveedor.pais.max">{{errores.max}} 30.</div>
                            </div>
                        </div>
                        <div class="col-md-2 form-group">
                            <label>Código Postal</label>
                            <input v-model.trim="$v.proveedor.postal.$model"
                                    type="text" class="form-control form-control-sm">
                            <div v-if="$v.proveedor.postal.$error">
                                <div class="error" v-if="!$v.proveedor.postal.required">{{errores.required}}</div>
                                <div class="error" v-if="!$v.proveedor.postal.max">{{errores.max}} 7.</div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 form-group">
                            <label>Correo Eléctronico</label>
                            <input v-model="proveedor.email"
                                    type="text" class="form-control form-control-sm">
                        </div>
                        <div class="col-md-4 form-group">
                            <label>Teléfono</label>
                            <input v-model.trim="$v.proveedor.telefono.$model"
                                    type="text" class="form-control form-control-sm">
                            <div v-if="$v.proveedor.telefono.$error">
                                <div class="error" v-if="!$v.proveedor.telefono.required">{{errores.required}}</div>
                                <div class="error" v-if="!$v.proveedor.telefono.min">{{errores.min}} 8.</div>
                                <div class="error" v-if="!$v.proveedor.telefono.max">{{errores.max}} 13.</div>
                            </div>
                        </div>
                        <div class="col-md-4 form-group">
                            <label>Swift</label>
                            <input v-model="proveedor.swift"
                                    type="text" class="form-control form-control-sm">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <label>Dirección</label>
                            <input v-model.trim="$v.proveedor.direccion.$model"
                                    type="text" class="form-control form-control-sm">
                            <div v-if="$v.proveedor.direccion.$error">
                                <div class="error" v-if="!$v.proveedor.direccion.required">{{errores.required}}</div>
                                <div class="error" v-if="!$v.proveedor.direccion.min">{{errores.min}} 10.</div>
                                <div class="error" v-if="!$v.proveedor.direccion.max">{{errores.max}} 450.</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="row">
                        <div >
                            <vs-upload id="logoFileP" color="success" @change="logoProveedor"
                                        limit="1" :show-upload="false"
                                       text="Logo del Proveedor"/>
                        </div>
                    </div>
                </div>
            </div>
            <vs-divider></vs-divider>
            <div class="row">
                <div class="col d-flex justify-content-end">
                    <vs-button :disabled="isPeticion" @click="verificarForm" color="success">Registrar Proveedor</vs-button>
                </div>
            </div>

            <div v-if="erroresServidor">
                <errores422 :errores="erroresServidor"/>
            </div>


        </div>
    </div>
</vs-card>
</template>

<script>
    import sideColaboradores from "../../components/menus/sideColaboradores";
    import { required, minLength, maxLength} from 'vuelidate/lib/validators'
    import tituloh5 from "../../components/tituloh5";
    import Errores422 from "../../components/Errores422";
    export default {
        name: "nuevo",
        components:{
            sideColaboradores, tituloh5, Errores422
        },
        data(){
            return{
                errores:{
                    required: 'Este campo es requerido.',
                    min: 'Este campo lo mínimo de carácteres que acepta son ',
                    max: 'Este campo lo máximo de carácteres que acepta son ',
                    email: 'Este campo tiene que ser un correo valido.',
                    numeric: 'Este campo solo acepta datos númericos.'
                },
                proveedor:{
                    nombre: null,
                    rtn:    null,
                    pais: 'Honduras',
                    postal: null,
                    direccion: null,
                    email:  'xxxxx@xxxxx.xxx',
                    telefono: null,
                    swift: 'xxxxxxxxx',
                },
                erroresServidor:{},
                logoP:null,
                isPeticion: false
            }
        },
        validations:{
            proveedor: {
                nombre:  {required, min:minLength(3), max:maxLength(100)},
                rtn:   {required, min:minLength(14), max:maxLength(20)},
                pais: {required, max:maxLength(30)},
                postal: {required, max:maxLength(7)},
                direccion: {required, min:minLength(10), max:maxLength(450)},
                telefono:{required, min:minLength(8), max:maxLength(13)}
            }
        },
        methods:{
            verificarForm: function () {
                this.erroresServidor = {};
                this.$v.$touch()
                if (this.$v.$invalid) {
                    this.erroresServidor = {err: ['Tienes que cumplir los requerimientos de los campos.']}
                    // si en input del formulario falla se activara al alerta
                } else {
                    setTimeout(() => {
                        this.registrarProveedor()
                    }, 500)
                }
            },
            logoProveedor(){
                this.logoP = document.getElementById("logoFileP").files[0];
            },
            registrarProveedor(){
                this.isPeticion = true
                let data = new FormData();
                data.append('nombre', this.proveedor.nombre);
                data.append('rtn', this.proveedor.rtn);
                data.append('pais', this.proveedor.pais);
                data.append('codigo_postal', this.proveedor.postal);
                data.append('direccion', this.proveedor.direccion);
                data.append('email', this.proveedor.email);
                data.append('telefono', this.proveedor.telefono);
                data.append('swift', this.proveedor.swift);
                data.append('logo', this.logoP);
                this.$axios({
                    method: 'post',
                    url: 'proveedores',
                    data:data,
                    headers:{
                        'Authorization': 'Bearer ' + this.$store.state.token,
                        'Content-Type': "multipart/form-data"
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.$vs.notify({
                            text: 'El registro del proveedor '+this.proveedor.nombre+' ha sido exitoso.',
                            title: 'Registro Exitoso',
                            color: 'success',
                            position: 'top-right'
                        })
                        this.isPeticion = false
                        this.$router.replace({path:'/proveedores/'})
                    }
                }).catch((error)=>{
                    if (error.response.status === 422){
                        this.erroresServidor = error.response.data.errors
                    }
                })
            }
        }
    }
</script>

<style scoped lang="stylus">
    .subir
        height 100px
        width 100px
        background-color orangered
    .error
        color red
</style>
