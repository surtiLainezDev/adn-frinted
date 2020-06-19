<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2"><side-colaboradores/></div>
            <div class="col-md-10">
                <tituloh5 titulo="Ciudades/Aldeas/Caserios"/>
                <div class="row">
                    <div class="col-md-5 form-group">
                        <label>Seleccionar Departamento</label>
                        <select v-model="ciudad.departamento" class="form-control form-control-sm">
                            <option v-for="item in Departamentos" :value="item.id">{{item.nombre}}</option>
                        </select>
                    </div>
                    <div class="col-md-5 form-group">
                        <label>Seleccionar Municipio</label>
                        <select v-model="ciudad.municipio" class="form-control form-control-sm">
                            <option v-for="i in Municipios" v-if="ciudad.departamento === i.depto" :value="i.id">{{i.nombre}}</option>
                        </select>
                    </div>
                    <div class="col-md-2 d-flex justify-content-start align-items-center">
                        <vs-button color="success" :disabled="isPeticion" @click="cargarCiudades">Buscar </vs-button>
                    </div>
                </div>
                <div class="row" v-if="errorBuscar">
                    <div class="col" style="color: red"><small>Tienes que llenar todos los campos</small></div>
                </div>
                <vs-progress v-if="isPeticion" indeterminate color="success"></vs-progress>
                <vs-divider></vs-divider>

                <vs-table :data="Ciudades" search stripe max-items="8" pagination>
                    <template slot="header">
                        <div class="row">
                            <div class="col-auto"><h6>Ciudades/Aldeas/Caserios de</h6></div>
                            <div class="col-auto">
                                <vs-button icon="add" color="success" @click="nuevaCiudad"
                                           type="flat" size="small">Agregar Ciudad</vs-button>
                            </div>
                        </div>
                    </template>
                    <template slot="thead">
                        <th>Departamento</th>
                        <th>Municipio</th>
                        <th>Nombre</th>
                        <th>Tipo</th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" :data="tr" v-for="(tr, indextr) in data">
                            <vs-td>
                                {{data[indextr].municipio.departamento.nombre}}
                            </vs-td>
                            <vs-td :data="data[indextr].municipio.nombre">{{data[indextr].municipio.nombre}}</vs-td>
                            <vs-td :data="data[indextr].nombres">{{data[indextr].nombres}}</vs-td>
                            <vs-td :data="data[indextr].municipio.tipo">{{data[indextr].tipo}}</vs-td>
<!--                            <vs-td class="d-flex justify-content-center">-->
<!--                                <vs-button size="small" @click="editarMarca(data[indextr])" icon="create" color="warning"></vs-button>-->
<!--                            </vs-td>-->
                        </vs-tr>
                    </template>
                </vs-table>
            </div>


            <b-sidebar v-model="sideCiudades" :title="tituloSide" right shadow width="450px">
                <div class="px-3 py-2">
                    <vs-progress v-if="isPeticionC" color="success" indeterminate></vs-progress>
                    <div class="row">
                        <div class="col form-group">
                            <label>Seleccionar Departamento</label>
                            <select v-model="ciudad.departamento" class="form-control form-control-sm">
                                <option v-for="item in Departamentos" :value="item.id">{{item.nombre}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col form-group">
                            <label>Seleccionar Municipio</label>
                            <select v-model="ciudad.municipio" class="form-control form-control-sm">
                                <option v-for="i in Municipios" v-if="ciudad.departamento === i.depto" :value="i.id">{{i.nombre}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col form-group">
                            <label>Nombre de la ciudad/aldea/cacerio</label>
                            <input type="text" class="form-control form-control-sm" v-model="ciudad.nombre">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col"><vs-radio v-model="ciudad.tipo" vs-name="tipo" vs-value="Ciudad">Ciudad</vs-radio></div>
                        <div class="col"><vs-radio v-model="ciudad.tipo" vs-name="tipo" vs-value="Aldea">Aldea</vs-radio></div>
                        <div class="col"><vs-radio v-model="ciudad.tipo" vs-name="tipo" vs-value="Cacerío">Cacerío</vs-radio></div>
                    </div>
                    <vs-divider></vs-divider>
                    <div class="row">
                        <div class="col d-flex justify-content-end">
                            <vs-button color="success" @click="registrarCiudad" :disabled="isPeticionC" v-if="usoSide">Registrar</vs-button>
                        </div>
                    </div>
                    <small style="color: red" v-if="errorEnvio">Llene todo los campos</small>
                </div>
            </b-sidebar>
        </div>
    </vs-card>
</template>

<script>
    import sideColaboradores from "../../components/menus/sideColaboradores";
    import tituloh5 from "../../components/tituloh5";
    export default {
        components:{
            sideColaboradores, tituloh5
        },
        data(){
          return{
              sideCiudades: false,
              isPeticionC: false,
              tituloSide: null,
              isPeticion: false,
              Departamentos: null,
              Municipios: [],
              ciudad:{
                  municipio: null,
                  departamento: null,
                  tipo:null,
                  nombre:null
              },
              Ciudades: [],
              usoSide: true,
              errorEnvio: false,
              errorBuscar:false
          }
        },
        created() {
           this.cargarProveedores()
        },
        methods:{
            nuevaCiudad(){
              this.sideCiudades = true;
              this.tituloSide = 'Creando nueva ciudad/aldea/caserio';
              this.usoSide = true
            },
            registrarCiudad(){
                if (this.ciudad.nombre && this.ciudad.tipo && this.ciudad.municipio){
                    this.errorEnvio = false
                    this.isPeticionC = true
                    this.$axios.post('ciudades',{
                        municipio: this.ciudad.municipio,
                        nombre:    this.ciudad.nombre,
                        tipo:      this.ciudad.tipo
                    },{
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.state.token
                        }
                    }).then((res)=>{
                        if (res.status === 200){
                            this.isPeticionC = false
                            this.sideCiudades = false
                            this.notificacion(`Se registró ${this.ciudad.nombre} como ${this.ciudad.tipo}`,
                            'Registro Exitoso','success')
                            this.isPeticion = false
                            this.ciudad.departamento = null
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
            cargarProveedores(){
              this.isPeticion = true
              this.$axios.get('departamentos',{
                  headers: {
                      'Authorization': 'Bearer ' + this.$store.state.token
                  }
              }).then((res)=>{
                  if (res.status = 200){
                      this.isPeticion = false
                      this.Departamentos = res.data.depto
                      this.cargarMunicipios()
                  }
              })
            },
            cargarMunicipios(){
                for(let i in this.Departamentos){
                    for (let e in this.Departamentos[i].municipios){
                        this.Municipios.push({
                            'id': this.Departamentos[i].municipios[e].id,
                            'nombre': this.Departamentos[i].municipios[e].nombre,
                            'depto':  this.Departamentos[i].municipios[e].departamento_id
                        })
                    }
                }
            },
            cargarCiudades(){
                if (this.ciudad.departamento && this.ciudad.municipio){
                    this.errorBuscar = false
                    this.isPeticion = true
                    this.$axios.get('ciudades/'+this.ciudad.municipio,{
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.state.token
                        }
                    }).then((res)=>{
                        if (res.status === 200){
                            this.isPeticion = false;
                            this.Ciudades = res.data.ciudades;
                        }
                    })
                }else{
                    this.errorBuscar = true
                }
            }
        },
        name: "ciudad"
    }
</script>

<style scoped>

</style>
