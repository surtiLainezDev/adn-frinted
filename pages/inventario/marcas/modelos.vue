<template>
    <vs-card>
        <vs-progress v-if="isPeticionPrin" color="success" indeterminate></vs-progress>
        <vs-table :data="Modelos" stripe search max-items="10" pagination>
            <template slot="header">
                <div class="row">
                    <div class="col-auto"><h5>Modelos Existentes</h5></div>
                    <div class="col-auto">
                        <vs-button size="small" @click="crearModelo" icon="add" color="success">Crear Módelo</vs-button>
                    </div>
                </div>
            </template>
            <template slot="thead">
                <th>Proveedor</th>
                <th>Marca</th>
                <th>Nombre del Módelo</th>
                <th class="text-center">Acciones</th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" :data="tr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].marca.proveedor.nombre">
                        <vs-chip color="#FFF" style="color: black" >
                            <vs-avatar v-if="data[indextr].marca.proveedor.logo" :src="data[indextr].marca.proveedor.logo"/>
                            <vs-avatar  v-else :text="data[indextr].marca.proveedor.nombre"/>
                            {{data[indextr].marca.proveedor.nombre}}
                        </vs-chip >
                    </vs-td>
                    <vs-td :data="data[indextr].marca.nombre">{{data[indextr].marca.nombre}}</vs-td>
                    <vs-td :data="data[indextr].nombre">{{data[indextr].nombre}}</vs-td>
                    <vs-td class="d-flex justify-content-center">
                        <vs-button size="small" @click="editarModelo(data[indextr])" icon="create" color="warning"></vs-button>
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
                        <select v-model="modelo.proveedor" class="form-control form-control-sm">
                            <option v-for="item in Proveedores" :value="item.id">{{item.nombre}}</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col form-group">
                        <label >Seleccione una Marca</label>
                        <select v-model="modelo.marca" class="form-control form-control-sm">
                            <option v-if="modelo.proveedor === item.proveedor.id"
                                    v-for="item in Marcas" :value="item.id">{{item.nombre}}</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col form-group">
                        <label>Nombre de la Marca</label>
                        <input type="text" class="form-control form-control-sm" v-model="modelo.nombre">
                    </div>
                </div>
                <vs-divider></vs-divider>
                <small class="error" v-if="errorEnvio">Por favor llene todos los campos.</small>
                <div class="row">
                    <div class="col d-flex justify-content-end">
                        <vs-button @click="registrarModeli" :disabled="isPeticion" color="success" v-if="usoSide">Registrar Modelo</vs-button>
                        <vs-button @click="editandoModelo" :disabled="isPeticion" color="success" v-else>Registrar Cambios</vs-button>
                    </div>
                </div>
            </div>
        </b-sidebar>

    </vs-card>

</template>

<script>
    import sideColaboradores from "../../../components/menus/sideColaboradores";
    export default {
        components:{sideColaboradores},
        name: "modelos",
        data(){
            return{
                Modelos: [],
                isPeticionPrin: false,
                isPeticion: false,
                usoSide: true,
                Proveedores: [],
                sideModelo: false,
                tituloSide: null,
                errorEnvio: false,
                modelo:{
                    modelo: null,
                    nombre: null,
                    marca: null,
                    proveedor: null
                },
                Marcas: null
            }
        },
        mounted() {
            this.cargarModelos()
            this.cargarMarcas()
        },
        methods:{
            editarModelo(modelo){
              this.tituloSide = 'Editanto módelo '+modelo.nombre
              this.usoSide = false
              this.sideModelo = true
              this.modelo.proveedor = modelo.marca.proveedor.id
              this.modelo.marca     = modelo.marca.id
              this.modelo.nombre    = modelo.nombre
              this.modelo.modelo    = modelo.id
            },
            editandoModelo(){
                this.isPeticion = true
                this.$axios.put('modelos_proveedor/'+this.modelo.modelo,{
                    marca: this.modelo.marca,
                    nombre: this.modelo.nombre,
                    modelo: this.modelo.modelo
                },{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.isPeticion = false;
                        this.sideModelo = false;
                        this.notificacion(`Se registraron los cambios exitosamente del módelo ${this.modelo.nombre}`,
                        'Registro de cambio exitoso','warning');
                        this.cargarModelos();
                    }
                })
            },
            crearModelo(){
              this.tituloSide = 'Creando un nuevo módelo';
              this.usoSide = true;
              this.sideModelo = true
            },
            registrarModeli(){
                if (this.modelo.proveedor && this.modelo.marca && this.modelo.nombre){
                    this.errorEnvio = false
                    this.isPeticion = true
                    this.$axios.post('modelos_proveedor',{
                        marca: this.modelo.marca,
                        nombre: this.modelo.nombre
                    },{
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.state.token
                        }
                    }).then((res)=>{
                        if (res.status === 200){
                            this.isPeticion = false
                            this.sideModelo = false
                            this.notificacion(`Se ha registrado el módelo ${this.modelo.nombre} exitosamente`,
                            'Registro Exitoso','success');
                            this.modelo.nombre = null
                            this.modelo.marca = null
                            this.modelo.proveedor = null
                            this.cargarModelos()
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
            },
            cargarMarcas(){
                this.isPeticionPrin = true
                this.$axios.get('marcas_proveedor',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.Marcas = res.data.marcas
                        this.isPeticionPrin = false
                        this.cargarProveedores()
                    }
                })
            },
            cargarModelos(){
              this.$axios.get('modelos_proveedor',{
                  headers: {
                      'Authorization': 'Bearer ' + this.$store.state.token
                  }
              }).then((res)=>{
                  if (res.status === 200){
                      this.Modelos = res.data.modelos
                  }
              })
            },
            cargarProveedores(){
                let Verificar = [];
                for (let i in this.Marcas){
                    if (!Verificar.includes(this.Marcas[i].proveedor.id)){
                        Verificar.push(this.Marcas[i].proveedor.id)
                        this.Proveedores.push({
                            'id': this.Marcas[i].proveedor.id,
                            'nombre': this.Marcas[i].proveedor.nombre
                        })
                    }
                }
            }
        }
    }
</script>

<style scoped lang="stylus">
.error
    color red
</style>
