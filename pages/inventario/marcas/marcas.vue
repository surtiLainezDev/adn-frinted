<template>
    <vs-card>
        <div>
            <vs-progress v-if="isPeticionPrin" color="success" indeterminate></vs-progress>
            <vs-table :data="Marcas" stripe search max-items="10" pagination>
                <template slot="header">
                    <div class="row">
                        <div class="col-auto"><h5>Marcas Existentes</h5></div>
                        <div class="col-auto">
                            <vs-button size="small" @click="nuevaMarca" color="success" style="margin-right: 5px"  icon="add">Agregar Marca</vs-button>
                        </div>
                    </div>
                </template>
                <template slot="thead">
                    <th>Proveedor</th>
                    <th>Marca</th>
                    <th class="text-center">Acciones</th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" :data="tr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].proveedor.nombre">
                            <vs-chip color="#FFF" style="color: black" >
                                <vs-avatar v-if="data[indextr].proveedor.logo" :src="data[indextr].proveedor.logo"/>
                                <vs-avatar  v-else :text="data[indextr].proveedor.nombre"/>
                                {{data[indextr].proveedor.nombre}}
                            </vs-chip >
                        </vs-td>
                        <vs-td :data="data[indextr].nombre">{{data[indextr].nombre}}</vs-td>
                        <vs-td class="d-flex justify-content-center">
                            <vs-button size="small" @click="editarMarca(data[indextr])" icon="create" color="warning"></vs-button>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>

            <b-sidebar v-model="sideModelo" :title="tituloSide" right shadow width="450px">
                <div class="px-3 py-2">
                    <vs-progress v-if="isPeticion" color="success" indeterminate></vs-progress>
                    <vs-divider></vs-divider>
                    <div class="row">
                        <div class="col form-group">
                            <label >Seleccione un proveedor</label>
                            <select v-model="marca.proveedor" class="form-control form-control-sm">
                                <option v-for="item in Proveedores" :value="item.id">{{item.nombre}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col form-group">
                            <label>Nombre de la Marca</label>
                            <input type="text" class="form-control form-control-sm" v-model="marca.nombre">
                        </div>
                    </div>
                    <vs-divider></vs-divider>
                    <small class="error" v-if="errorEnvio">Por favor llene todos los campos.</small>
                    <div class="row">
                        <div class="col d-flex justify-content-end">
                            <vs-button @click="registrarMarca" :disabled="isPeticion" color="success" v-if="usoSide === 1">Registrar Marca</vs-button>
                            <vs-button @click="editandoMarca" :disabled="isPeticion" color="success" v-if="usoSide === 2">Registrar Cambios</vs-button>
                        </div>
                    </div>
                </div>
            </b-sidebar>

        </div>
    </vs-card>
</template>

<script>
    export default {
        name: "marcas",
        data(){
            return{
                Marcas: [],
                sideModelo:false,
                tituloSide: null,
                isPeticion: false,
                marca:{
                    proveedor: null,
                    nombre: null,
                    marca: null
                },
                Proveedores: null,
                isPeticionPrin: false,
                usoSide: null,
                errorEnvio: false
            }
        },
        created() {
            this.cargarMarcas()
            this.cargarProveedores()
        },
        methods:{
            editandoMarca(){
                if (this.marca.nombre && this.marca.proveedor){
                    this.isPeticion = true
                    this.errorEnvio = false
                    this.$axios.put('marcas_proveedor/'+this.marca.marca,{
                        nombre: this.marca.nombre,
                        proveedor: this.marca.proveedor
                    },{
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.state.token
                        }
                    }).then((res)=>{
                        if (res.status === 200){
                            this.isPeticion= false
                            this.sideModelo = false
                            this.marca.proveedor = null
                            this.marca.marca = null
                            this.notificacion(`Se registraron los cambios en la marca ${this.marca.nombre}`,
                                'Registro de cambios exitoso','warning')
                            this.cargarMarcas();

                        }
                    })
                }else {
                    this.errorEnvio = true
                }
            },
            editarMarca(marca){
                this.tituloSide = 'Editando marca '+marca.nombre;
                this.usoSide = 2
                this.sideModelo = true
                this.marca.nombre = marca.nombre
                this.marca.proveedor = marca.proveedor.id
                this.marca.marca = marca.id
            },
            nuevaMarca(){
                this.tituloSide = 'Creando Marca Nueva';
                this.usoSide = 1
                this.sideModelo = true
            },
            cargarMarcas(){
              this.$axios.get('marcas_proveedor',{
                  headers: {
                      'Authorization': 'Bearer ' + this.$store.state.token
                  }
              }).then((res)=>{
                  if (res.status === 200){
                      this.Marcas = res.data.marcas
                  }
              })
            },
            cargarProveedores(){
                this.isPeticionPrin = true
                this.$axios.get('proveedores',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.Proveedores = res.data.proveedores
                        this.isPeticionPrin = false
                    }
                })
            },
            registrarMarca(){
                if (this.marca.nombre && this.marca.proveedor){
                    this.errorEnvio = false
                    this.isPeticion = true
                    this.$axios.post('marcas_proveedor',{
                        nombre: this.marca.nombre,
                        proveedor: this.marca.proveedor
                    },{
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.state.token
                        }
                    }).then((res)=>{
                        if (res.status === 200){
                            this.cargarMarcas()
                            this.sideModelo = false
                            this.isPeticion = false
                            this.marca.proveedor = null
                            this.notificacion(`Se ha registrado la marca ${this.marca.nombre}`,
                            'Registro Exitoso','success')
                            this.marca.nombre = null
                        }
                    })
                }else{
                    this.errorEnvio = true
                }
            },
            notificacion(texto, titulo, color){
                this.$vs.notify({
                    text: texto,
                    title: titulo,
                    color: color,
                    position: 'top-right'
                })
            }
        }
    }
</script>

<style scoped lang="stylus">
.error
    color red
</style>
