<template>
    <vs-card>
        <vs-progress indeterminate v-if="isPeticion" color="success"></vs-progress>
        <vs-table :data="Familias" search max-items="10" pagination>
            <template slot="header">
                <div class="row">
                    <div class="col-auto">
                        <h5>Familias Registradas</h5>
                    </div>
                    <div class="col-auto">
                        <vs-button icon="add" color="success" @click="nuevaFamilia" size="small">Crear Familia</vs-button>
                    </div>
                </div>
            </template>
            <template slot="thead">
                <th>Nombre</th>
                <th>Código
                <th>Acciones</th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" :data="tr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].nombre">{{data[indextr].nombre}}</vs-td>
                    <vs-td :data="data[indextr].codigo">{{data[indextr].codigo}}</vs-td>
                    <vs-td class="d-flex justify-content-center">
                        <vs-button size="small" @click="editarFamilia(data[indextr])" icon="create" color="warning"></vs-button>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>

        <b-sidebar v-model="sideFamilia" :title="tituloSide" right shadow width="450px">
            <div class="px-3 py-2">
                <vs-progress v-if="isPeticionSave" color="success" indeterminate></vs-progress>
                <vs-divider></vs-divider>
                <div class="row">
                    <div class="col form-group">
                        <label>Nombre de la familia</label>
                        <input type="text" class="form-control form-control-sm" v-model="Familia.nombre">
                    </div>
                </div>
                <div class="row">
                    <div class="col form-group">
                        <label>Código de la familia</label>
                        <input type="text" disabled="true" class="form-control form-control-sm" v-model="Familia.codigo">
                    </div>
                </div>
                <vs-divider></vs-divider>
                <small style="color: red" v-if="errorInput">Por favor llene todos los campos.</small>
                <div class="row">
                    <div class="col d-flex justify-content-end">
                        <vs-button @click="registrarFamilia" :disabled="isPeticionSave" color="success" v-if="usoSide">Registrar Familia</vs-button>
                        <vs-button @click="editandoFamilia" :disabled="isPeticionSave" color="success" v-else>Registrar Cambios</vs-button>
                    </div>
                </div>
            </div>
        </b-sidebar>

    </vs-card>
</template>

<script>
    import Errores422 from "../../../components/Errores422";
    export default {
        name: "familias",
        components:{
            Errores422
        },
        data(){
            return{
                isPeticion: false,
                isPeticionSave: false,
                Familias: [],
                tituloSide: null,
                usoSide: false,
                Familia:{
                    nombre: '',
                    codigo: '',
                    familia: null
                },
                errorInput: false,
                sideFamilia: false
            }
        },
        created() {
            this.cargarFamilias()
        },
        methods:{
            editarFamilia(item){
                this.tituloSide = 'Editando familia '+item.nombre;
                this.usoSide = false
                this.Familia.nombre = item.nombre
                this.Familia.codigo = item.codigo
                this.Familia.familia = item.id
                this.sideFamilia = true
            },
            editandoFamilia(){
                if (this.Familia.nombre && this.Familia.codigo) {
                    this.errorInput = false
                    this.isPeticionSave = true
                    this.$axios.put('familia/'+this.Familia.familia,{
                        nombre: this.Familia.nombre
                    },{
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.state.token
                        }
                    }).then((res)=>{
                        if (res.status === 200){
                            this.cargarFamilias()
                            this.isPeticionSave = false
                            this.sideFamilia = false
                            this.notificacion(`El cambio de la familia ${this.Familia.nombre} se registro exitosamente en la base de datos`,
                            'Registro de Cambios Exitoso','warning')
                            this.Familia.nombre = ''
                            this.Familia.codigo = ''
                            this.Familia.familia = null

                        }
                    })
                }else {
                    this.errorInput = true
                }
            },
            nuevaFamilia(){
                this.tituloSide = 'Creando una nueva familia';
                this.Familia.codigo = ''
                this.Familia.nombre = ''
                this.sideFamilia = true
                this.usoSide = true
            },
            registrarFamilia(){
                if (this.Familia.nombre){
                    this.errorInput = false
                    this.isPeticionSave = true
                    this.$axios.post('familias',{
                        nombre: this.Familia.nombre,
                        codigo: this.Familia.codigo
                    },{
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.state.token
                        }
                    }).then((res)=>{
                        if (res.status === 200){
                            this.cargarFamilias()
                            this.isPeticionSave = false
                            this.sideFamilia = false
                            this.notificacion(
                                `La familia ${this.Familia.nombre} se guardado exitosamente en la base de datos`,
                                'Registro Exitososo',
                                'success'
                            )
                            this.Familia.nombre = ''
                            this.Familia.codigo = ''
                        }
                    }).catch((error)=>{
                        this.isPeticionSave = false
                        if (error.response.status === 422){
                            this.erroresServidor = error.response.data.errors
                        }
                    })
                }else{
                    this.errorInput = true
                }
            },
            notificacion(texto, titulo, color){
                this.$vs.notify({
                    text: texto,
                    title: titulo,
                    color: color,
                    position: 'top-right'
                })
            },
            cargarFamilias(){
                this.isPeticion = true
                this.$axios.get('/familias',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.Familias = res.data.familias
                        this.isPeticion = false
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
