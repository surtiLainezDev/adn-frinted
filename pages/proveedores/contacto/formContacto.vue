<template>
    <div>
        <div class="row">
            <div class="col form-group">
                <label >Proveedor</label>
                <select class="form-control-sm form-control" v-model="contactos.proveedor">
                    <option v-for="item in Proveedores" :value="item.id">{{item.nombre}}</option>
                </select>
            </div>
        </div>
        <div class="row"><div class="col form-group">
            <label>Nombre Completo</label>
            <input type="text" class="form-control form-control-sm"
                   v-model="contactos.nombre">
        </div></div>
        <div class="row">
            <div class="col-md-3 form-group">
                <label>Teléfono</label>
                <input type="text" class="form-control form-control-sm"
                       v-model="contactos.telefono">
            </div>
            <div class="col-md-5 form-group">
                <label>Correo Eléctronico</label>
                <input type="text" class="form-control form-control-sm"
                       v-model="contactos.email">
            </div>
            <div class="col-md-4 form-group">
                <label>Puesto</label>
                <input type="text" class="form-control form-control-sm" v-model="contactos.puesto">
            </div>
        </div>
        <div class="row"><div class="col form-group">
            <label >Observación</label>
            <input type="text" class="form-control form-control-sm" v-model="contactos.observacion">
        </div></div>
        <vs-divider></vs-divider>
        <div class="row">
            <div class="col d-flex justify-content-end">
                <vs-button v-if="estado" color="success" @click="registrarContacto">Registrar Cambios del Contacto</vs-button>
                <vs-button v-else color="success" @click="registrarContacto">Registrar Contacto</vs-button>
            </div>
        </div>
        <div v-if="erroresServidor">
            <errores422 :errores="erroresServidor"/>
        </div>
    </div>
</template>

<script>
    import Errores422 from "../../../components/Errores422";
    import EventBus from "../../../plugins/Bus";
    export default {
        name: "formContacto",
        components:{Errores422},
        props:{
          estado: Boolean
        },
        data(){
            return{
                Proveedores: null,
                erroresServidor:{},
                contactos:{
                    nombre: null,
                    proveedor: null,
                    telefono: null,
                    email:null,
                    puesto: null,
                    observacion: null
                }
            }
        },
        created() {
            this.cargarProveedores()
        },
        methods:{
            cargarProveedores(){
                this.$axios.get('proveedores',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                       this.Proveedores = res.data.proveedores
                    }
                })
            },
            registrarContacto(){

                this.$axios.post('proveedores_contactos',{
                    nombre:      this.contactos.nombre,
                    proveedor:   this.contactos.proveedor,
                    telefono:    this.contactos.telefono,
                    email:       this.contactos.email,
                    puesto:      this.contactos.puesto,
                    observacion: this.contactos.observacion
                },{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.$vs.notify({
                            text: `Se registró el contacto ${this.contactos.nombre} correctamente.`,
                            title: 'Registro exitoso',
                            position: 'top-right',
                            color: 'success'
                        })
                        this.component(contactos).recargarcontactos()
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

<style scoped>

</style>
