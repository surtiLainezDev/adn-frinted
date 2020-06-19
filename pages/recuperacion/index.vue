<template>
    <div class="container-fluid">
        <div class="d-flex justify-content-center">
            <div class="row" style="width: 50%">
               <div class="col">
                   <br>
                   <br>
                   <br>
                   <vs-card>
                       <div class="row">
                           <div class="col-md-10">
                               <h6 class="text-center">Recuperación de Contraseña</h6>
                           </div>
                           <div class="col-md-2">
                               <nuxt-link to="/">Volver atras</nuxt-link>
                           </div>
                       </div>
                       <div class="row" v-if="isPeticion">
                           <div class="col">
                               <vs-progress indeterminate color="success"></vs-progress>
                           </div>
                       </div>
                       <div class="row" v-if="erroresServidor">
                           <div class="col">
                               <errores-servidor :errores="erroresServidor"/>
                           </div>
                       </div>
                        <vs-divider></vs-divider>
                       <div class="row">
                           <div class="col">
                               <p>Ingresa el correo eléctronico con el que inicias sesión al sistema, se te
                               enviará un código al correo que luego tienes que ingresar cuando se te pida.</p>
                           </div>
                       </div>
                       <div class="row">
                           <div class="col-md-6 form-group">
                               <label>Correo Eléctronico</label>
                               <input :class="{'is-invalid': $v.correo.$error}"
                                       v-model.trim="$v.correo.$model" type="email"
                                      class="form-control form-control-sm">
                               <div v-if="$v.correo.$error">
                                   <div class="error" v-if="!$v.correo.email">Este campo tiene que ser un correo.</div>
                                   <div class="error" v-if="!$v.correo.required">Este campo es reuqerido.</div>
                               </div>
                           </div>
                           <div class="col-md-6">
                               <label>Identidad o Número de ingreso</label>
                               <input :class="{'is-invalid': $v.identidad.$error}"
                                       v-model.trim="$v.identidad.$model"
                                      type="email" class="form-control form-control-sm">
                               <div v-if="$v.identidad.$error">
                                   <div class="error" v-if="!$v.identidad.numeric">Este campo tiene que ser un númerico</div>
                                   <div class="error" v-if="!$v.identidad.required">Este campo es reqerido.</div>
                                   <div class="error" v-if="!$v.identidad.num">Este campo tiene que tener 6 números para ser Numero de Ingreso</div>
                                   <div class="error" v-if="!$v.identidad.id">Este campo tiene que tener 13 números para ser Identidad</div>
                               </div>
                           </div>
                       </div>
                       <div class="row">
                           <div class="col d-flex justify-content-end">
                               <vs-button @click="verificarForm(1)" :disabled="isPeticion"
                                          color="warning" type="filled">Enviar Código al correo</vs-button>
                           </div>
                       </div>
                       <vs-divider></vs-divider>
                       <div v-if="isCodigo">
                           <div class="row">
                               <div class="col">
                                   <p>Ingresa el código que se te envio al correo. Si no haz recibido el código en tu correo
                                   puedes volver a enviartelo.</p>
                               </div>
                           </div>
                           <div class="row">
                               <div class="col-md-2">
                                   <label>Código</label>
                               </div>
                               <div class="col-md-8">
                                   <input  :class="{'is-invalid': $v.codigo.$error}"
                                           v-model.trim="$v.codigo.$model"
                                           type="text" class="form-control form-control-sm">
                                   <div v-if="$v.codigo.$error">
                                       <div class="error" v-if="!$v.codigo.min">Este campo tiene que ser de 6 carácteres.</div>
                                       <div class="error" v-if="!$v.codigo.max">Este campo no puede ser mayor a 6 carácteres.</div>
                                       <div class="error" v-if="!$v.codigo.required">Este campo es reuqerido.</div>
                                   </div>
                               </div>
                               <div class="col-md-2 d-flex justify-content-end">
                                   <vs-button  @click="verificarForm(2)" color="warning" type="filled">Validar Código</vs-button>
                               </div>
                           </div>
                       </div>
                   </vs-card>
               </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ErroresServidor from "../../components/ErroresServidor";
    import { required, minLength, numeric , maxLength, email} from 'vuelidate/lib/validators'
    export default {
        name: "index",
        components:{
            ErroresServidor
        },
        layout:'contrasena',
        data(){
            return{
                isPeticion: false,
                isCodigo: false,
                correo: null,
                identidad:null,
                erroresServidor: [],
                repCorreo: null,
                codigo: null,
            }
        },
        validations(){
            if (this.isCodigo){
                return{
                    codigo:{required, min:minLength(6), max:maxLength(6)},
                    correo:{required, email},
                    identidad:{required, numeric, num:minLength(6), id:maxLength(13)}
                }
            }else{
                return {
                    correo:{required, email},
                    identidad:{required, numeric, num:minLength(6), id:maxLength(13)}
                }
            }
        },
        methods:{
            verificarForm: function (val) {
                if (val === 1){
                    this.isCodigo = false
                }
                this.erroresServidor = [];
                this.$v.$touch()
                if (this.$v.$invalid) {
                    this.erroresServidor = ['Tienes que llenar todos los campos.']
                } else {
                    setTimeout(() => {
                        if (val === 1){
                            this.enviarCodigo()
                        }else if (val === 2){
                            this.validarCodigo()
                        }
                    }, 500)
                }
            },
            validarCodigo: function(){
                this.isPeticion = true
                this.$axios.post('validar_codigo',{
                    correo:    this.repCorreo,
                    codigo: this.codigo
                }).then((res)=>{
                    this.isPeticion = false
                    if (res.status === 200){
                        this.$router.replace({path:'/recuperacion/'+res.data.cod})
                    }
                }).catch((error)=>{
                    this.isPeticion = false
                    this.erroresServidor.push(error.response.data)
                })
            },
            enviarCodigo: function () {
                this.isPeticion = true
                this.$axios.post('recuperacion_password',{
                    correo:    this.correo,
                    identidad: this.identidad
                }).then((res)=>{
                    if (res.status === 200){
                        this.isPeticion = false
                        this.isCodigo= true
                        this.$vs.notify({
                            title:'Solicitud Exitosa',
                            text:'El código se ha generado exitosamente y se ha enviado al correo ingresado',
                            position:'top-right',
                            color:'success'
                        })
                        this.repCorreo = this.correo
                    }
                }).catch((error)=>{
                    this.isPeticion = false
                    this.erroresServidor.push(error.response.data)
                })
            }
        }
    }
</script>

<style scoped lang="stylus">
.error
    color red
</style>
