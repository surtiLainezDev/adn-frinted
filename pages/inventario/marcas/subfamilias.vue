<template>
    <vs-card>
        <vs-progress indeterminate v-if="isPeticion" color="success"></vs-progress>
        <vs-table :data="SubFamilias" stripe search max-items="10" pagination>
            <template  slot="header">
                <div class="row">
                    <div class="col-auto">
                        <h5>Familias Registradas</h5>
                    </div>
                    <div class="col-auto">
                        <vs-button icon="add" @click="nuevaSub" color="success" size="small">Crear Sub Familia</vs-button>
                    </div>
                </div>
            </template>
            <template slot="thead">
                <th>Nombre Familia</th>
                <th>Código de la Familia</th>
                <th>Nombre de la Sub-familia</th>
                <th>Código de la Sub-familia</th>
                <th>Acciones</th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" :data="tr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].nombre">{{data[indextr].familia_articulo.nombre}}</vs-td>
                    <vs-td class="text-center" :data="data[indextr].codigo">{{data[indextr].familia_articulo.codigo}}</vs-td>
                    <vs-td :data="data[indextr].codigo">{{data[indextr].nombre}}</vs-td>
                    <vs-td class="text-center" :data="data[indextr].codigo">{{data[indextr].codigo}}</vs-td>
                    <vs-td class="d-flex justify-content-center">
                        <vs-button size="small" @click="editarSubFamilia(data[indextr])" icon="create" color="warning"></vs-button>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>

        <b-sidebar v-model="sideSubFamilia" :title="sideTitulo" right shadow width="450px">
            <div class="px-3 py-2">
                <vs-progress v-if="isPeticionSave" color="success" indeterminate></vs-progress>
                <vs-divider></vs-divider>
                <div class="row">
                    <div class="col form-group">
                        <label>Nombre de la familia</label>
                        <select v-model="SubFamilia.familia" class="form-control-sm form-control">
                            <option v-for="item in Familias" :value="item.id">{{item.nombre}}</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col form-group">
                        <label>Nombre de la sub-familia</label>
                        <input type="text"  class="form-control form-control-sm" v-model="SubFamilia.nombre">
                    </div>
                </div>
                <vs-divider></vs-divider>
                <small style="color: red" v-if="errorInput">Por favor llene todos los campos.</small>
                <div class="row">
                    <div class="col d-flex justify-content-end">
                        <vs-button @click="registrarSubFamilia" :disabled="isPeticionSave" color="success" v-if="sideUso">Registrar Sub-Familia</vs-button>
                        <vs-button @click="editandoSubFamilia" :disabled="isPeticionSave" color="success" v-else>Registrar Cambios</vs-button>
                    </div>
                </div>
            </div>
        </b-sidebar>
    </vs-card>
</template>

<script>
    export default {
        name: "subfamilias",
        data(){
            return{
                isPeticion: false,
                SubFamilias: [],
                sideSubFamilia : false,
                sideUso: false,
                sideTitulo: null,
                SubFamilia:{
                    nombre: '',
                    familia: null,
                    sub: ''
                },
                Familias: null,
                isPeticionSave: false,
                errorInput: false
            }
        },
        created() {
            this.cargarSubFamilias()
            this.cargarFamilias();
        },
        methods:{
            nuevaSub(){
                this.sideTitulo = 'Creando una nueva sub-familia'
                this.SubFamilia.familia = null
                this.SubFamilia.nombre = ''
                this.SubFamilia.sub = ''
                this.sideSubFamilia = true
                this.sideUso = true
            },
            registrarSubFamilia(){
                if (this.SubFamilia.nombre && this.SubFamilia.familia){
                    this.errorInput = false
                    this.isPeticionSave = true
                    this.$axios.post('sub_familias',{
                        familia: this.SubFamilia.familia,
                        nombre: this.SubFamilia.nombre
                    },{
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.state.token
                        }
                    }).then((res)=>{
                        if (res.status === 200){
                            this.cargarSubFamilias()
                            this.cargarFamilias()
                            this.isPeticionSave = false
                            this.sideSubFamilia = false
                            this.notificacion(`Se ha registrado exitosamente ${this.SubFamilia.nombre} exitosamente en la base de datos`,
                            'Registro Exitoso','success')
                            this.SubFamilia.nombre = ''
                            this.SubFamilia.familia = null
                        }
                    })
                }else {
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
            editandoSubFamilia(){
                if (this.SubFamilia.nombre && this.SubFamilia.familia){
                    this.errorInput = false
                    this.isPeticionSave = true
                    this.$axios.put('sub_familias/'+this.SubFamilia.sub,{
                        familia: this.SubFamilia.familia,
                        nombre: this.SubFamilia.nombre
                    },{
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.state.token
                        }
                    }).then((res)=>{
                        if (res.status === 200){
                            this.cargarSubFamilias()
                            this.cargarFamilias()
                            this.isPeticionSave = false
                            this.sideSubFamilia = false
                            this.notificacion(`Se ha registrado el cambio exitosamente ${this.SubFamilia.nombre} exitosamente en la base de datos`,
                                'Registro Exitoso','success')
                            this.SubFamilia.nombre = ''
                            this.SubFamilia.familia = null
                        }
                    })
                }else {
                    this.errorInput = true
                }
            },
            editarSubFamilia(item){
                this.sideTitulo = `Editando sub-familia ${item.nombre}`
                this.SubFamilia.familia = item.familia_articulo.id
                this.SubFamilia.nombre = item.nombre
                this.SubFamilia.sub = item.id
                this.sideSubFamilia = true
                this.sideUso = false
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
            },
            cargarSubFamilias(){
                this.isPeticion = true
                this.$axios.get('/sub_familias',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.SubFamilias = res.data.Sfamilias
                        this.isPeticion = false
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
